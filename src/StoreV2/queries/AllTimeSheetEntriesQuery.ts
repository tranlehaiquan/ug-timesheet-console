export const AllTimeSheetEntriesQuery = `
query getEntries($orderBy: EQLOrderByClauseTimesheetEntry, $first: PositiveIntMax200, $offset:  NonNegativeInt, $filter: EQLQueryFilterTimesheetEntry){
  timesheetEntry(orderBy: $orderBy, first: $first, offset: $offset, filter: $filter) {
    pageInfo {
      hasNextPage
    }
    totalCount
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
        UnavailabilityId
        ShiftId
        JobId
        Description
        Distance
        ActualDuration: Duration
        EndDate
        IsNew
        EndTime
        EntryType
        Job {
          UID
          Name
          Type
          JobStatus
          ContactId
          Contact {
            UID
            FullName
            Email
          }
          Account {
            UID
            Name
          }
          Timezone
          JobAllocations(filter: "ApprovalStatus == 'Approved'") {
            UID
            LunchBreakDuration
            Premiums
            ResourceId
            Resource {
              UID
              Name
            }
            TimesheetDuration
            TimeStartTravel
            TimeCheckedIn
            TimeInProgress
            TimeCompleted
          }
        }
        Shift {
          DisplayName
        }
        StartDate
        StartTime
        TimesheetId
        UID
        Timesheet {
          UID
          ResourceId
          Resource {
            Name
            Category
          }
          StartDate
          EndDate
          Status
          ApprovedById
          ApprovedBy {
            Name
          }
          ApprovedDate
          ApproverComments
          SubmitterComments
        }
        LunchBreakDuration
        Premiums
      }
    }
  }
}
`
