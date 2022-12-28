import * as React from 'react'
import { BaseModal } from 'skedulo-ui'
import { FormModalHeader, FormModalHeaderProps } from './FormModalHeader'

interface Props extends FormModalHeaderProps {
  isVisible: boolean
}

export const FormModal: React.FC<Props> = ({ title, children, isVisible, onHide }) => {
  return (
    <>
      { isVisible && (
      <BaseModal>
        <div className="sk-p-8">
          <FormModalHeader
            title={ title }
            onHide={ onHide }
          />
          { children }
        </div>
      </BaseModal>
      ) }
    </>
  )
}

export default FormModal
