import * as React from "react";
import { Button } from "skedulo-ui";
import TimeSheetEntryForm from "../../components/Forms/TimeSheetEntryFormV2";
import { BaseModal } from "../../components/Modals";

export const NewTimesheetButton: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <>
      <Button buttonType="primary" onClick={() => setModalVisible(true)}>
        New Timesheet Entry
      </Button>

      <BaseModal
        title="New Timesheet Entry Record"
        isOpened={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <TimeSheetEntryForm
          timeSheetEntryId=""
          setModalVisible={setModalVisible}
        />
      </BaseModal>
    </>
  );
};

export default NewTimesheetButton;
