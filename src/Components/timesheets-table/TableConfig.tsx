import React from 'react'
import { TableConfigColumns, sortDirection } from 'skedulo-ui'
import { isEmpty } from 'lodash'
import {
  getActualLoggedTimeInMinute,
  getEntryType,
  getJobAllocationByTimeSheetEntry
} from '../../common/utils/timesheetEntry'
import { ReduxDataTypes, TimesheetStatus } from '../../StoreV2/DataTypes'
import { NumberCell } from './cell-formatters/NumberCell'
import { DurationCell } from './cell-formatters/DurationCell'
import { ResourceCell } from './cell-formatters/ResourceCell'
import { StatusCell } from './cell-formatters/StatusCell'
import { DateRangeCell } from './cell-formatters/DateRangeCell'
import { ActionsCell } from './cell-formatters/ActionsCell'
import { TimesheetDetails } from './TimesheetDetails/TimesheetDetails'
import { DateTimeCell } from './cell-formatters/DateTimeCell'
// import { TotalDistanceCell } from './cell-formatters/TotalDistanceCell'

interface TableConfigOptions<T> {
  sortable?: {
    onSort: (
      sortedData?: T[],
      sortedBy?: string,
      sortDirection?: sortDirection
    ) => void
    sortKey?: string
    initialSortDirection?: sortDirection
  }
  selectable?: {
    selectBy: keyof T
    onSelect: (selectBy: keyof T, selection: Set<string>, data: T[]) => void
    selectAll?: boolean
  }
  expandable?: {
    onExpand: (rowData: T) => React.ReactElement
  }
  fixedFirstColumn?: boolean
}
interface IGetOptions<T> {
  onSelect: (selectBy: keyof T, selection: Set<string>, data: T[]) => void
}

export const getTableOptions: (
  params: IGetOptions<ReduxDataTypes.TimesheetEntry>
) => TableConfigOptions<ReduxDataTypes.TimesheetEntry> = ({ onSelect }) => ({
  selectable: {
    onSelect,
    selectBy: 'UID',
    selectAll: true
  },
  expandable: {
    onExpand: rowData => {
      return <TimesheetDetails timeSheetEntryId={ rowData.UID } />
    }
  }
})

interface IGetColumns {
  onSubmit: (id: string) => void
  onApprove: (id: string) => void
  onRecall: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}

export const getTSEntryColumns = (
  { onSubmit, onApprove, onRecall, onReject }: IGetColumns,
  defaultTimezone: string
) => {
  const columns = [
    {
      key: 'Timesheet.Resource' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Resource Name',
      cellRenderer: (resource: ReduxDataTypes.Timesheet['Resource']) => {
        return <ResourceCell resource={ resource } />
      },
      sortable: true
    },
    {
      key: 'EntryType' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Job',
      className: 'sk-pl-0',
      cellRenderer: (uid: string, entry: ReduxDataTypes.TimesheetEntry) => {
        return <span>{getEntryType(entry)}</span>
      },
      sortable: true
    },
    {
      key: 'Job.Account' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Account',
      emptyPlaceholderText: '-',
      className: 'sk-pl-0',
      cellRenderer: (uid: string, entry: ReduxDataTypes.TimesheetEntry) => {
        return (
          <span>
            {entry.Job && entry.Job.Account ? entry.Job.Account.Name : '-'}
          </span>
        )
      },
      sortable: true
    },
    {
      key: 'StartDate' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Date and Time',
      cellRenderer: (uid: string, entry: ReduxDataTypes.TimesheetEntry) => {
        const jobTimeZone = entry.Job ? entry.Job.Timezone : defaultTimezone
        return (
          <>
            <DateTimeCell
              date={ entry.StartDate }
              time={ entry.StartTime }
              timezone={ jobTimeZone }
              format="D MMM YYYY hh:mm a (z)"
            />{' '}
            -{' '}
            <DateTimeCell
              date={ entry.EndDate }
              time={ entry.EndTime }
              timezone={ jobTimeZone }
              format="D MMM YYYY hh:mm a (z)"
            />
          </>
        )
      },
      sortable: true
    },
    {
      key: 'LunchBreakDuration' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Lunch Break',
      cellRenderer: (lunchBreakDuration: string, entry: ReduxDataTypes.TimesheetEntry) => {
        const jobAllocation = getJobAllocationByTimeSheetEntry(entry)
        if (!isEmpty(jobAllocation) && jobAllocation.LunchBreakDuration) {
          const lunchBreakDurationJA = jobAllocation.LunchBreakDuration || lunchBreakDuration
          return (
            <DurationCell
              value={
                lunchBreakDurationJA as number
              }
              isInMinutes
            />
          )
        }
        return <span>0</span>
      },
      sortable: true
    },
    {
      key: 'ActualDuration' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Total Hours',
      emptyPlaceholderText: '-',
      cellRenderer: (id: string, entry: ReduxDataTypes.TimesheetEntry) => {
        const loggedTimeInMinute = getActualLoggedTimeInMinute(entry)
        return (
          <DurationCell
            value={
              typeof loggedTimeInMinute === 'number'
                ? loggedTimeInMinute
                : undefined
            }
            isInMinutes
          />
        )
      },
      sortable: true
    },
    {
      key: 'Distance' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Travel Distance',
      emptyPlaceholderText: '-',
      cellRenderer: (
        uid: string,
        { Distance, DistanceUnit }: ReduxDataTypes.TimesheetEntry
      ) => {
        return (
          <NumberCell
            value={ Distance! % 1 ? Distance!.toFixed(2) : Distance }
            unit={ DistanceUnit }
          />
        )
      }
      // sortable: true
    },
    {
      key: 'UID' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Premiums',
      emptyPlaceholderText: '-',
      cellRenderer: (uid: string, entry: ReduxDataTypes.TimesheetEntry) => {
        const jobAllocation = getJobAllocationByTimeSheetEntry(entry)
        if (!isEmpty(jobAllocation) && !isEmpty(jobAllocation.Premiums)) {
          const premiums = jobAllocation.Premiums.join(', ') || '-'
          return <span>{premiums}</span>
        }
        return <span>-</span>
      }
    },
    {
      key: 'Timesheet.Status' as keyof ReduxDataTypes.Timesheet,
      name: 'Status',
      width: 130,
      emptyPlaceholderText: '-',
      cellRenderer: (status: TimesheetStatus) => (
        <StatusCell type={ status } />
      ),
      sortable: true
    },
    {
      key: 'UID' as keyof ReduxDataTypes.TimesheetEntry,
      name: 'Action',
      width: 180,
      emptyPlaceholderText: '-',
      cellRenderer: (uid: string, entry: ReduxDataTypes.TimesheetEntry) => {
        return (
          <ActionsCell
            timeSheetEntryId={ uid }
            timesheetStatus={ entry.Timesheet.Status }
            onSubmit={ onSubmit }
            onApprove={ onApprove }
            onReject={ onReject }
            onRecall={ onRecall }
          />
        )
      }
    }
  ]
  return columns
}

