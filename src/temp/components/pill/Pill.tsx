import * as React from "react";
import { OverflowTooltip } from "../popups/overflow-tooltip/OverflowTooltip";
import { Icon, IconNames } from "../icon/Icon";
import { ITooltipPosition } from "../popups/tooltip/Tooltip";

export interface IPillProps {
  text: string;
  /**
   * Default position is right
   */
  tooltipPosition?: ITooltipPosition;
  iconName?: IconNames;
  onClose?: () => void;
}
/**
 * Creates a Pill. Text will be truncated at 190px and a Tooltip will be enabled
 * If you supply an onClose function, a close icon will appear and call that function on click
 * @requires OverflowTooltip
 * @requires Icon
 */
export const Pill: React.FC<IPillProps> = ({
  iconName,
  tooltipPosition,
  text,
  onClose,
  ...otherProps
}) => {
  return (
    <div
      {...otherProps}
      className="sk-px-3 sk-bg-navy-light sk-font-medium sk-text-xs sk-rounded-full sk-text-white sk-inline-flex sk-leading-loose sk-items-center"
    >
      {iconName && (
        <Icon name={iconName} size={12} className="sk-text-white sk-mr-2" />
      )}
      <OverflowTooltip maxWidth={190} position={tooltipPosition}>
        {text}
      </OverflowTooltip>
      {onClose && (
        <Icon
          data-sk-name="pill-close"
          size={8}
          name="remove"
          className="sk-text-grey-light hover:sk-text-white sk-cursor-pointer sk-ml-2"
          onClick={onClose}
        />
      )}
    </div>
  );
};
