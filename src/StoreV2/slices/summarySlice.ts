import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { differenceInMinutes } from "date-fns";
import { toastMessage } from "../../common/utils/notificationUtils";
import { calculateDurationInMinutes } from "../../common/utils/dateTimeHelpers";
import { getEntryTimezone } from "../../common/constants/timeSheetEntry";
import ReduxDataTypes from "../DataTypes";
import { RootState } from "../store";
import { autoPaginationGraphqlRequest } from "../../Services/GraphQLServices";
import AllTimesheetsQuery from "../queries/AllTimeSheetQuery";
import { FAILED_SUMMARIZE_TS_CONSOLE } from "../../common/constants/errorMessage";

interface SummaryState {
  loading: boolean;
  summary: {
    jobs: number;
    distance: number;
    logged: number;
    unavailability: number;
  };
  workload: {
    [key: string]: number;
  };
}

// Define the initial state using that type
const initialState: SummaryState = {
  loading: false,
  summary: {
    jobs: 0,
    distance: 0,
    logged: 0,
    unavailability: 0,
  },
  workload: {},
};

const SLICE_NAME = "TIME_SHEET_SUMMARY";

const createAllTimeSheetsFilters = (store: RootState) => {
  const {
    filter: { filterValues = [], dateRange },
  } = store;
  const dateFilter = (startDate: string, endDate: string) =>
    `StartDate >= ${startDate} AND EndDate <= ${endDate}`;
  const arrayFilter = (array: string[]) =>
    `[${array.map((element) => `'${element}'`).join(",")}]`;
  const formatFilterValue = (valueArray: string[]) =>
    valueArray.length === 1
      ? `== "${valueArray[0]}"`
      : `IN ${arrayFilter(valueArray)}`;

  const appliedFilters = filterValues
    .filter((filter) => filter.filterValues && filter.filterValues.length > 0)
    .map(
      ({ filterValues, selector }) =>
        `${selector.replace("Timesheet.", "")} ${formatFilterValue(
          filterValues
        )}`
    );
  const dateFilters = dateFilter(dateRange.startDate, dateRange.endDate);
  return [dateFilters, ...appliedFilters].join(" AND ");
};

const formatEntryData = (entry: ReduxDataTypes.TimesheetEntry) => {
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

const formatEntriesDistance = (timesheet: ReduxDataTypes.TimesheetData) => ({
  ...timesheet,
  Entries: timesheet.Entries.map(formatEntryData),
});

const calculateMissingFields = (
  timesheet: ReduxDataTypes.TimesheetSummaryFields,
  entry: ReduxDataTypes.TimesheetEntry
) => {
  const Distance = (timesheet.Distance || 0) + (entry.Distance || 0);
  let Logged = timesheet.Logged || 0;
  let Unavailability = timesheet.Unavailability || 0;
  let Job = timesheet.Job || 0;

  const startDate = moment(
    `${entry.StartDate} ${entry.StartTime}`,
    "YYYY-MM-DD HH:mm"
  );
  const endDate = moment(
    `${entry.EndDate} ${entry.EndTime}`,
    "YYYY-MM-DD HH:mm"
  );

  const actualDurationInMinutes = entry.ActualDuration || 0;
  const duration =
    actualDurationInMinutes ||
    differenceInMinutes(endDate.toDate(), startDate.toDate());

  if (entry.EntryType === "Job") {
    Job += duration;
  }

  if (entry.EntryType === "Unavailability") {
    Unavailability += duration;
  }

  Logged += duration;

  return {
    Logged: Logged || null,
    Job: Job || null,
    Unavailability: Unavailability || null,
    Distance: Distance || null,
  } as ReduxDataTypes.TimesheetSummaryFields;
};

const reduceTimesheetEntriesData = (
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

const calculateStats = (timesheetData: ReduxDataTypes.TimesheetData[]) => {
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

const timesheetTransform = ({
  timesheet,
}: {
  timesheet: ReduxDataTypes.TimesheetData[];
}) => {
  const newTimesheetData = timesheet
    .map(formatEntriesDistance)
    .map(reduceTimesheetEntriesData);
  const stats = calculateStats(newTimesheetData);

  return {
    ...stats,
  };
};

export const doTimeSheetStatistics = createAsyncThunk<
  { timesheet: ReduxDataTypes.Timesheet[] },
  string,
  { state: RootState }
>(`${SLICE_NAME}/fetchAll`, async (params, thunkAPI) => {
  const state = thunkAPI.getState();
  const filters = createAllTimeSheetsFilters(state);
  const timesheet =
    await autoPaginationGraphqlRequest<ReduxDataTypes.Timesheet>(
      AllTimesheetsQuery,
      "timesheet",
      {
        filters,
      },
      ["UID"]
    );
  return { timesheet };
});

export const summarySlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doTimeSheetStatistics.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(doTimeSheetStatistics.fulfilled, (state, action) => {
      const timeSheets = action.payload.timesheet || [];
      const { summary, workload } = timesheetTransform({
        timesheet: timeSheets,
      });

      return {
        ...state,
        summary: {
          distance: summary.distance > 0 ? summary.distance : 0,
          jobs: summary.jobs > 0 ? summary.jobs : 0,
          logged: summary.logged > 0 ? summary.logged : 0,
          unavailability:
            summary.unavailability > 0 ? summary.unavailability : 0,
        },
        workload,
        loading: false,
      };
    });
    builder.addCase(doTimeSheetStatistics.rejected, (state) => {
      toastMessage.error(FAILED_SUMMARIZE_TS_CONSOLE);
      return {
        ...state,
        values: [],
        loading: false,
      };
    });
  },
});

export const selectSummary = (state: RootState) => state.summary;

export default summarySlice.reducer;
