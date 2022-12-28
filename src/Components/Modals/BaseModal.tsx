import * as React from 'react'
import { BaseModal as UIBaseModal, Icon, Button } from 'skedulo-ui'


import './Modals.scss'

export interface BaseModalProps {
  title: string
  isOpened: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const BaseModal: React.FC<BaseModalProps> = props => {
  let className = 'base-modal__content sk-p-6'
  if (props.className) {
    className = `${className} ${props.className}`
  }

  return props.isOpened ? (
    <UIBaseModal>
      <div className={ className }>
        <header className="sk-flex sk-justify-between sk-items-center sk-mb-8">
          <h3 style={ { fontSize: 20, color: '#223049' } }>{ props.title }</h3>
          <Button
            buttonType="transparent"
            onClick={ props.onClose }
            compact
            className="sk-p-1 sk-leading-none"
          >
            <Icon
              name="remove"
              size={ 12 }
              color="#485875"
              className="sk-cursor-pointer"
            />
          </Button>
        </header>
        { props.children }
      </div>
    </UIBaseModal>
  ) : null
}

export default BaseModal