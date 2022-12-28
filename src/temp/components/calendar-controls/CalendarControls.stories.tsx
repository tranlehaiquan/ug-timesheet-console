import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { CalendarControls } from './CalendarControls'

const defaultDate = new Date()

const WrappedCalendar = ({ selected, selectedRange = 'day', ...props }) => {
  const [date, setselected] = React.useState(selected)
  const [range, setRange] = React.useState(selectedRange)

  return (
    <CalendarControls
      selected={ date }
      onDateSelect={ setselected }
      selectedRange={ range }
      onRangeChange={ setRange }
      rangeOptions={ ['day', '3-days', 'week', 'month'] }
      {...props}
    />
  )
}

storiesOf('Date & Time', module)
  .add('CalendarControls',
    () => (
      <WrappedCalendar
        selected={ defaultDate }
      />
    ), {
      info: {
        components: { CalendarControls },
        propTables: [CalendarControls],
        propTablesExclude: [WrappedCalendar]
      }
    })
