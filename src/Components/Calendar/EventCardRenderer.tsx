import * as React from 'react'
import { format, getMinutes } from 'date-fns'

import { CalendarEvent } from './Calendar'

import './Calendar.scss'

interface Props {
  event: CalendarEvent
}

const getHourFormat = (date: Date) => {
  return getMinutes(date) === 0 ? 'h' : 'h:mm'
}

const toEventRange = (event: CalendarEvent) => {
  const isGoingThroughNoon = format(event.start, 'a') !== format(event.end, 'a')
  const startFormat = `${getHourFormat(event.start)}${isGoingThroughNoon ? 'a' : ''}`
  const endFormat = `${getHourFormat(event.end)}a`
  const dateFormat = 'd MMM'
  return `${format(event.start, dateFormat)} ${format(event.start, startFormat).toLowerCase()} - ${format(event.end, dateFormat)} ${format(event.end, endFormat).toLowerCase()}`
}

interface MinifiedContentProps {
  event: CalendarEvent
}

const MinifiedContent: React.FC<MinifiedContentProps> = ({ event }) => {
  return (
    <p
      style={ {
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      } }
    >
      { event.name }
    </p>
  )
}

interface ContentProps {
  event: CalendarEvent
}

const Content: React.FC<ContentProps> = ({ event }) => {
  return (
    <>
      <p>{ event.name }</p>
      <p>{ toEventRange(event) }</p>
    </>
  )
}

export const EventCardRenderer: React.FC<Props> = ({ event }) => {
  const [isMinified, setIsMinified] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (ref.current!.scrollHeight > ref.current!.clientHeight) {
      setIsMinified(true)
    }
  }, [])

  return (
    <div
      ref={ ref }
      style={ {
        height: '100%',
        overflow: 'auto'
      } }
    >
      { isMinified ? <MinifiedContent event={ event } /> : <Content event={ event } /> }
    </div>
  )
}
