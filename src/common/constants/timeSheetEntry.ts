import ReduxDataTypes from "../../StoreV2/DataTypes";

export const ITEMS_PER_PAGE = 25;

export const DEFAULT_TS_ENTRY_PAGINATION = {
  entriesPerPage: ITEMS_PER_PAGE,
  page: 0,
};

export const TS_ENTRY_TYPE = {
  SHIFT: "Shift",
  UNAVAILABILITY: "Unavailability",
  JOB: "Job",
  ACTIVITY: "Activity",
  MANUAL: "Manual",
};

export const getEntryTimezone = (entry: ReduxDataTypes.TimesheetEntry) => {
  switch (entry.EntryType) {
    case "Job":
      return entry.Job ? entry.Job.Timezone : null;
    case "Activity":
      return entry.Activity ? entry.Activity.Timezone : null;
    default:
      return null;
  }
};
