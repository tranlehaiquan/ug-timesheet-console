import { format } from "date-fns";
import { Dispatch } from "redux";
import { mergeDateFields } from "../common/utils/mergeDateFields";
import { getTimesheets } from "../Store/reducersTimesheets";
import { getEntryById, clearEntry } from "../Store/reducersEntries";
import { Services } from "../Services/Services";
import {
  createTimesheetQuery,
  createTimesheetEntryQuery,
  deleteTimesheetQuery,
  updateTimesheetsStatusQuery,
  updateTimesheetEntryQuery,
  deleteTimesheetEntryQuery,
} from "./inputQueries";
import { TimesheetStatus } from "../components/timesheets-table/TimesheetsTable";

import {
  makeActionsSet,
  makeReducers,
  makeAsyncActionCreatorSimp,
} from "../common/utils/redux-helpers";
import { ReduxDataTypes, UID } from "../Store/DataTypes";

interface CreationResp {
  schema: { insertTimesheet: UID };
}
interface UpdateResp {
  schema: { updateTimesheet: UID };
}
interface UpdateTimesheetEntryResp {
  schema: { updateTimesheetEntry: UID };
}
interface DeleteResp {
  schema: { deleteTimesheet: UID };
}
interface DeleteTimesheetEntryResp {
  schema: { deleteTimesheetEntry: UID };
}

const ENTRY_UPDATE = makeActionsSet("ENTRY_UPDATE");
const ENTRY_CREATE = makeActionsSet("ENTRY_CREATE");
const ENTRY_DELETE = makeActionsSet("ENTRY_DELETE");
const TIMESHEET_CREATE = makeActionsSet("TIMESHEET_CREATE");
const TIMESHEET_STATUS_UPDATE = makeActionsSet("TIMESHEET_STATUS_UPDATE");
const TIMESHEET_DELETE = makeActionsSet("TIMESHEET_DELETE");

export const createTimesheet = makeAsyncActionCreatorSimp(
  TIMESHEET_CREATE,
  (createInput: ReduxDataTypes.Timesheet) =>
    async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
      const { vendor } = getState();
      const {
        schema: { insertTimesheet },
      } = await Services.graphQL.mutate<CreationResp>({
        query: createTimesheetQuery,
        variables: {
          createInput,
        },
      });
      if (vendor === ReduxDataTypes.VendorType.SALESFORCE) {
        dispatch(getTimesheets());
      }
      return insertTimesheet;
    }
);

export const updateTimesheetEntry = makeAsyncActionCreatorSimp(
  ENTRY_UPDATE,
  (updateInput: ReduxDataTypes.TimesheetEntry) =>
    async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
      const { vendor } = getState();
      const {
        schema: { updateTimesheetEntry: updatedEntry },
      } = await Services.graphQL.mutate<UpdateTimesheetEntryResp>({
        query: updateTimesheetEntryQuery,
        variables: {
          updateInput:
            vendor === ReduxDataTypes.VendorType.SKEDULO
              ? updateInput
              : mergeDateFields(updateInput),
        },
      });
      dispatch(getEntryById(updateInput.UID));
      return updatedEntry;
    }
);

export const createTimesheetEntry = makeAsyncActionCreatorSimp(
  ENTRY_CREATE,
  (entries: ReduxDataTypes.TimesheetEntry[]) =>
    async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
      const { vendor } = getState();
      const variables = entries.reduce(
        (acc, entry, index) => ({
          ...acc,
          [`input${index}`]:
            vendor === ReduxDataTypes.VendorType.SKEDULO
              ? entry
              : mergeDateFields(entry),
        }),
        {}
      );

      const result = await Services.graphQL.mutate<CreationResp>({
        variables,
        query: createTimesheetEntryQuery(entries.length),
      });

      if (vendor === ReduxDataTypes.VendorType.SALESFORCE) {
        Object.values(result).forEach((entryResult) =>
          dispatch(getEntryById(Object.values(entryResult).pop()))
        );
      }

      const {
        schema: { insertTimesheet },
      } = result;
      return insertTimesheet;
    }
);

export const updateTimesheetsStatus = makeAsyncActionCreatorSimp(
  TIMESHEET_STATUS_UPDATE,
  (
      timesheetsUIDs: UID[],
      status: TimesheetStatus,
      comment: string,
      userId: string
    ) =>
    async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
      const { vendor } = getState();
      const variables = timesheetsUIDs.reduce(
        (acc, uid, index) => ({
          ...acc,
          [`input${index}`]: getUpdateTimesheetStatusVariables(
            uid,
            status,
            comment,
            userId
          ),
        }),
        {}
      );

      const {
        schema: { updateTimesheet },
      } = await Services.graphQL.mutate<UpdateResp>({
        variables,
        query: updateTimesheetsStatusQuery(timesheetsUIDs.length),
      });

      if (vendor === ReduxDataTypes.VendorType.SALESFORCE) {
        dispatch(getTimesheets());
      } else {
        // cheating to force reloading Timesheets
        dispatch(getTimesheets());
      }

      return updateTimesheet;
    }
);

// TODO: do we have to manually delete connected timesheet entries?
export const deleteTimesheet = makeAsyncActionCreatorSimp(
  TIMESHEET_DELETE,
  (uid: UID) => async () => {
    const {
      schema: { deleteTimesheet: deletedUID },
    } = await Services.graphQL.mutate<DeleteResp>({
      query: deleteTimesheetQuery,
      variables: {
        deleteInput: uid,
      },
    });
    return deletedUID;
  }
);

export const deleteTimesheetEntry = makeAsyncActionCreatorSimp(
  ENTRY_DELETE,
  (uid: UID) =>
    async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
      const { vendor } = getState();
      const {
        schema: { deleteTimesheetEntry: deletedEntryUID },
      } = await Services.graphQL.mutate<DeleteTimesheetEntryResp>({
        query: deleteTimesheetEntryQuery,
        variables: {
          deleteInput: uid,
        },
      });

      if (vendor === ReduxDataTypes.VendorType.SALESFORCE) {
        dispatch(clearEntry(uid));
      }

      return deletedEntryUID;
    }
);

const getUpdateTimesheetStatusVariables: (
  uid: string,
  status: TimesheetStatus,
  comment: string,
  userId: string
) => Partial<ReduxDataTypes.Timesheet> = (uid, status, comment, userId) => {
  const date = format(new Date(), "yyyy-MM-dd");
  const commonVariables = {
    UID: uid,
    Status: status,
  };
  if (status === "Approved" || status === "Rejected") {
    return {
      ...commonVariables,
      ApproverComments: comment,
      ApprovedDate: date,
      ApprovedById: userId,
    };
  }
  if (status === "Submitted") {
    return {
      ...commonVariables,
      ApprovedById: null,
      ApproverComments: null,
      ApprovedDate: null,
      SubmitterComments: comment,
    };
  }

  return commonVariables;
};

export const inputReducers = {
  ...makeReducers(TIMESHEET_CREATE, {}),
};
