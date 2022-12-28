import * as React from 'react'
import { useSelector } from 'react-redux'
import { ButtonDropdown, Menu, MenuItem } from 'skedulo-ui'

import { selectTimeSheetEntryById } from '../../StoreV2/slices/timeSheetEntriesSlice'
import { ReduxDataTypes } from '../../StoreV2/DataTypes'
import UpdateStatusModal, { UpdateStatusModalProps, SingleUpdateModalAction } from '../../components/timesheets-table/UpdateStatusModal'
import { RootState } from '../../StoreV2/store'

interface Props {
  selectedTimeSheetEntryUIDs: Set<string>
  onReject: (timeSheetEntryId: string | string[], comment: string) => void
  onApprove: (timeSheetEntryId: string | string[], comment: string) => void
}

const getSelectedTimeSheetEntries = (entries: ReduxDataTypes.TimesheetEntry[], selectedTimeSheetEntryUIDs: Set<string>) => {
  return [...selectedTimeSheetEntryUIDs].map(uid => entries.find(entry => entry.UID === uid))
}

export const BulkActionsButton: React.FC<Props> = ({ selectedTimeSheetEntryUIDs, onReject, onApprove }) => {
  const selectedTimeSheetEntries = useSelector((state: RootState) => getSelectedTimeSheetEntries(state.timeSheetEntries.values, selectedTimeSheetEntryUIDs))
  const [updateModalProps, setUpdateModalProps] = React.useState<Partial<UpdateStatusModalProps>>({ isOpened: false })

  const onRejectClick = () => {
    const rejectableTimeSheetEntries = getTimeSheetEntriesWithoutStatus('Rejected')
    if (selectedTimeSheetEntryUIDs.size === 1 && rejectableTimeSheetEntries.length === 1) {
      openSingleUpdateModal(rejectableTimeSheetEntries[0].UID, 'reject', onReject)
    } else {
      openBatchUpdateModal(rejectableTimeSheetEntries.map(entry => entry.UID), onReject, 'Reject timesheets', 'rejected')
    }
  }

  const onApproveClick = () => {
    const approvedTimeSheetEntries = getTimeSheetEntriesWithoutStatus('Approved')
    if (selectedTimeSheetEntryUIDs.size === 1 && approvedTimeSheetEntries.length === 1) {
      openSingleUpdateModal(approvedTimeSheetEntries[0].UID, 'approve', onApprove)
    } else {
      openBatchUpdateModal(approvedTimeSheetEntries.map(entry => entry.UID), onApprove, 'Approve timesheets', 'approved')
    }
  }

  const openSingleUpdateModal = (
    timeSheetEntryId: string,
    action: SingleUpdateModalAction,
    onConfirm: (timeSheetEntryId: string | string[], comment: string) => void
  ) => {
    setUpdateModalProps({
      action,
      timeSheetEntry: selectTimeSheetEntryById(selectedTimeSheetEntries, timeSheetEntryId),
      isOpened: true,
      onConfirm: (comment: string) => onConfirm(timeSheetEntryId, comment),
      timesheetsCount: 1,
      timesheetsToUpdateCount: 1,
      onClose: closeUpdateModal
    })
  }

  const openBatchUpdateModal = (
    timeSheetEntryIDs: string[],
    onConfirm: (timeSheetEntryId: string | string[], comment: string) => void,
    title: string,
    status: string
  ) => {
    setUpdateModalProps({
      title,
      status,
      isOpened: true,
      onConfirm: (comment: string) => onConfirm(timeSheetEntryIDs, comment),
      timesheetsCount: selectedTimeSheetEntryUIDs.size,
      timesheetsToUpdateCount: timeSheetEntryIDs.length,
      onClose: closeUpdateModal
    })
  }

  const closeUpdateModal = () => {
    setUpdateModalProps({
      isOpened: false
    })
  }

  const getTimeSheetEntriesWithoutStatus = (status: string) => {
    return selectedTimeSheetEntries.filter(entry => entry.Timesheet.Status !== status)
  }

  return (
    <div>
      <ButtonDropdown
        label="Bulk actions"
        className="sk-mr-3"
        disabled={ !selectedTimeSheetEntryUIDs.size }
      >
        <Menu>
          <MenuItem onClick={ onRejectClick }>Reject</MenuItem>
          <MenuItem onClick={ onApproveClick }>Approve</MenuItem>
        </Menu>
      </ButtonDropdown>
      <UpdateStatusModal { ...(updateModalProps as UpdateStatusModalProps) } />
    </div>
  )
}
