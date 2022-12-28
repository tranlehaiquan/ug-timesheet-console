import { format } from 'date-fns'
import moment from 'moment'
import { Dispatch } from 'redux'
import { makeActionCreator } from '../common/utils/redux-helpers'
import ReduxDataTypes from './DataTypes'
import { getTimesheets } from './reducersTimesheets'

const TIME_RANGE_SET = 'TIME_RANGE_SET'

export const getDefaultTimeRange = () => {
  const today = getMonday(moment().toDate())
  const startDate = format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0), 'yyyy-MM-dd')
  const endDate = format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 23, 59, 59), 'yyyy-MM-dd')

  return {
    startDate,
    endDate
  }
}

export const setTimeRangeSimp = makeActionCreator(TIME_RANGE_SET, null, ['startDate', 'endDate'])

export const setTimeRange = (startDate: Date, endDate: Date) => (dispatch: Dispatch) => {
  dispatch(setTimeRangeSimp(startDate, endDate))
  dispatch(getTimesheets())
}

export default {
  [TIME_RANGE_SET]: (
    state: ReduxDataTypes.State,
    { startDate, endDate }: { startDate: Date, endDate: Date }
  ) => ({
    ...state,
    timeRange: {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    }
  })
}

function getMonday(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}
