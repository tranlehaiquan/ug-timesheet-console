import React from 'react'
import { BaseModal } from '../../Modals'
import { BaseModalProps } from '../../Modals/BaseModal'

export interface NoUpdateModalProps extends BaseModalProps {
  status: string
  timesheetsToUpdateCount?: number
  timesheetsCount?: number
}

const NoUpdateModal: React.FC<NoUpdateModalProps> = props => {
  return (
    <BaseModal
      { ...props }
    >
      <div className="sk-mb-16" style={ { width: '24rem' } }>
        <div className="sk-mb-4">
          <p className="sk-mb-4">
            Good News, All selected timesheets are already { props.status }.
          </p>
          <p>
            No further updates will be made.
          </p>
        </div>
      </div>
    </BaseModal>
  )
}

export default NoUpdateModal
