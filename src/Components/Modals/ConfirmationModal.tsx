import * as React from 'react'
import { Button, ButtonGroup } from 'skedulo-ui'
import { BaseModal } from './BaseModal'


export interface ConfirmationModalProps {
  title: string
  isOpened: boolean
  onClose: () => void
  onCancel?: () => void
  onConfirm: (message?: string) => void
  children: React.ReactNode
  confirmLabel: string
  className?: string
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = props => {
  const onCancel = () => {
    if (props.onCancel) {
      props.onCancel()
    }
    if (props.onClose) {
      props.onClose()
    }
  }

  const onConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm()
    }
    if (props.onClose) {
      props.onClose()
    }
  }

  return props.isOpened ? (
    <BaseModal { ...props }>
      <div className="sk-flex-grow">{ props.children }</div>
      <div className="sk-text-right">
        <ButtonGroup>
          <Button
            data-sk-name="cancel-button"
            buttonType="transparent"
            onClick={ onCancel }
          >
            Cancel
          </Button>
          <Button
            data-sk-name="confirm-button"
            buttonType="primary"
            onClick={ onConfirm }
          >
            { props.confirmLabel || 'Confirm' }
          </Button>
        </ButtonGroup>
      </div>
    </BaseModal>
  ) : null
}
