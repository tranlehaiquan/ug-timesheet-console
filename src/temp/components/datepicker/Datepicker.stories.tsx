import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { array, date, boolean, text } from '@storybook/addon-knobs/react'
import range from 'lodash/range'

import { Datepicker, IProps } from './Datepicker'
import { Button } from '../buttons/button/Button'
import { Icon } from '../icon/Icon'

/*
 * story book knobs `date` returns an iso formatted string so here we're going
 * to convert its result into a Date we can work with
 */
const dateAsDate = (label: string, providedDate: Date) => {
  const convertedDate = date(label, providedDate)
  return new Date(convertedDate)
}

const WrappedDatepicker: React.FC<IProps> = (props) => {
  const [selectedDate, selectDate] = React.useState(props.selected)
  React.useEffect(() => {
    selectDate(props.selected)
  }, [props.selected])

  return (
    <Datepicker { ...props } selected={ selectedDate } onChange={ selectDate } />
  )
}

const HighlightWeekDatepicker = (props) => {
  const { highlightWeek, ...pickerProps } = props
  const [hoverDate, selectHoverDate] = React.useState(highlightWeek)

  const onHoverHandler = (date) => {
    selectHoverDate(date)
  }

  return <WrappedDatepicker highlightWeek={ hoverDate } onDayMouseEnter={ onHoverHandler } { ...pickerProps } />
}

/*
 * Story book needs known values so it knows when to update/change attributes
 */
const dateFormat = 'EEE dd MMMM, yyyy'
const today = new Date()
const yesterday = new Date()
yesterday.setDate(today.getDate() - 1)
const openToDate = today

storiesOf('Date & Time', module)
  .add('Datepicker',
    () => {

      return (
        <WrappedDatepicker
          selected={ date('selected', yesterday) }
          onChange={ action('change') }

          highlightDates={ [] }

          openToDate={ dateAsDate('openToDate', openToDate) }

          locale={ text('locale', 'en-US') }
          fixedHeight={ boolean('fixedHeight', false) }
          disabled={ boolean('disabled', false) }
          placeholderText={ text('placeholderText', dateFormat) }
          dateFormat={ text('dateFormat', dateFormat) }

          inline={ boolean('inline', false) }
        />
      )
    }, {
      info: {
        components: { Datepicker },
        propTables: [Datepicker],
        propTablesExclude: [WrappedDatepicker]
      }
    }
  )
  .add('Datepicker Custom Input',
    () => {
      const CustomInput = ({ onClick, value }) => (
        <Button buttonType="secondary" onClick={ onClick }>
          { value }
          <Icon name="chevronDown" className="sk-ml-2" size={ 8 } />
        </Button>
      )

      return (
        <WrappedDatepicker
          selected={ dateAsDate('selected', yesterday) }

          customInput={ <CustomInput /> }
        />
      )
    }, {
      info: {
        components: { Datepicker },
        propTables: [Datepicker],
        propTablesExclude: [WrappedDatepicker]
      }
    }
  )
  .add('Inline Datepicker',
    () => {
      return (
        <WrappedDatepicker
          selected={ date('selected', yesterday) }
          onChange={ action('change') }

          inline={ boolean('inline', true ) }
        />
      )
    }, {
      info: {
        components: { Datepicker },
        propTables: [Datepicker],
        propTablesExclude: [WrappedDatepicker]
      }
    }
  )
  .add('Datepicker Highlight Dates',
    () => {
      const higlightedView = new Date()
      higlightedView.setDate(higlightedView.getDate() + 7)

      return (
        <HighlightWeekDatepicker
          openToDate={ openToDate }
          onChange={ action('change') }
          selectWeek={ boolean('selectWeek', true) }
          highlightWeek={ dateAsDate('higlightWeek', higlightedView) }
          onWeekSelect={ action('onWeekSelect') }

          inline={ boolean('inline', true) }
        />
      )
    }, {
      info: {
        components: { Datepicker },
        propTables: [Datepicker],
        propTablesExclude: [HighlightWeekDatepicker]
      }
    }
  )
  .add('Disabled Datepicker',
    () => {
      const dateView = new Date(2019, 4, 20)

      return (
        <WrappedDatepicker
          onChange={ action('change') }
          selected={ dateView }
          dateFormat={ dateFormat }

          disabled={ boolean('disabled', true) }
        />
      )
    }, {
      info: {
        components: { Datepicker },
        propTables: [Datepicker],
        propTablesExclude: [WrappedDatepicker]
      }
    }
  )

