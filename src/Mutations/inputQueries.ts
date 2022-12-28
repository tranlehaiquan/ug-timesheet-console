import { inlineLists } from 'common-tags'

export const createTimesheetQuery = `
mutation createTimesheet($createInput: NewTimesheet!) {
  schema {
    insertTimesheet(input: $createInput)
  }
}
`

export const updateTimesheetEntryQuery = `
mutation updateTimesheetEntry($updateInput: UpdateTimesheetEntry!) {
  schema {
    updateTimesheetEntry(input: $updateInput)
  }
}
`

export const deleteTimesheetQuery = `
mutation deleteTimesheet($deleteInput: ID!) {
  schema {
    deleteTimesheet(UID: $deleteInput)
  }
}
`

export const deleteTimesheetEntryQuery = `
mutation deleteTimesheetEntry($deleteInput: ID!) {
  schema {
    deleteTimesheetEntry(UID: $deleteInput)
  }
}
`

export const createTimesheetEntryQuery = (count: number) => {
  const indexes = Array(count).fill(null).map((_, index) => index)
  return inlineLists(`
    mutation createTimesheetEntry(${indexes.map(index => `$input${index}: NewTimesheetEntry!`)}) {
      schema {
      ${indexes.map(index => `entry${index}:insertTimesheetEntry(input: $input${index})`)}
      }
    }
  `)
}

export const updateTimesheetsStatusQuery = (count: number) => {
  const indexes = Array(count).fill(null).map((_, index) => index)
  return inlineLists(`
    mutation updateTimesheet(${indexes.map(index => `$input${index}: UpdateTimesheet!`)}) {
      schema {
      ${indexes.map(index => `timesheet${index}:updateTimesheet(input: $input${index})`)}
      }
    }
  `)
}
