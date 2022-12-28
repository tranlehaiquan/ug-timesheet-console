import React from 'react'
import { useSelector } from 'react-redux'
import { Icon, IconNames } from 'skedulo-ui'

import './ApprovalDetails.scss'
import { TIME_SHEET_STATUS } from '../../../common/constants/timesheet'
import { Label } from '../../Forms/Utils/Label'
import { selectTimeSheetEntryById } from '../../../StoreV2/slices/timeSheetEntriesSlice'
import { RootState } from '../../../StoreV2/store'

interface Props {
  timeSheetEntryId: string
}

const labels = {
  Approved: { by: 'Approved by' },
  Rejected: { by: 'Rejected by' },
  Submitted: { by: 'Pending approval' },
  Draft: { by: 'Not submitted' }
}

const RenderIcon: React.FC<{ name: IconNames }> = ({ name }) => (
  <div
    className="approval-details__icon-container sk-bg-blue-lighter sk-text-blue-dark sk-mr-5 sk-p-2"
    style={ { position: 'relative', bottom: '0.5rem' } }
  >
    <div>
      <Icon name={ name } size={ 16 } />
    </div>
  </div>
)

const ApprovalDetails: React.FC<Props> = props => {
  const { Timesheet: timeSheet } =
    useSelector((state: RootState) => selectTimeSheetEntryById(
      state.timeSheetEntries.values,
      props.timeSheetEntryId
    )) || {}

  if (!timeSheet) return null

  return (
    <div className="approval-details sk-px-6 sk-pb-4 sk-pt-8 sk-text-sm">
      <div className="sk-flex sk-pb-5">
        <div className="sk-flex sk-w-1/3">
          <div className="approval-details__col-1-label">
            <RenderIcon name="resource" />
            <Label text={ labels[timeSheet.Status].by } />
          </div>
          {(timeSheet.ApprovedBy && timeSheet.ApprovedBy.Name) || '-'}
        </div>
        <div className="sk-flex sk-w-2/3">
          <div className="approval-details__col-2-label">
            <RenderIcon name="sms" />
            <Label
              text={
                timeSheet.Status === TIME_SHEET_STATUS.REJECTED
                  ? 'Rejection notes'
                  : 'Approver comments'
              }
            />
          </div>
          <div>
            <p className="approval-details__comment">
              {timeSheet.ApproverComments || '-'}
            </p>
          </div>
        </div>
      </div>
      <div className="sk-flex">
        <div className="sk-flex sk-w-1/3">
          <div className="approval-details__col-1-label">
            <RenderIcon name="availability" />
            <Label text="Date" />
          </div>
          {timeSheet.ApprovedDate || '-'}
        </div>
        <div className="sk-flex sk-w-2/3">
          <div className="approval-details__col-2-label">
            <RenderIcon name="sms" />
            <Label text="Submitter comments" />
          </div>
          <div className="approval-details__comment">
            <p>{timeSheet.SubmitterComments || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalDetails
