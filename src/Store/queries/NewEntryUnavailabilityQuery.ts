export const NewEntryUnavailabilityQuery = `
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
`

export default NewEntryUnavailabilityQuery
