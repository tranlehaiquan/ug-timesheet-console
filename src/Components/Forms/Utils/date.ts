import { sub, add } from 'date-fns'
import moment from 'moment-timezone'

export const getTimeGapHrs = (timezone: string) => {
  if (!timezone) {
    return 0
  }
  const tzOffset = moment.tz(timezone).utcOffset() / 60
  const currentOffset = moment().utcOffset() / 60
  return currentOffset - tzOffset
}

export const parseLocalDateToZonedDate = (
  date: Date | string,
  timezone: string
) => {
  const timeGap = getTimeGapHrs(timezone)
  const result = sub(new Date(date), { hours: timeGap })

  return result
}

export const parseZonedDateToLocalDate = (
  date: Date | string,
  timezone: string
) => {
  const timeGap = getTimeGapHrs(timezone)
  return add(new Date(date), { hours: timeGap })
}
