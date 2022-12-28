import React from "react";
import moment from "moment";
import { selectJobAllocationByTimeSheetEntry } from "../../../StoreV2/slices/timeSheetEntriesSlice";
import { Label } from "../../Forms/Utils/Label";
import { ConfirmationModal, ConfirmationModalProps } from "../../Modals";
import useCommentBox from "./useCommentBox";
import ReduxDataTypes from "../../../StoreV2/DataTypes";
// import { useSelector } from 'react-redux'
// import { RootState } from 'src/StoreV2/store'
import { minutesToDuration } from "../../../common/utils/dateTimeHelpers";

interface ActionLabels {
  title: string;
  period: string;
  comment: string;
  confirm: string;
}

export type Action = "approve" | "submit" | "reject" | "recall";

const actionLabels: { [k in Action]: ActionLabels } = {
  approve: {
    title: "Approve",
    period: "Approved Period",
    comment: "Approver Note",
    confirm: "Approve",
  },
  submit: {
    title: "Submit",
    period: "Submitted Period",
    comment: "Note for Approver",
    confirm: "Submit",
  },
  reject: {
    title: "Reject",
    period: "Rejected Period",
    comment: "Rejection Note",
    confirm: "Reject",
  },
  recall: {
    title: "Recall",
    period: "Recalled Period",
    comment: "Can we note sth?",
    confirm: "Recall",
  },
};

export interface SingleUpdateModalProps extends ConfirmationModalProps {
  action: Action;
  timeSheetEntry: ReduxDataTypes.TimesheetEntry;
  timesheetsToUpdateCount?: number;
  timesheetsCount?: number;
}

const SingleUpdateModal: React.FC<SingleUpdateModalProps> = (props) => {
  const [comment, setComment, renderComment] = useCommentBox();
  const onConfirm = () => {
    props.onConfirm(comment);
  };
  const onClose = () => {
    setComment("");
    props.onClose();
  };

  const labels = actionLabels[props.action];
  const jobAllocation = selectJobAllocationByTimeSheetEntry(
    props.timeSheetEntry
  );
  return (
    <ConfirmationModal
      {...props}
      title={labels.title}
      onConfirm={onConfirm}
      onClose={onClose}
      confirmLabel={labels.confirm}
    >
      <div className="sk-mb-16" style={{ width: "24rem" }}>
        <div className="sk-mb-8">
          <div className="sk-flex sk-mb-2">
            <div className="sk-w-1/2">
              <Label text={labels.period} />
            </div>
            <div className="sk-w-1/2">
              {moment(props.timeSheetEntry.StartDate).format("DD MMM YYYY")} -{" "}
              {moment(props.timeSheetEntry.EndDate).format("DD MMM YYYY")}
            </div>
          </div>
          <div className="sk-flex sk-mb-2">
            <div className="sk-w-1/2">
              <Label text="Worked Hours" />
            </div>
            <div className="sk-w-1/2">
              {jobAllocation
                ? minutesToDuration(jobAllocation.TimesheetDuration)
                : "0"}
            </div>
          </div>
        </div>
        {renderComment(labels.comment)}
      </div>
    </ConfirmationModal>
  );
};

export default SingleUpdateModal;
