import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { uniqBy } from "lodash";
import {
  FAILED_FETCH_RELATED_TO_DATA,
  FAILED_FETCH_TS_ENTRY,
  FAILED_UPDATE_TS_ENTRY_STATUS,
} from "../../common/constants/errorMessage";
import {
  ITEMS_PER_PAGE,
  TS_ENTRY_TYPE,
} from "../../common/constants/timeSheetEntry";
import ReduxDataTypes, {
  DefinedEntryTypes,
  TimesheetStatus,
} from "../DataTypes";
import { AllTimeSheetEntriesQuery } from "../queries";
import { RootState } from "../store";
import { fetchOnePage } from "../../Services/GraphQLServices";
import { toastMessage } from "../../common/utils/notificationUtils";
import { updateTimeSheetsStatusQuery } from "../mutations/timesheet";
import { updateTimeSheetEntryQuery } from "../mutations/timeSheetEntry";
import { newEntryQueries } from "../queries/NewEntryInTSFormQuery";
import { dataService } from "../../Services/DataServices";
import { setLoading } from "./globalLoading/globalLoadingSlice";

interface TimeSheetEntryState {
  values: ReduxDataTypes.TimesheetEntry[];
  loading: boolean;
  totalCount: number;
  newEntryInForm: {
    newEntryJob: ReduxDataTypes.Job[];
    newEntryShift: ReduxDataTypes.Shift[];
    newEntryActivity: ReduxDataTypes.Activity[];
    newEntryUnavailability: ReduxDataTypes.Availability[];
  };
}

interface UpdateResp {
  schema: { updateTimesheet: string };
}

interface NewEntryResp {
  jobAllocations?: JobAllocations[];
  resourceShifts?: ResourceShift[];
  activities?: ReduxDataTypes.Activity[];
  availabilities?: ReduxDataTypes.Availability[];
}

interface ResourceShift {
  Shift: ReduxDataTypes.Shift;
  Breaks: {
    Start: string;
    End: string;
    UID: string;
  }[];
  ActualStart: string;
  ActualEnd: string;
}
interface JobAllocations {
  UID: string;
  Job: ReduxDataTypes.Job;
  TravelDistance: number;
  TimeInProgress: string;
  TimeCompleted: string;
  Status: string;
  LunchBreakDuration: number;
  Premiums: string[];
}

interface UpdateTimeSheetEntryResp {
  schema: { updateTimesheetEntry: string };
}

// Define the initial state using that type
const initialState: TimeSheetEntryState = {
  values: [],
  loading: false,
  totalCount: ITEMS_PER_PAGE,
  newEntryInForm: {
    newEntryJob: [],
    newEntryShift: [],
    newEntryActivity: [],
    newEntryUnavailability: [],
  },
};

const SLICE_NAME = "TIME_SHEET_ENTRY";

const createAllTimeSheetsEntryFilters = (
  store: RootState,
  isSearch: boolean
) => {
  const {
    filter: { filterValues = [], dateRange },
  } = store;
  const dateFilter = (startDate: string, endDate: string) =>
    `Timesheet.StartDate >= ${startDate} AND Timesheet.EndDate <= ${endDate}`;

  const arrayFilter = (array: string[]) => {
    return `[${array
      .map((element) => `${JSON.stringify(element)}`)
      .join(",")}]`;
  };
  const formatFilterValue = (valueArray: string[]) =>
    valueArray.length === 1
      ? `== "${valueArray[0]}"`
      : `IN ${arrayFilter(valueArray)}`;

  const appliedFilters = filterValues
    .filter((filter) => filter.filterValues && filter.filterValues.length > 0)
    .filter((filter) => (isSearch && filter.name !== "Name") || !isSearch)
    .map(
      ({ filterValues, selector }) =>
        `${selector} ${formatFilterValue(filterValues)}`
    );

  const dateFilters = dateFilter(dateRange.startDate, dateRange.endDate);
  return [dateFilters, ...appliedFilters].join(" AND ");
};

