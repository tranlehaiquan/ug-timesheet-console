import * as React from "react";
import classnames from "classnames";
import { Button, ButtonTypes } from "skedulo-ui";
// import { TimesheetEntriesTable } from './TimesheetEntriesTable'
import ApprovalDetails from "./ApprovalDetails";
// import CalendarView from './CalendarView'

// import TimesheetEntryForm from '../../Forms/TimesheetEntryForm/TimesheetEntryForm'
// import { BaseModal } from '../../Modals'
// import ReduxDataTypes, { UID } from '../../../Store/DataTypes'

interface ITimesheetDetails {
  timeSheetEntryId: string;
}

enum View {
  Entries,
  Calendar,
  Approval,
}

export const TimesheetDetails: React.FC<ITimesheetDetails> = ({
  timeSheetEntryId,
}) => {
  // const [visiblePopup, setVisiblePopup] = React.useState(false)
  const [currentView, setCurrentView] = React.useState(View.Approval);

  return (
    <div>
      <div className="sk-flex sk-justify-between sk-my-3">
        <div>
          {/* <Button
            buttonType={ 'transparent' as ButtonTypes }
            compact
            className={ classnames('sk-mr-2', 'sk-pl-0', { 'sk-text-blue': currentView === View.Entries }) }
            onClick={ () => setCurrentView(View.Entries) }
          >
            List view
          </Button> */}
          {/* <Button
            buttonType={ 'transparent' as ButtonTypes }
            compact
            className={ classnames('sk-mr-2', { 'sk-text-blue': currentView === View.Calendar }) }
            onClick={ () => setCurrentView(View.Calendar) }
          >
            Calendar view
          </Button> */}
          <Button
            buttonType={"transparent" as ButtonTypes}
            compact
            className={classnames("sk-mr-2", {
              "sk-text-blue": currentView === View.Approval,
            })}
            onClick={() => setCurrentView(View.Approval)}
          >
            Approval Details
          </Button>
        </div>
        {/* <Button
          buttonType={ 'transparent' as ButtonTypes }
          compact
          className="sk-pr-0 sk-text-blue"
          onClick={ () => setVisiblePopup(true) }
        >
          <Icon name="plus" size={ 12 } /> Timesheet entry
        </Button> */}
      </div>

      {/* { currentView === View.Entries && <TimesheetEntriesTable timesheet={ timesheet } /> } */}
      {currentView === View.Approval && (
        <ApprovalDetails timeSheetEntryId={timeSheetEntryId} />
      )}
      {/* { currentView === View.Calendar && <CalendarView timesheet={ timesheet } /> } */}

      {/* <BaseModal
        title="New Timesheet Entry"
        isOpened={ visiblePopup }
        onClose={ () => setVisiblePopup(false) }
      >
        <TimesheetEntryForm
          close={ () => setVisiblePopup(false) }
          TimesheetUID={ timesheetId }
        />
      </BaseModal> */}
    </div>
  );
};
