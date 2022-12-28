import ReduxDataTypes from '../DataTypes'

export const AllTimesheetEntriesQuery = (vendor: ReduxDataTypes.VendorType) => `
query getRelatedEntries($filters: EQLQueryFilterTimesheetEntry!){
  timesheetEntry(filter: $filters, orderBy: "StartDate ASC${vendor === ReduxDataTypes.VendorType.SKEDULO ? ', StartTime ASC' : ''}") {
    edges {
      node {
        Activity {
          Name
          Type
        }
        Unavailability {
          Type
        }
        ActivityId
        Description
        Distance
        EndDate
        ${vendor === ReduxDataTypes.VendorType.SKEDULO ? 'EndTime' : ''}
        EntryType
        Job {
          UID
          Name
          Type
          JobStatus
        }
        JobId
        Shift {
          DisplayName
        }
        ShiftId
        StartDate
        ${vendor === ReduxDataTypes.VendorType.SKEDULO ? 'StartTime' : ''}
        TimesheetId
        UnavailabilityId
        UID
        Timesheet {
          ApprovedById
          ApprovedDate
          ApproverComments
          EndDate
          Resource {
            UID
            Name
            Email
            ResourceType
            Category
            Alias
            ResourceTags {
              Tag {
                Name
                Type
              }
            }
            User {
              UID
              SmallPhotoUrl
              FullPhotoUrl
            }
          }
          ResourceId
          StartDate
          Status
          SubmitterComments
          UID
        }
      }
    }
  }
}
`

export default AllTimesheetEntriesQuery