export const getColumns = ({
  onSubmit,
  onApprove,
  onRecall,
  onReject
}: IGetColumns) => [
  {
    key: 'Resource',
    name: 'Resource name',
    width: 200,
    emptyPlaceholderText: '-',
    cellRenderer: resource => <ResourceCell resource={ resource } />
  },
  {
    name: 'Date',
    key: 'StartDate',
    width: 145,
    emptyPlaceholderText: '-',
    cellRenderer: (startDate, row) => (
      <DateRangeCell startDate={ startDate } endDate={ row.EndDate } />
    )
  },
  {
    key: 'Job',
    name: 'Jobs',
    width: 110,
    emptyPlaceholderText: '-',
    cellRenderer: job => <DurationCell value={ job * 60 } isInMinutes />
  },
  {
    key: 'Shift',
    name: 'Shifts',
    width: 110,
    emptyPlaceholderText: '-',
    cellRenderer: shift => <DurationCell value={ shift } />
  },
  {
    key: 'Activity',
    name: 'Activities',
    width: 110,
    emptyPlaceholderText: '-',
    cellRenderer: activity => <DurationCell value={ activity } />
  },
  {
    key: 'Unavailability',
    width: 120,
    emptyPlaceholderText: '-',
    cellRenderer: unavailability => <DurationCell value={ unavailability } />
  },
  {
    key: 'Manual',
    width: 110,
    emptyPlaceholderText: '-',
    cellRenderer: manual => <DurationCell value={ manual } />
  },
  {
    key: 'Logged',
    name: 'Total Time Logged',
    width: 120,
    emptyPlaceholderText: '-',
    cellRenderer: logged => (
      <DurationCell value={ logged * 60 } bold isInMinutes />
    )
  },
  {
    key: 'Distance',
    width: 110,
    emptyPlaceholderText: '-',
    cellRenderer: (distance, item) => (
      <NumberCell
        value={ distance! % 1 ? distance!.toFixed(2) : distance }
        unit={ item.DistanceUnit }
      />
    )
  },
  {
    key: 'Status',
    width: 130,
    emptyPlaceholderText: '-',
    cellRenderer: status => <StatusCell type={ status } />
  },
  {
    key: 'UID',
    name: 'Action',
    width: 180,
    emptyPlaceholderText: '-',
    cellRenderer: (id, row) => {
      return (
        <ActionsCell
          timeSheetEntryId={ id }
          timesheetStatus={ row.Timesheet.Status }
          onSubmit={ onSubmit }
          onApprove={ onApprove }
          onReject={ onReject }
          onRecall={ onRecall }
        />
      )
    }
  }
  // TODO: dev helper - remove when no more required
  // {
  //   key: 'Name',
  //   name: 'Delete',
  //   width: 100,
  //   cellRenderer: (dev, row) => (
  //     <Button
  //       buttonType="secondary"
  //       compact
  //       onClick={ () => onDelete(row.UID) }
  //     >Delete
  //     </Button>
  //   )
  // } as TableConfigColumns<ReduxDataTypes.TimesheetTableItem, 'Name'>
] as TableConfigColumns<ReduxDataTypes.TimesheetEntry>[]

