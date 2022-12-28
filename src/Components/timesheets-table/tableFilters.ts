import { get as _get } from 'lodash'

import ReduxDataTypes from '../../Store/DataTypes'

export const searchableFieldsPaths = [
  'Resource.Name',
  'Resource.Position',
  'Scheduled',
  'Activity',
  'Unavailability',
  'TotalLogged',
  'Availability',
  'Distance',
  'Status'
]

export const isTimesheetSearchedFor = (timesheet: ReduxDataTypes.TimesheetTableItem, lowerSearchPhrase: string) => {
  return searchableFieldsPaths.some(fieldPath => {
    const value = _get(timesheet, fieldPath)
    if (value === undefined || value === null) return false

    return String(value).toLowerCase().indexOf(lowerSearchPhrase) > -1
    /*
    const lowerCasedValue = String(value).toLowerCase()
    return searchPhrases.some(phrase => lowerCasedValue.indexOf(phrase) > -1)
    */
  })
}

export const filterBySearchPhrase = (
  timesheets: ReduxDataTypes.TimesheetTableItem[],
  searchPhrase: string
) => {
  /*
  const searchPhrases = searchPhrase
    .split(/\s/)
    .filter(phrase => phrase.length > 0)
    .map(phrase => phrase.toLowerCase())
  */
  const lowerSearchPhrase = searchPhrase.toLowerCase()
  const filteredTimesheets = timesheets.filter(timesheet => isTimesheetSearchedFor(timesheet, lowerSearchPhrase))

  return filteredTimesheets
}
