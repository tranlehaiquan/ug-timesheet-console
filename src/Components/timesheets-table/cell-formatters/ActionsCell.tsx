import * as React from "react";
import classnames from "classnames";

import { Button, ButtonTypes } from "skedulo-ui";

interface IActionsCell {
  timeSheetEntryId: string;
  timesheetStatus: "Draft" | "Submitted" | "Approved" | "Rejected";
  onSubmit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRecall: (id: string) => void;
}

export const ActionsCell: React.FC<IActionsCell> = ({
  timeSheetEntryId,
  timesheetStatus,
  onSubmit,
  onReject,
  onApprove,
  onRecall,
}) => {
  const statusActions = {
    Draft: [
      {
        label: "Submit",
        type: "secondary",
        onClick: () => onSubmit(timeSheetEntryId),
      },
    ],
    Submitted: [
      {
        label: "Approve",
        type: "secondary",
        onClick: () => onApprove(timeSheetEntryId),
      },
      {
        label: "Reject",
        type: "secondary",
        onClick: () => onReject(timeSheetEntryId),
      },
    ],
    Approved: [
      {
        label: "Recall Approval",
        type: "secondary",
        onClick: () => onRecall(timeSheetEntryId),
      },
    ],
    Rejected: [
      {
        label: "Recall Rejection",
        type: "secondary",
        onClick: () => onRecall(timeSheetEntryId),
      },
    ],
  };
  const availableActions = statusActions[timesheetStatus] || [];

  return (
    <div className="sk-flex">
      {availableActions.map((action, index) => (
        <Button
          key={index}
          buttonType={action.type as ButtonTypes}
          compact
          className={classnames("sk-mr-2 sk-font-normal", {
            "sk-bg-white": action.type === "secondary",
          })}
          disabled={false}
          loading={false}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
