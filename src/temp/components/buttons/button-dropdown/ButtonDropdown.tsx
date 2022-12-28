import * as React from "react";

import { Icon } from "../../icon/Icon";
import { PopOut, IPopOutState } from "../../popout/PopOut";
import { Button } from "../button/Button";
import { IButtonDropdownCommon } from "../interfaces";

interface IButtonDropdownProps extends IButtonDropdownCommon {
  /**
   * Text to display on the button
   */
  label: string;
}

/**
 * The DropdownButton component displays/hides children as a dropdown when clicked. The Menu and MenuItem
 components are strongly recommended to be used in conjunction with this component to enforce correct styling of the dropdown menu.
 */
export const ButtonDropdown: React.FC<IButtonDropdownProps> = ({
  label,
  placement,
  className,
  popOutContainer,
  children,
  buttonType,
  ...otherProps
}) => {
  const trigger = (isOpen: IPopOutState["isOpen"]) => (
    <Button
      {...otherProps}
      buttonType={buttonType || "secondary"}
      className={className}
      active={isOpen}
    >
      {label}
      <Icon name="chevronDown" className="sk-ml-1 sk--mr-1" />
    </Button>
  );

  const renderContent = () => children;

  return (
    <PopOut
      placement={placement}
      popOutContainer={popOutContainer}
      trigger={trigger}
      closeOnFirstClick
    >
      {renderContent}
    </PopOut>
  );
};
