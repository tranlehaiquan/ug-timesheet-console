export const updateTimeSheetEntryQuery = `
mutation updateTimesheetEntry($updateInput: UpdateTimesheetEntry!) {
  schema {
    updateTimesheetEntry(input: $updateInput)
  }
}
`;
