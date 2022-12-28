import { Dispatch } from "redux";
import moment from "moment";
import { differenceInMinutes } from "date-fns";
import { autoPaginationGraphqlRequest } from "../Services/GraphQLServices";
import { calculateDurationInMinutes } from "../common/utils/dateTimeHelpers";
import {
  makeActionsSet,
  makeAsyncActionCreatorSimp,
  makeActionCreator,
  makeReducers,
} from "../common/utils/redux-helpers";
import { toastMessage } from "../common/utils/notificationUtils";

import * as Queries from "./queries";
import ReduxDataTypes from "./DataTypes";
// import { Services } from '../Services/Services'

// import { splitDateFields } from '../common/utils/splitDateFields'

const TIMESHEET = makeActionsSet("TIMESHEET");
const CLEAR_TIMESHEET_DATA = "CLEAR_TIMESHEET_DATA";

export const clearTimesheetData = makeActionCreator(CLEAR_TIMESHEET_DATA);

export const calculateStats = (
  timesheetData: ReduxDataTypes.TimesheetData[]
) => {
  const summary = {
    jobs: 0,
    distance: 0,
    logged: 0,
    unavailability: 0,
  };
  const workload: { [key: string]: number } = {};
  timesheetData.forEach(({ Distance, Logged, Unavailability, Entries }) => {
    if (Distance) summary.distance += Distance;
    if (Logged) summary.logged += Logged;
    if (Unavailability) summary.unavailability += Unavailability;

    Entries.forEach(({ EntryType, Job }) => {
      if (EntryType === "Job") {
        summary.jobs += 1;
        if (Job) {
          const { Type } = Job;
          if (!workload[Type]) {
            workload[Type] = 1;
          } else {
            workload[Type] += 1;
          }
        }
      }
    });
  });
  return { summary, workload };
};

const dateFilter = (startDate: string, endDate: string) =>
  `StartDate >= ${startDate} AND EndDate <= ${endDate}`;
const arrayFilter = (array: string[]) =>
  `[${array.map((element) => `'${element}'`).join(",")}]`;
const formatFilterValue = (valueArray: string[]) =>
  valueArray.length === 1
    ? `== "${valueArray[0]}"`
    : `IN ${arrayFilter(valueArray)}`;

const createAllTimesheetsFilters = (store: ReduxDataTypes.State) => {
  const {
    timeRange: { startDate, endDate },
    filters,
  } = store;

  const appliedFilters = filters
    .filter((filter) => filter.value && filter.value.length > 0)
    .map(({ value, selector }) => `${selector} ${formatFilterValue(value)}`);
  const dateFilters = dateFilter(startDate, endDate);
  return [dateFilters, ...appliedFilters].join(" AND ");
};

export const getTimesheets = makeAsyncActionCreatorSimp(
  TIMESHEET,
  () => async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
    const store = getState();
    const filters = createAllTimesheetsFilters(store);
    try {
      const timesheet =
        await autoPaginationGraphqlRequest<ReduxDataTypes.Timesheet>(
          Queries.AllTimesheetsQuery(store.vendor),
          "timesheet",
          {
            filters,
          },
          ["UID"]
        );
      return { timesheet };
    } catch (errs) {
      if (errs && store.settings.showErrorMessage) {
        const messages = (errs as { message: string }[])
          .map((err: { message: string }) => err.message)
          .join(", ");
        toastMessage.error(messages);
      }
      return { timesheet: [] };
    }
  }
);