// const getTotalColumns = () => {
//   const columns = getColumns({
//     onSubmit: () => {},
//     onApprove: () => {},
//     onRecall: () => {},
//     onReject: () => {},
//     onDelete: () => {}
//   }).map(col => {
//     switch (col.key) {
//       case 'Resource':
//         return {
//           ...col,
//           emptyPlaceholderText: 'Total',
//           cellRenderer: () => (
//             <div className="sk-text-blue-dark sk-font-semibold sk-my-2">Total</div>
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       case 'Job':
//         return {
//           ...col,
//           cellRenderer: (value: number) => (
//             <DurationCell value={ value } bold />
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       case 'Shift':
//         return {
//           ...col,
//           cellRenderer: (value: number) => (
//             <DurationCell value={ value } bold />
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       case 'Activity':
//         return {
//           ...col,
//           cellRenderer: (value: number) => (
//             <DurationCell value={ value } bold />
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       case 'Logged':
//         return {
//           ...col,
//           cellRenderer: (value: number) => (
//             <DurationCell value={ value } bold />
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       case 'Availability':
//       case 'Unavailability':
//         return {
//           ...col,
//           cellRenderer: (value: number) => (
//             <DurationCell value={ value } bold />
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       case 'Manual':
//         return {
//           ...col,
//           cellRenderer: (value: number) => (
//             <DurationCell value={ value } bold />
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       case 'Distance':
//         return {
//           ...col,
//           cellRenderer: (value: number) => (
//             <TotalDistanceCell
//               value={ value! % 1 ? value!.toFixed(2) : value }
//             />
//           )
//         } as TableConfigColumns<TimesheetTableItem>
//       default:
//         return {
//           ...col,
//           cellRenderer: () => null,
//           emptyPlaceholderText: ' '
//         } as TableConfigColumns<TimesheetTableItem>
//     }
//   })

//   return columns
// }

// const getTotalOptions = () => {
//   return {
//     selectable: undefined as {
//         selectBy: keyof TimesheetTableItem
//         onSelect: (selectBy: keyof TimesheetTableItem, selection: Set<string>, data: TimesheetTableItem[]) => void
//         selectAll?: boolean
//     }
//   }
// }

export type TimesheetTableTotalItem = Pick<
  ReduxDataTypes.TimesheetTableItem,
  'Job' | 'Activity' | 'Logged' | 'Availability' | 'Unavailability' | 'Distance'
> & {
  Resource: string
  [index: string]: string | number | null | undefined
};

// const getTotalData = (tableData: ReduxDataTypes.TimesheetTableItem[]) => {
//   const totalData: TimesheetTableTotalItem = {
//     Job: undefined,
//     Shift: undefined,
//     Activity: undefined,
//     Logged: undefined,
//     Availability: undefined,
//     Unavailability: undefined,
//     Manual: undefined,
//     Distance: undefined,
//     Resource: 'Total'
//   }

//   totalData.Job = tableData.reduce((acc, row) => row.Job ? acc + row.Job : acc, 0) || undefined
//   totalData.Shift = tableData.reduce((acc, row) => row.Shift ? acc + row.Shift : acc, 0) || undefined
//   totalData.Activity = tableData.reduce((acc, row) => row.Activity ? acc + row.Activity : acc, 0) || undefined
//   totalData.Logged = tableData.reduce((acc, row) => row.Logged ? acc + row.Logged : acc, 0) || undefined
//   totalData.Availability = tableData.reduce((acc, row) => row.Availability ? acc + row.Availability : acc, 0) || undefined
//   totalData.Unavailability = tableData.reduce((acc, row) => row.Unavailability ? acc + row.Unavailability : acc, 0) || undefined
//   totalData.Manual = tableData.reduce((acc, row) => row.Manual ? acc + row.Manual : acc, 0) || undefined
//   totalData.Distance = tableData.reduce((acc, row) => row.Distance ? acc + row.Distance : acc, 0) || undefined

//   return totalData
// }

// export const getTotalConfig: () => TableTotalConfig<TimesheetTableItem, TimesheetTableTotalItem> = () => {
//   return {
//     getTotalData,
//     options: getTotalOptions(),
//     // columns: getTotalColumns()
//   }
// }
