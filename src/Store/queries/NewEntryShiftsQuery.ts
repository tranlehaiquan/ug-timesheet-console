export const NewEntryShiftsQuery = `
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
`

export default NewEntryShiftsQuery
