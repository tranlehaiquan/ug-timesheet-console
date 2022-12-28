import ReduxDataTypes from "../DataTypes";

export const EntryGetQuery = (vendor: ReduxDataTypes.VendorType) => `
query getEntry($UID: ID!){
  timesheetEntryById(UID: $UID) {
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
    ${vendor === ReduxDataTypes.VendorType.SKEDULO ? "EndTime" : ""}
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
    ${vendor === ReduxDataTypes.VendorType.SKEDULO ? "StartTime" : ""}
    TimesheetId
    UID
    Timesheet {
      ResourceId
      Resource {
        Name
      }
      StartDate
      EndDate
    }
    LunchBreakDuration
    Premiums
  }
}
`;

export default EntryGetQuery;
