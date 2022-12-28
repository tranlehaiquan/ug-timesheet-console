import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs/react'

import { BaseModal, ConfirmationModal } from './Modals'

storiesOf('Modals', module)
  .add('BaseModal', () => {
    return (
      <BaseModal>
        <div className="sk-p-8">
          The base modal gives you the modal page styling and a box to put your content in
        </div>
      </BaseModal>
    )
  }
)
.add('ConfirmationModal', () => {
    return (
      <ConfirmationModal onCancel={ action() } onConfirm={ action() } useWorkingStateOnConfirm={ boolean('useWorkingStateOnConfirm',false) } confirmButtonText="I sure did">
        What did you just do?! Did you mean to do it?
      </ConfirmationModal>
    )
  }
)
