import * as React from 'react'
import moment from 'moment-timezone'

interface DateTimeCellProps {
  date?: string
  time?: string
  format?: string
  timezone?: string
}

export const DateTimeCell: React.FC<DateTimeCellProps> = ({ date, time, format = 'DD MMMM YYYY HH:mm:ss Z', timezone }) => {
  const dateTime = (!date && !time)
    ? null
    : `${date} ${time}`
  const mDateTime = timezone ? moment.utc(dateTime).tz(timezone) : moment(dateTime)

  return (
    <span>
      { dateTime ? mDateTime.format(format) : '-' }
    </span>
  )
}
