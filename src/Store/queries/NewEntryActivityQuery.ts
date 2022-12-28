export const NewEntryActivityQuery = `
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
`

export default NewEntryActivityQuery
