export const TimesheetEntryChange = `subscription TimesheetEntryChange {
  schemaTimesheetEntry {
    operation
    timestamp
    data {
      UID
      TimesheetId
      ActivityId
      Description
      Distance
      EndDate
      EndTime
      EntryType
      JobId
      ShiftId
      StartDate
      StartTime
      UnavailabilityId
    }
    previous {
      UID
    }
  }
}
`;
export default TimesheetEntryChange;
