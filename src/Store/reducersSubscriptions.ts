import { Dispatch } from "redux";
import {
  makeActionsSet,
  makeReducers,
  makeAsyncActionCreatorSimp,
  makeActionCreator,
} from "../common/utils/redux-helpers";

import * as Queries from "./queries";

import ReduxDataTypes, { TimesheetStatus } from "./DataTypes";

import { credentials } from "../Services/Services";
import Subscriptions from "../Services/Subscriptions";
import insertByKey from "../common/utils/insertByKey";
import { getTimesheets } from "./reducersTimesheets";
import { getEntryById, clearEntry } from "./reducersEntries";

const SUBSCRIPTION_INIT = makeActionsSet("SUBSCRIPTION_INIT");
const SUBSCRIPTION_UPDATE = "SUBSCRIPTION_UPDATE";
const SUBSCRIPTION_REGISTER = makeActionsSet("SUBSCRIPTION_REGISTER");

const auth = JSON.parse(window.localStorage.auth);
const wsSubscriptions = new Subscriptions(
  credentials.apiServer,
  auth.skedApiAccessToken
);

export const initSubscriptionService = makeAsyncActionCreatorSimp(
  SUBSCRIPTION_INIT,
  () => async () => {
    try {
      const resp = await wsSubscriptions.initConnection();
      return resp;
      // tslint:disable-next-line: no-console
    } catch (error) {
      console.warn("Couldn't connect to WS", error);
      return error;
    }
  }
);

export const handleUpdateMessage = makeActionCreator(SUBSCRIPTION_UPDATE);

export const registerNewSubscription = makeAsyncActionCreatorSimp(
  SUBSCRIPTION_REGISTER,
  (subscriptionName: string, fetch: boolean, variables?: {}) =>
    (dispatch: Dispatch) => {
      wsSubscriptions.registerSubscription({
        subscriptionName,
        query: Queries.subscriptions[subscriptionName],
        variables: variables || {},
        fetchMore: fetch,
        dispatch,
      });
    }
);

enum Operation {
  Insert = "INSERT",
  Update = "UPDATE",
  Delete = "DELETE",
}

interface TimesheetEntryChangePayload {
  schemaTimesheetEntry: {
    operation: Operation;
    data: Omit<
      ReduxDataTypes.TimesheetEntry,
      | "Activity"
      | "DistanceUnit"
      | "Duration"
      | "Job"
      | "Shift"
      | "Timesheet"
      | "Unavailability"
    >;
  };
}

interface TimesheetChangePayload {
  schemaTimesheet: {
    operation: Operation;
    data: {
      UID: string;
      Status: TimesheetStatus;
      ApprovedDate: string;
      ApproverComments: string;
      SubmitterComments: string;
    };
    previous: {
      Status: TimesheetStatus;
    };
  };
}

export const fetchMoreHandler: {
  [key: string]:
    | ((data: TimesheetChangePayload) => (dispatch: Dispatch) => void)
    | ((data: TimesheetEntryChangePayload) => (dispatch: Dispatch) => void);
} = {
  TimesheetUpdate: (data: TimesheetChangePayload) => (dispatch: Dispatch) => {
    const {
      schemaTimesheet: { operation },
    } = data;
    dispatch(
      handleUpdateMessage({
        data,
        subscriptionName: "TimesheetUpdate",
      })
    );
    if (operation === Operation.Insert) {
      dispatch(getTimesheets());
    }
  },
  TimesheetEntryChange:
    (data: TimesheetEntryChangePayload) => (dispatch: Dispatch) => {
      const {
        schemaTimesheetEntry: {
          operation,
          data: { UID, TimesheetId },
        },
      } = data;
      if (operation === Operation.Insert || operation === Operation.Update) {
        dispatch(getEntryById(UID));
      } else if (operation === Operation.Delete) {
        dispatch(clearEntry(UID, TimesheetId));
      }
    },
};

const updateHandlers: {
  [key: string]: (
    data: TimesheetChangePayload,
    state: ReduxDataTypes.State
  ) => void;
} = {
  TimesheetUpdate: (
    data: TimesheetChangePayload,
    state: ReduxDataTypes.State
  ) => {
    const {
      schemaTimesheet: {
        operation,
        data: {
          Status,
          ApprovedDate,
          ApproverComments,
          SubmitterComments,
          UID,
        },
      },
    } = data;

    if (operation === Operation.Insert) {
      return state;
    }
    const { timesheetData } = state;

    if (timesheetData && timesheetData.length) {
      const timesheet = timesheetData.find(
        ({ UID: savedUID }) => UID === savedUID
      );
      if (timesheet) {
        const newData = {
          ...timesheet,
          Status: Status || timesheet.Status,
          ApprovedDate: ApprovedDate || timesheet.ApprovedDate,
          ApproverComments: ApproverComments || timesheet.ApproverComments,
          SubmitterComments: SubmitterComments || timesheet.SubmitterComments,
        };
        return {
          ...state,
          timesheetData: insertByKey(timesheetData, "UID", newData),
        };
      }
    }
    return state;
  },
};

export interface LocationUpdatePayload {
  latitude: number;
  longitude: number;
  resourceId: string;
  time: string;
}

export const subscriptionReducers = {
  ...makeReducers(SUBSCRIPTION_INIT, {
    transform: ({ connectionStatus }: { connectionStatus: string }) => {
      return { subscriptionStatus: connectionStatus };
    },
  }),
  [SUBSCRIPTION_UPDATE]: (
    state: ReduxDataTypes.State,
    message: { subscriptionName: string; data: TimesheetChangePayload }
  ) => {
    const { subscriptionName, data } = message;
    return updateHandlers[subscriptionName](data, state);
  },
};
