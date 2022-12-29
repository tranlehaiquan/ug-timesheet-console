import * as React from "react";
import { Position } from "../info-window/info-window-utils";

import {
  InfoWindow,
  IInfoWindowProps,
} from "../info-window/InfoWindow";

import "./tooltip.scss";

export type ITooltipPosition = Position;
type IColorScheme = "dark" | "light";

export interface ITooltipProps extends IInfoWindowProps {
  /**
   * Colour scheme for the tooltip content.  Available options are 'dark' and 'light'
   */
  colorScheme?: IColorScheme;
}

/**
 * Tooltips are an extened version of the info window that triggers on hover by default, delayed slightly and is styled with tooltip styles
 */
export class Tooltip extends React.PureComponent<React.PropsWithChildren<ITooltipProps>, {}> {
  static defaultProps = {
    event: "hover",
    delayShow: 250,
    colorScheme: "dark",
  };

  render() {
    const { colorScheme, children, containerClassName } = this.props;

    const containerClasses = `sked-tooltip sked-tooltip--${colorScheme} ${
      containerClassName || ""
    }`;
    return (
      <InfoWindow {...this.props} containerClassName={containerClasses}>
        {children}
      </InfoWindow>
    );
  }
}
