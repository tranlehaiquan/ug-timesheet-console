import * as React from "react";
import classNames from "classnames";

import { Tooltip, ITooltipProps } from "../../popups/tooltip/Tooltip";
import { IconNames } from "../../icon/Icon";
import { Button, IButtonProps } from "../button/Button";

interface IconButtonProps {
  icon: IconNames;
  tooltipContent: ITooltipProps["content"];
  tooltipDelay?: ITooltipProps["delayShow"];
  disableTooltip?: boolean;
}
export type IIconButton = IconButtonProps & Partial<IButtonProps>;

export const IconButton: React.FC<IIconButton> = ({
  icon,
  tooltipContent,
  buttonType,
  className,
  tooltipDelay,
  disableTooltip,
  ...otherProps
}) => {
  const button = (
    <Button
      buttonType={buttonType || "transparent"}
      className={classNames("sked-button--icon-only", className)}
      icon={icon}
      {...otherProps}
    />
  );

  if (disableTooltip) {
    return button;
  }

  return (
    <Tooltip content={tooltipContent} position="top" delayShow={tooltipDelay}>
      {button}
    </Tooltip>
  );
};