const getUpdateTimeSheetStatusVariables: (
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

export const fetchTimeSheetEntries = createAsyncThunk<
  { totalCount: number; data: ReduxDataTypes.TimesheetEntry[] },
  { page: number; entriesPerPage: number; isSearch?: boolean },
  { state: RootState }
>(`${SLICE_NAME}/fetchAll`, async (params, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const { dispatch } = thunkAPI;
  const orderBy = state.order.orderBy
    ? `${
        state.order.orderBy.field
      } ${state.order.orderBy.direction.toUpperCase()}`
    : "CreatedDate";
  dispatch(setLoading(true));
  try {
    const resp = await fetchOnePage<ReduxDataTypes.TimesheetEntry>(
      AllTimeSheetEntriesQuery,
      "timesheetEntry",
      {
        orderBy,
        first: params.entriesPerPage,
        offset: params.page,
        filter: createAllTimeSheetsEntryFilters(
          state,
          params.isSearch || false
        ),
      }
    );
    return resp;
  } finally {
    dispatch(setLoading(false));
  }
});

export const updateTimeSheetStatus = createAsyncThunk<
  string,
  {
    timeSheetIds: string[];
    status: TimesheetStatus;
    comment: string;
    userId: string;
  },
  { state: RootState }
>(`${SLICE_NAME}/updateTimeSheetStatus`, async (params) => {
  const { timeSheetIds, comment, userId, status } = params;

  const variables = timeSheetIds.reduce((acc, uid, index) => {
    return {
      ...acc,
      [`input${index}`]: getUpdateTimeSheetStatusVariables(
        uid,
        status,
        comment,
        userId
      ),
    };
  }, {});
  const {
    schema: { updateTimesheet },
  } = await dataService.fetchGraphQl<UpdateResp>({
    variables,
    query: updateTimeSheetsStatusQuery(timeSheetIds.length),
  });
  return updateTimesheet;
});

export const updateTimeSheetEntry = createAsyncThunk<
  string,
  Partial<ReduxDataTypes.TimesheetEntry>,
  { state: RootState }
>(`${SLICE_NAME}/updateTimeSheetEntry`, async (params) => {
  const {
    schema: { updateTimesheetEntry: updatedEntry },
  } = await dataService.fetchGraphQl<UpdateTimeSheetEntryResp>({
    query: updateTimeSheetEntryQuery,
    variables: {
      updateInput: params,
    },
  });
  return updatedEntry;
});

export const createTimeSheetEntry = createAsyncThunk<
  string,
  { payload: Partial<ReduxDataTypes.TimesheetEntry>[] },
  { state: RootState }
>(`${SLICE_NAME}/createTimeSheetEntry`, async (params) => {
  const variables = params.payload.reduce(
    (acc, entry, index) => ({
      ...acc,
      [`input${index}`]: entry,
    }),
    {}
  );
  const { schema } = await dataService.createTimeSheetEntry(
    variables,
    params.payload.length
  );
  return schema.insertTimesheetEntry.UID;
});

export const fetchNewEntryDataByEntryType = createAsyncThunk<
  {
    newEntryJob: ReduxDataTypes.Job[];
    newEntryShift: ReduxDataTypes.Shift[];
    newEntryActivity: ReduxDataTypes.Activity[];
    newEntryUnavailability: ReduxDataTypes.Availability[];
  },
  { entryType: DefinedEntryTypes; resourceId: string },
  { state: RootState }
>(
  `${SLICE_NAME}/fetchNewEntryDataByEntryType`,
  async ({ entryType, resourceId }, thunkAPI) => {
    if (entryType === TS_ENTRY_TYPE.MANUAL) {
      return null;
    }

    const resp = await dataService.fetchGraphQl<NewEntryResp>({
      ...newEntryQueries[entryType](
        resourceId,
        thunkAPI.getState().filter.dateRange
      ),
    });
    const newEntryJobTransform = (jobAllocations: JobAllocations[]) =>
      jobAllocations.map((jobAllocation: JobAllocations) => ({
        ...jobAllocation.Job,
        JobAllocationId: jobAllocation.UID,
        TravelDistance: jobAllocation.TravelDistance,
        Start: jobAllocation.TimeInProgress
          ? jobAllocation.TimeInProgress
          : jobAllocation.Job.Start,
        End: jobAllocation.TimeCompleted
          ? jobAllocation.TimeCompleted
          : jobAllocation.Job.End,
        LunchBreakDuration: jobAllocation.LunchBreakDuration,
        Premiums: jobAllocation.Premiums,
      }));

    const newEntryShiftTransform = (resourceShifts: ResourceShift[]) =>
      resourceShifts.map(
        (resourceShift: ResourceShift): ReduxDataTypes.Shift => {
          const isFinished = !!(
            resourceShift.ActualStart && resourceShift.ActualEnd
          );

          return {
            isFinished,
            ...resourceShift.Shift,
            Breaks: resourceShift.Breaks || [],
            Start: resourceShift.ActualStart
              ? resourceShift.ActualStart
              : resourceShift.Shift.Start,
            End: resourceShift.ActualEnd
              ? resourceShift.ActualEnd
              : resourceShift.Shift.End,
          };
        }
      );
    const newEntryTransform = (
      {
        jobAllocations,
        resourceShifts,
        activities,
        availabilities,
      }: NewEntryResp,
      { newEntryInForm }: Pick<TimeSheetEntryState, "newEntryInForm">
    ) => ({
      newEntryJob: jobAllocations
        ? newEntryJobTransform(
            uniqBy(
              [
                ...jobAllocations.filter(
                  (item) =>
                    item.Job.JobStatus !== "Cancelled" &&
                    item.Status !== "Deleted"
                ),
                ...jobAllocations.filter(
                  (item) => item.Job.JobStatus === "Cancelled"
                ),
              ],
              "JobId"
            )
          )
        : newEntryInForm.newEntryJob,
      newEntryShift: resourceShifts
        ? newEntryShiftTransform(resourceShifts)
        : newEntryInForm.newEntryShift,
      newEntryActivity: activities || newEntryInForm.newEntryActivity,
      newEntryUnavailability:
        availabilities || newEntryInForm.newEntryUnavailability,
    });
    return newEntryTransform(resp, thunkAPI.getState().timeSheetEntries);
  }
);

export const timeSheetEntriesSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    resetNewEntryInForm: (state) => {
      return {
        ...state,
        newEntryInForm: {
          newEntryActivity: [],
          newEntryJob: [],
          newEntryShift: [],
          newEntryUnavailability: [],
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTimeSheetEntries.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(fetchTimeSheetEntries.fulfilled, (state, action) => {
      return {
        ...state,
        values: action.payload.data,
        loading: false,
        totalCount: action.payload.totalCount,
      };
    });
    builder.addCase(fetchTimeSheetEntries.rejected, (state) => {
      toastMessage.error(FAILED_FETCH_TS_ENTRY);
      return {
        ...state,
        values: [],
        loading: false,
      };
    });

    builder.addCase(updateTimeSheetStatus.rejected, (state) => {
      toastMessage.error(FAILED_UPDATE_TS_ENTRY_STATUS);
      return {
        ...state,
      };
    });

    builder.addCase(fetchNewEntryDataByEntryType.fulfilled, (state, action) => {
      return {
        ...state,
        newEntryInForm: action.payload || {
          newEntryActivity: [],
          newEntryJob: [],
          newEntryShift: [],
          newEntryUnavailability: [],
        },
      };
    });

    builder.addCase(fetchNewEntryDataByEntryType.rejected, (state) => {
      toastMessage.error(FAILED_FETCH_RELATED_TO_DATA);
      return {
        ...state,
        newEntryInForm: {
          newEntryActivity: [],
          newEntryJob: [],
          newEntryShift: [],
          newEntryUnavailability: [],
        },
      };
    });
  },
});

export const selectTimeSheetEntries = (state: RootState) =>
  state.timeSheetEntries.values || [];
export const selectTimeSheetEntryById = (
  timeSheetEntries: ReduxDataTypes.TimesheetEntry[],
  entryId: string
) => {
  return timeSheetEntries.find((entry) => entry.UID === entryId) || null;
};

export const selectTimeSheetIdByEntryId = (
  timeSheetEntries: ReduxDataTypes.TimesheetEntry[],
  entryId: string
) => {
  const timeSheetEntry = timeSheetEntries.find(
    (entry) => entry.UID === entryId
  );
  if (!timeSheetEntry && !timeSheetEntry.TimesheetId) {
    return "";
  }
  return timeSheetEntry.TimesheetId;
};

export const selectTimeSheetByEntryId = (
  timeSheetEntries: ReduxDataTypes.TimesheetEntry[],
  entryId: string
) => {
  const timeSheetEntry = timeSheetEntries.find(
    (entry) => entry.UID === entryId
  );
  if (!timeSheetEntry) {
    return null;
  }
  return timeSheetEntry.Timesheet;
};

export const selectJobAllocationByTimeSheetEntry = (
  tsEntry: ReduxDataTypes.TimesheetEntry
): ReduxDataTypes.JobAllocation => {
  if (tsEntry.EntryType === "Job") {
    const {
      Timesheet: { ResourceId },
      Job: { JobAllocations },
    } = tsEntry;
    const jobAllocation = JobAllocations.find(
      (ja) => ja.ResourceId === ResourceId
    );
    return jobAllocation;
  }
  return null;
};

export const { resetNewEntryInForm } = timeSheetEntriesSlice.actions;

export default timeSheetEntriesSlice.reducer;
