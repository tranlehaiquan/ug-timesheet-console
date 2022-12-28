import ReduxDataTypes from '../../Store/DataTypes'

const DATE_FIELDS = ['StartDate', 'StartTime', 'EndDate', 'EndTime']

export const mergeDateFields = (entry: ReduxDataTypes.TimesheetEntry) => {
  const { StartDate, StartTime, EndDate, EndTime } = entry
  const newEntry = { ...entry }
  DATE_FIELDS.forEach((field: string) => {
    delete newEntry[field]
  })
  return {
    ...newEntry,
    StartDate: `${StartDate}T${StartTime}Z`,
    EndDate: `${EndDate}T${EndTime}Z`
  }
}
