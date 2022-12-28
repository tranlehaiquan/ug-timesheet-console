import { get } from "lodash";
import ReduxDataTypes from "src/StoreV2/DataTypes";
import { TS_ENTRY_TYPE } from "../constants/timeSheetEntry";
import { calculateDurationInMinutes } from "./dateTimeHelpers";

export const getNameOrDisplayName = (
  entry: ReduxDataTypes.TimesheetEntry,
  suffix: string
) => {
  const name = get(entry, `${suffix}.Name`);
  const displayName = get(entry, `${suffix}.DisplayName`);
  return name || displayName || suffix;
};

export const getEntryType = (entry: ReduxDataTypes.TimesheetEntry) => {
  switch (entry.EntryType) {
    case "Job":
      return getNameOrDisplayName(entry, "Job");
    case "Shift":
      return getNameOrDisplayName(entry, "Shift");
    case "Activity":
      return getNameOrDisplayName(entry, "Activity");
    case "Unavailability":
      return getNameOrDisplayName(entry, "Unavailability");
    case "Manual":
      return "Manual";
    default:
      return "-";
  }
};

export const convertPremiumsToString = (premiums: string): string => {
  if (!premiums) {
    return "";
  }

  const values: string[] = JSON.parse(premiums);

  return values.join(", ");
};

export const getJobAllocationByTimeSheetEntry = (
  tsEntry: ReduxDataTypes.TimesheetEntry
): ReduxDataTypes.JobAllocation => {
  if (tsEntry.EntryType === TS_ENTRY_TYPE.JOB && tsEntry.Job) {
    const {
      Timesheet: { ResourceId },
      Job: { JobAllocations = [] },
    } = tsEntry;
    const jobAllocation = JobAllocations.find(
      (ja) => ja.ResourceId === ResourceId
    );
    return jobAllocation;
  }
  return null;
};

export const getActualLoggedTimeInMinute = (
  entry: ReduxDataTypes.TimesheetEntry
): number => {
  const duration =
    entry.ActualDuration ||
    calculateDurationInMinutes(
      `${entry.StartDate}T${entry.StartTime}Z`,
      `${entry.EndDate}T${entry.EndTime}Z`
    );

  return duration;
};