const calculateMissingFields = (
  timesheet: ReduxDataTypes.TimesheetSummaryFields,
  entry: ReduxDataTypes.TimesheetEntry
) => {
  const Distance = (timesheet.Distance || 0) + (entry.Distance || 0);
  let Logged = timesheet.Logged || 0;
  let Unavailability = timesheet.Unavailability || 0;
  let Activity = timesheet.Activity || 0;
  let Job = timesheet.Job || 0;
  let Manual = timesheet.Manual || 0;
  let Shift = timesheet.Shift || 0;

  const startDate = moment(
    `${entry.StartDate} ${entry.StartTime}`,
    "YYYY-MM-DD HH:mm"
  );
  const endDate = moment(
    `${entry.EndDate} ${entry.EndTime}`,
    "YYYY-MM-DD HH:mm"
  );

  const actualDuration = entry.ActualDuration ? entry.ActualDuration / 60 : 0;
  const duration =
    actualDuration ||
    Math.round(
      (differenceInMinutes(endDate.toDate(), startDate.toDate()) / 60) * 100
    ) / 100;
  if (entry.EntryType === "Job") {
    Job += duration;
  }

  if (entry.EntryType === "Shift") {
    Shift += duration;
  }

  if (entry.EntryType === "Activity") {
    Activity += duration;
  }

  if (entry.EntryType === "Unavailability") {
    Unavailability += duration;
  }

  if (entry.EntryType === "Manual") {
    Manual += duration;
  }

  Logged += duration;

  return {
    Logged: Logged || null,
    Job: Job || null,
    Shift: Shift || null,
    Unavailability: Unavailability || null,
    Manual: Manual || null,
    Activity: Activity || null,
    Distance: Distance || null,
  } as ReduxDataTypes.TimesheetSummaryFields;
};

export const reduceTimesheetEntriesData = (
  timesheetElement: ReduxDataTypes.TimesheetData
) => {
  const missingFields = timesheetElement.Entries.reduce(
    (acc, entry) => calculateMissingFields(acc, entry),
    {
      Activity: null,
      Distance: null,
      Logged: null,
      Unavailability: null,
    } as ReduxDataTypes.TimesheetSummaryFields
  );
  return {
    ...timesheetElement,
    ...missingFields,
  };
};

const formatEntriesDistance = (timesheet: ReduxDataTypes.TimesheetData) => ({
  ...timesheet,
  Entries: timesheet.Entries.map(formatEntryData),
});

const getEntryTimezone = (entry: ReduxDataTypes.TimesheetEntry) => {
  switch (entry.EntryType) {
    case "Job":
      return entry.Job ? entry.Job.Timezone : null;
    case "Activity":
      return entry.Activity ? entry.Activity.Timezone : null;
    default:
      return null;
  }
};

export const formatEntryData = (entry: ReduxDataTypes.TimesheetEntry) => {
  const duration = calculateDurationInMinutes(
    `${entry.StartDate}T${entry.StartTime}Z`,
    `${entry.EndDate}T${entry.EndTime}Z`
  );
  const actualDuration = entry.ActualDuration || duration;
  // const lunchBreak = duration - actualDuration
  const jobAllocation = entry.Job
    ? entry.Job.JobAllocations.find(
        (ja) => ja.ResourceId === entry.Timesheet.ResourceId
      )
    : undefined;

  return {
    ...entry,
    Distance: entry.Distance,
    Duration: duration,
    ActualDuration: actualDuration,
    ContactId: entry.Job ? entry.Job.ContactId : "",
    Timezone: getEntryTimezone(entry),
    JobAllocationId: (jobAllocation && jobAllocation.UID) || "",
  };
};

const addJobAllocationId = (timesheet: ReduxDataTypes.TimesheetData) => {
  const JobAllocationIds = timesheet.Entries.filter(
    (entry) => !!formatEntryData(entry).JobAllocationId
  ).map((entry) => {
    const formattedEntry = formatEntryData(entry);
    return formattedEntry.JobAllocationId;
  });
  return { ...timesheet, JobAllocationIds };
};

const timesheetTransform = ({
  timesheet,
}: {
  timesheet: ReduxDataTypes.TimesheetData[];
}) => {
  const newTimesheetData = timesheet
    .map(formatEntriesDistance)
    .map(reduceTimesheetEntriesData)
    .map(addJobAllocationId);
  const stats = calculateStats(newTimesheetData);

  return {
    ...stats,
    timesheetData: newTimesheetData,
  };
};

export const timesheetsReducers = {
  ...makeReducers(TIMESHEET, { transform: timesheetTransform }),
  [CLEAR_TIMESHEET_DATA]: (state: ReduxDataTypes.State) => ({
    ...state,
    timesheetData: [] as ReduxDataTypes.TimesheetData[],
  }),
};
