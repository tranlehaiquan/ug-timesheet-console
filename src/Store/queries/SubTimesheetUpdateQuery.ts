export const TimesheetUpdate = `subscription TimesheetUpdate {
  schemaTimesheet {
    operation
    timestamp
    data {
      UID
      Status
      ApprovedDate
      ApproverComments
      SubmitterComments
    }
    previous {
      Status
    }
  }
}
`
export default TimesheetUpdate
