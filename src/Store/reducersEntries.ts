import { Dispatch } from "redux";
import {
  makeActionsSet,
  makeReducers,
  makeAsyncActionCreatorSimp,
  makeActionCreator,
} from "../common/utils/redux-helpers";
import insertByKey from "../common/utils/insertByKey";
import { splitDateFields } from "../common/utils/splitDateFields";

import * as Queries from "./queries";

import {
  calculateStats,
  reduceTimesheetEntriesData,
  formatEntryData,
} from "./reducersTimesheets";

import ReduxDataTypes, { UID } from "./DataTypes";
import { dataService } from "../Services/DataServices";

const ENTRY_GET = makeActionsSet("ENTRY_GET");
const ENTRY_CLEAR = "ENTRY_CLEAR";

interface EntryGetResponse {
  timesheetEntryById: ReduxDataTypes.TimesheetEntry;
  type: string;
}

export const getEntryById = makeAsyncActionCreatorSimp(
  ENTRY_GET,
  (UID: UID) =>
    async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
      const { vendor } = getState();
      const resp = await dataService.fetchGraphQl<EntryGetResponse>({
        query: Queries.EntryGetQuery(vendor),
        variables: {
          UID,
        },
      });
      return resp;
    }
);

const entryGetTransform = (
  data: EntryGetResponse,
  store: ReduxDataTypes.State
) => {
  let newEntry = data.timesheetEntryById;

  if (store.vendor === ReduxDataTypes.VendorType.SALESFORCE) {
    newEntry = splitDateFields(newEntry);
  }

  newEntry = formatEntryData(data.timesheetEntryById);

  const timesheetData = store.timesheetData;
  if (timesheetData) {
    const entryTimesheet = timesheetData.find(
      ({ UID }) => UID === newEntry.TimesheetId
    );
    if (entryTimesheet) {
      const alreadyStoredIndex = entryTimesheet.Entries.findIndex(
        (entry) => entry.UID === newEntry.UID
      );
      const newEntries =
        alreadyStoredIndex === -1
          ? [...entryTimesheet.Entries, newEntry]
          : [
              ...entryTimesheet.Entries.slice(0, alreadyStoredIndex),
              newEntry,
              ...entryTimesheet.Entries.slice(alreadyStoredIndex + 1),
            ];

      newEntries.sort((entry1, entry2) =>
        `${entry1.StartDate} ${entry1.StartTime}` <
        `${entry2.StartDate} ${entry2.StartTime}`
          ? -1
          : 1
      );

      const newTimesheet = reduceTimesheetEntriesData({
        ...entryTimesheet,
        Entries: newEntries,
      });

      const newTimesheetData = insertByKey(timesheetData, "UID", newTimesheet);
      const newStats = calculateStats(newTimesheetData);

      return {
        ...newStats,
        timesheetData: insertByKey(timesheetData, "UID", newTimesheet),
      };
    }
  }
  return {};
};

export const clearEntry = makeActionCreator(ENTRY_CLEAR, null, [
  "entryId",
  "timesheetId",
]);

const entryClearReducer = (
  state: ReduxDataTypes.State,
  { entryId, timesheetId }: { entryId: UID; timesheetId: UID }
) => {
  const { timesheetData } = state;
  if (timesheetData) {
    const entryTimesheet = timesheetId
      ? timesheetData.find((timesheet) => timesheet.UID === timesheetId)
      : timesheetData.find(
          (timesheet) =>
            !!timesheet.Entries.find((entry) => entry.UID === entryId)
        );
    if (entryTimesheet) {
      const newTimesheet = reduceTimesheetEntriesData({
        ...entryTimesheet,
        Entries: entryTimesheet.Entries.filter(
          (entry) => entry.UID !== entryId
        ),
      });

      const newTimesheetData = insertByKey(timesheetData, "UID", newTimesheet);
      const newStats = calculateStats(newTimesheetData);

      return {
        ...state,
        ...newStats,
        timesheetData: insertByKey(timesheetData, "UID", newTimesheet),
      };
    }
  }

  return state;
};

export const entriesReducers = {
  ...makeReducers(ENTRY_GET, { transform: entryGetTransform }),
  [ENTRY_CLEAR]: entryClearReducer,
};
