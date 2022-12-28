import { TimesheetUpdate } from './SubTimesheetUpdateQuery'
import { TimesheetEntryChange } from './SubTimesheetEntryChangeQuery'

export { AllResourcesQuery } from './AllResourcesQuery'
export { AllTimesheetsQuery } from './AllTimesheetsQuery'
export { NewEntryJobsQuery } from './NewEntryJobsQuery'
export { NewEntryShiftsQuery } from './NewEntryShiftsQuery'
export { NewEntryActivityQuery } from './NewEntryActivityQuery'
export { NewEntryUnavailabilityQuery } from './NewEntryUnavailabilityQuery'
export { AllTimesheetEntriesQuery } from './AllTimesheetEntriesQuery'
export { EntryGetQuery } from './EntryGetQuery'

export const subscriptions: {[key: string]: string} = {
  TimesheetUpdate,
  TimesheetEntryChange
}
