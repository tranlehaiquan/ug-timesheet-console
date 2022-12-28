import * as React from "react";
import { omit } from "lodash";

import { Portal } from "../portal/Portal";
import { Button } from "../buttons/button/Button";
import { ButtonGroup } from "../button-group/ButtonGroup";

export const BaseModal: React.SFC = ({ children, ...otherProps }) => {
  return (
    <Portal>
      {/* TODO: UPDATE FOLLOWING LINES ON DESIGN COMPONENT */}
      <div
        className="sk-fade-in sk-fixed sk-pin sked-modal-bg sk-flex sk-justify-center sk-items-center sk-font-sans"
        data-sk-name="sked-modal"
      >
        <div
          {...otherProps}
          className="sk-bg-white sk-text-sm sk-rounded-medium sk-absolute sked-modal-position-top sk-shadow-lg"
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

BaseModal.displayName = "BaseModal";

export interface IConfirmationModalProps {
  onConfirm: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  confirmButtonText?: string;
  /**
   * Used to indicate the current onConfirm action is in progress.
   */
  useWorkingStateOnConfirm?: boolean;
}

export interface IConfirmationModalState {
  confirmActionLoading: boolean;
}

export class ConfirmationModal extends React.PureComponent<
  IConfirmationModalProps,
  IConfirmationModalState
> {
  constructor(props: IConfirmationModalProps) {
    super(props);
    this.state = {
      confirmActionLoading: false,
    };
  }

  handleConfirmButtonClick = () => {
    const { onConfirm, useWorkingStateOnConfirm } = this.props;

    /* Used to indicate loading state if the confirm button action takes time */
    if (useWorkingStateOnConfirm) {
      this.setState({ confirmActionLoading: true });
    }

    return onConfirm();
  };

  render() {
    const { children, onCancel, onConfirm, confirmButtonText, ...rest } =
      this.props;
    const otherProps = omit(rest, ["useWorkingStateOnConfirm"]);

    return (
      <BaseModal {...otherProps}>
        <div className="sk-pt-10 sk-px-6 sk-pb-6 sk-flex sk-flex-col sked-modal-small">
          <div className="sk-flex-grow">{children}</div>
          <div className="sk-text-right">
            <ButtonGroup>
              <Button
                data-sk-name="cancel-button"
                buttonType="transparent"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                data-sk-name="confirm-button"
                buttonType="primary"
                onClick={this.handleConfirmButtonClick}
                loading={this.state.confirmActionLoading}
              >
                {confirmButtonText || "Yes"}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </BaseModal>
    );
  }
}
