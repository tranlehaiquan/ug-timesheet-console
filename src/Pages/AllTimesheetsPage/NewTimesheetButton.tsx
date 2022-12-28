import * as React from 'react'
import { Button } from 'skedulo-ui'
import TimesheetForm from '../../components/Forms/TimesheetForm/TimesheetForm'
import { BaseModal } from '../../components/Modals'

export const NewTimesheetButton: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = React.useState(false)
  return (
    <>
      <Button
        buttonType="primary"
        onClick={ () => setModalVisible(true) }
      >
        New Timesheet
      </Button>

      <BaseModal
        title="New Timesheet Record"
        isOpened={ modalVisible }
        onClose={ () => setModalVisible(false) }
      >
        <TimesheetForm
          onCancel={ () => setModalVisible(false) }
          onSuccess={ () => setModalVisible(false) }
          onError={ () => setModalVisible(false) }
        />
      </BaseModal>
    </>
  )
}

export default NewTimesheetButton
