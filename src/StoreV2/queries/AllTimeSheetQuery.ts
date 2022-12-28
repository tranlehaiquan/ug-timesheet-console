export const AllTimesheetsQuery = `
query getTimesheets($filters: EQLQueryFilterTimesheet!, $first: PositiveIntMax200, $offset:  NonNegativeInt){
  timesheet(filter: $filters, orderBy: "StartDate ASC", first: $first, offset: $offset) {
    pageInfo {
      hasNextPage
    }
    totalCount
    edges {
      node {
        ApprovedById
        ApprovedDate
        ApproverComments
        ResourceId
        Status
        SubmitterComments
        UID
        StartDate
        EndDate
        ApprovedBy {
          Name
        }
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
        Entries: Timesheet {
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
          IsNew
          EndTime
          EntryType
          Timesheet {
            ResourceId
            Resource {
              Name
            }
            StartDate
            EndDate
          }
          Job {
            UID
            Name
            Type
            JobStatus
            Duration
            End
            Start
            Timezone
            ContactId
            Contact {
              UID
              FullName
              Email
            }
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
          JobId
          Shift {
            DisplayName
          }
          ShiftId
          StartDate
          StartTime
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
          ActualDuration: Duration
          LunchBreakDuration
          Premiums
        }
      }
    }
  }
}
`;

export default AllTimesheetsQuery;
