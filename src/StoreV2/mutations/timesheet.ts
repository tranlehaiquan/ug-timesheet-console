import { inlineLists } from 'common-tags'

export const updateTimeSheetsStatusQuery = (count: number) => {
  const indexes = Array(count).fill(null).map((_, index) => index)
  return inlineLists(`
    mutation updateTimesheet(${indexes.map(index => `$input${index}: UpdateTimesheet!`)}) {
      schema {
      ${indexes.map(index => `timesheet${index}:updateTimesheet(input: $input${index})`)}
      }
    }
  `)
}
