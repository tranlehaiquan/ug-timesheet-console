import moment from "moment";
import { GraphQLRequest } from "src/Services/Services";
import { DefinedEntryTypes, TimeRange } from "../DataTypes";

const NewEntryJobsQuery = `
query NewEntryJobs ($filters: EQLQueryFilterJobAllocations) {
  jobAllocations (filter: $filters) {
    edges {
      node {
        UID
        Start
        End
        Resource {
        UID
          Name
        }
        JobId
        Job {
          Name
          UID
          Start
          End
          JobStatus
          Duration
          Description
          Type
          Timezone
          Account {
            Name
          }
        }
        TravelDistance
        TimeStartTravel
        TimeInProgress
        TimeCompleted
        LunchBreakDuration
        Premiums
      }
    }
  }
}
`;

const NewEntryActivityQuery = `
query NewEntryActivity ($filters: EQLQueryFilterActivities)  {
  activities (filter: $filters)  {
    edges {
      node  {
        Name
        UID
        Start
        End
        Type
        Timezone
      }
    }
  }
}
`;
const NewEntryShiftsQuery = `
query NewEntryShifts ($filters: EQLQueryFilterResourceShifts) {
  resourceShifts (filter: $filters) {
    edges {
      node  {
        ActualStart
        ActualEnd
        Shift {
          DisplayName
          UID
          Start
          End
          Duration
          Location {
            Name
          }
        }
        Resource {
          UID
        }
        Breaks {
          Start
          End
          UID
        }
      }
    }
  }
}
`;

const NewEntryUnavailabilityQuery = `
query NewEntryUnavailability ($filters: EQLQueryFilterAvailabilities) {
  availabilities (filter: $filters) {
    edges {
      node  {
        UID
        Start
        Finish
        Type
      }
    }
  }
}
`;

export const newEntryQueries: {
  [key in DefinedEntryTypes]: (
    resourceUID: string,
    { startDate, endDate }: TimeRange
  ) => GraphQLRequest;
} = {
  Job: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, "YYYY-MM-DD").startOf("day");
    const endDateMoment = moment(endDate, "YYYY-MM-DD").endOf("day");
    return {
      query: NewEntryJobsQuery,
      variables: {
        filters: `Status != 'Declined' AND Resource.UID == '${resourceUID}' AND Start < ${endDateMoment.toISOString()} AND End > ${startDateMoment.toISOString()}`,
      },
    };
  },
  Shift: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, "YYYY-MM-DD").startOf("day");
    const endDateMoment = moment(endDate, "YYYY-MM-DD").endOf("day");
    return {
      query: NewEntryShiftsQuery,
      variables: {
        filters: `Resource.UID == '${resourceUID}' AND Shift.Start < ${endDateMoment.toISOString()} AND Shift.End > ${startDateMoment.toISOString()}`,
      },
    };
  },
  Activity: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, "YYYY-MM-DD").startOf("day");
    const endDateMoment = moment(endDate, "YYYY-MM-DD").endOf("day");
    return {
      query: NewEntryActivityQuery,
      variables: {
        filters: `Resource.UID == '${resourceUID}' AND Start < ${endDateMoment.toISOString()} AND End > ${startDateMoment.toISOString()}`,
      },
    };
  },
  Unavailability: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, "YYYY-MM-DD").startOf("day");
    const endDateMoment = moment(endDate, "YYYY-MM-DD").endOf("day");
    return {
      query: NewEntryUnavailabilityQuery,
      variables: {
        filters: `IsAvailable == false AND Resource.UID == '${resourceUID}' AND Start < ${endDateMoment.toISOString()} AND Finish > ${startDateMoment.toISOString()}`,
      },
    };
  },
  Manual: () => {
    return null;
  },
};
