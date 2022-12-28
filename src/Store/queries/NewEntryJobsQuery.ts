export const NewEntryJobsQuery = `
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
`

export default NewEntryJobsQuery
