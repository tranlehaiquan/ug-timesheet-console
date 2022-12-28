import * as React from 'react'
import { isWithinInterval } from 'date-fns'
import { startOfDay, endOfDay } from 'date-fns/esm'

import { CalendarEvent } from './Calendar'
import { EventCardRenderer } from './EventCardRenderer'

import './Calendar.scss'

interface Props {
  event: CalendarEvent
  day: Date
  gridX: number
  cellHeight: number
}

const calculateRowStart = (event: CalendarEvent) => {
  return event.start.getHours() + 1
}

const calculateRowEnd = (event: CalendarEvent) => {
  return event.end.getHours() + 2
}

const calculateTopMargin = (event: CalendarEvent, cellHeight: number) => {
  return event.start.getMinutes() / 60 * cellHeight
}

const calculateBottomMargin = (event: CalendarEvent, cellHeight: number) => {
  const cardPadding = 4
  return cellHeight - ((event.end.getMinutes() / 60) * cellHeight) + cardPadding
}

export const EventCard: React.FC<Props> = ({ event, day, gridX, cellHeight }) => {
  const startsThisDay = isWithinInterval(event.start, { start: startOfDay(day), end: endOfDay(day) })
  const endsThisDay = isWithinInterval(event.end, { start: startOfDay(day), end: endOfDay(day) })
  const isRecurrent = !!event.recurrent
  return (
    <div
      className="calendar--event_card sk-rounded"
      onClick={ () => { if (event.onClick) event.onClick(event) } }
      style={ {
        cursor: event.onClick ? 'pointer' : 'default',
        gridColumnStart: gridX,
        gridRowStart: isRecurrent || startsThisDay ? calculateRowStart(event) : 1,
        gridRowEnd: isRecurrent || endsThisDay ? calculateRowEnd(event) : 25,
        marginTop: isRecurrent || startsThisDay ? calculateTopMargin(event, cellHeight) : 0,
        marginBottom: isRecurrent || endsThisDay ? calculateBottomMargin(event, cellHeight) : 4,
        backgroundColor: event.backgroundColor ? event.backgroundColor : '#e5e7ee',
        color: event.fontColor ? event.fontColor : '#000',
        border: event.borderColor ? `1px solid ${event.borderColor}` : undefined
      } }
    >
      <EventCardRenderer event={ event } />
    </div>
  )
}
