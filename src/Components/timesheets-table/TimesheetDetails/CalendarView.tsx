import React from 'react'
import moment from 'moment'
import { Calendar, CalendarEvent } from '../../Calendar/Calendar'
import ReduxDataTypes, { UID } from '../../../Store/DataTypes'
import { BaseModal } from '../../Modals/BaseModal'
import TimesheetEntryForm from '../../Forms/TimesheetEntryForm/TimesheetEntryForm'
import { breakMilisecondsToHoursAndMinutes } from '../../../common/utils/dateTimeHelpers'

interface Props {
  timesheet?: ReduxDataTypes.TimesheetTableItem
}

enum EventType {
  JobQueued,
  JobPendingAllocation,
  JobPendingDispatch,
  JobDispatched,
  JobReady,
  JobEnRoute,
  JobOnSite,
  JobInProgress,
  JobComplete,
  JobCancelled,
  Shift,
  Unavailability,
  Activity,
  Default
}

const getEntryEventName = (entry: ReduxDataTypes.TimesheetEntry) => {
  switch (entry.EntryType) {
    case 'Unavailability':
      return entry.Unavailability ? `${entry.Unavailability.Type}` : entry.EntryType
    case 'Activity':
      return entry.Activity ? `${entry.Activity.Name} - ${entry.Activity.Type}` : entry.EntryType
    case 'Job':
      return entry.Job ? `${entry.Job.Name} - ${entry.Job.Type}` : entry.EntryType
    case 'Shift':
      return entry.Shift ? entry.Shift.DisplayName || 'Shift' : entry.EntryType
    case 'Manual':
      return entry.EntryType
    default:
      return `${entry.Description}`
  }
}

const jobEntryToEventType = (entry: ReduxDataTypes.TimesheetEntry) => {
  const jobStatus = entry.Job ? entry.Job.JobStatus.split(' ').join('') : null
  switch (jobStatus) {
    case 'Queued':
      return EventType.JobQueued
    case 'PendingAllocation':
      return EventType.JobPendingAllocation
    case 'PendingDispatch':
      return EventType.JobPendingDispatch
    case 'Dispatched':
      return EventType.JobDispatched
    case 'Ready':
      return EventType.JobReady
    case 'EnRoute':
      return EventType.JobEnRoute
    case 'OnSite':
      return EventType.JobOnSite
    case 'InProgress':
      return EventType.JobInProgress
    case 'Complete':
      return EventType.JobComplete
    case 'Canceled':
      return EventType.JobCancelled
    default:
      return EventType.JobQueued
  }
}

const getEntryEventType = (entry: ReduxDataTypes.TimesheetEntry) => {
  switch (entry.EntryType) {
    case 'Job':
      return jobEntryToEventType(entry)
    case 'Shift':
      return EventType.Shift
    case 'Unavailability':
      return EventType.Unavailability
    case 'Activity':
      return EventType.Activity
    default:
      return EventType.Activity
  }
}

const getEntryEventStatus = (entry: ReduxDataTypes.TimesheetEntry) => {
  return entry.Job ? entry.Job.JobStatus.split(' ').join('') : null
}

const eventThemes = {
  [EventType.JobQueued]: { backgroundColor: '#f3f5f9', fontColor: '#6e7992', borderColor: '#6e7992' },
  [EventType.JobPendingAllocation]: { backgroundColor: '#f3f5f9', fontColor: '#4e5b78', borderColor: '#4e5b78' },
  [EventType.JobPendingDispatch]: { backgroundColor: '#e4f4fa', fontColor: '#409dbf', borderColor: '#409dbf' },
  [EventType.JobDispatched]: { backgroundColor: '#4fa9cb', fontColor: '#fff' },
  [EventType.JobReady]: { backgroundColor: '#6092bb', fontColor: '#fff' },
  [EventType.JobEnRoute]: { backgroundColor: '#8c69c6', fontColor: '#fff' },
  [EventType.JobOnSite]: { backgroundColor: '#6d46ac', fontColor: '#fff' },
  [EventType.JobInProgress]: { backgroundColor: '#6330b6', fontColor: '#fff' },
  [EventType.JobComplete]: { backgroundColor: '#66b66b', fontColor: '#fff' },
  [EventType.JobCancelled]: { backgroundColor: '#cd5145', fontColor: '#fff' },
  [EventType.Unavailability]: { backgroundColor: '#e5e7ee', fontColor: '#333e57' },
  [EventType.Activity]: { backgroundColor: '#6f7992', fontColor: '#fff' },
  [EventType.Shift]: { backgroundColor: '#cd5145', fontColor: '#fff' },
  [EventType.Default]: { backgroundColor: '#000', fontColor: '#fff' }
}

const getEventWorkingTime = (event: CalendarEvent) => {
  if (event.typeId === EventType.Unavailability) return 0

  const time = event.end.getTime() - event.start.getTime()

  return time || 0
}

const sumEventsWorkingTime = (events: CalendarEvent[] = []) => {
  return events.reduce((acc, event) => {
    return acc + getEventWorkingTime(event)
  }, 0)
}

const customSubheader = ({ dayEvents }: { day: Date, dayEvents: CalendarEvent[], allEvents: CalendarEvent[] }) => {
  const time = sumEventsWorkingTime(dayEvents)
  const { hours, minutes } = breakMilisecondsToHoursAndMinutes(time)
  const hoursLabel = `${hours}h`
  const minutesLabel = minutes > 0 ? `${minutes}m` : ''
  return (
    <div
      style={ {
        textTransform: 'lowercase'
      } }
    >
      { `${hoursLabel} ${minutesLabel}` }
    </div>
  )
}

const CalendarView: React.FC<Props> = props => {
  const [updateTimesheetEntryId, setUpdateTimesheetEntryId] = React.useState<UID | undefined>(undefined)

  if (!props.timesheet) return null

  const entries = props.timesheet.Entries
  const events = entries && entries.map(entry => {
    const theme = eventThemes[getEntryEventType(entry)]
    return {
      typeId: getEntryEventType(entry),
      name: getEntryEventName(entry),
      status: getEntryEventStatus(entry),
      start: moment(`${entry.StartDate} ${entry.StartTime}`, 'YYYY-MM-DD HH:mm').toDate(),
      end: moment(`${entry.EndDate} ${entry.EndTime}`, 'YYYY-MM-DD HH:mm').toDate(),
      onClick: () => setUpdateTimesheetEntryId(entry.UID),
      ...theme
    }
  })

  sumEventsWorkingTime(events)

  return (
    <div>
      <Calendar
        events={ events }
        startDate={ new Date(props.timesheet.StartDate) }
        endDate={ new Date(props.timesheet.EndDate) }
        customSubheader={ customSubheader }
      />
      <BaseModal
        title="Update Timesheet Entry"
        isOpened={ !!updateTimesheetEntryId }
        onClose={ () => setUpdateTimesheetEntryId(undefined) }
      >
        <TimesheetEntryForm
          close={ () => setUpdateTimesheetEntryId(undefined) }
          TimesheetUID={ props.timesheet.UID }
          TimesheetEntryUID={ updateTimesheetEntryId }
        />
      </BaseModal>
    </div>
  )
}

export default CalendarView
