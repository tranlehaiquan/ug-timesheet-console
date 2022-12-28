import * as React from "react";
import classnames from "classnames";
import { ITooltipPosition, Tooltip } from "../tooltip/Tooltip";

export interface IOverflowTooltipProps {
  /** Maximum width the element expands to before being cut off */
  maxWidth?: number;
  className?: string;
  position?: ITooltipPosition;
}

export interface IOverflowTooltipState {
  overflow: boolean;
}

/**
 * OverflowTooltip will ellipse content after the specified maxWidth prop or from the
 * parent containers calculated width and apply a Tooltip to allow users to see the full
 * content on hover
 * @requires Tooltip
 */
export class OverflowTooltip extends React.PureComponent<
  IOverflowTooltipProps,
  IOverflowTooltipState
> {
  static defaultProps = {
    position: "right",
  };

  _element: HTMLDivElement;

  constructor(props: IOverflowTooltipProps) {
    super(props);

    this.state = {
      overflow: false,
    };
  }

  componentDidMount() {
    this.checkOverflow();
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  refElement = (element: HTMLDivElement) => {
    this._element = element;
  };

  checkOverflow() {
    // text should be the last child
    const overflow = this.isTextOverflow();
    if (overflow !== this.state.overflow) {
      this.setState({ overflow });
    }
  }

  isTextOverflow() {
    return this._element.clientWidth < this._element.scrollWidth;
  }

  render() {
    const { children, className, position, maxWidth } = this.props;
    const { overflow } = this.state;
    const classes = classnames("sk-truncate", className);
    const maxWidthValue = maxWidth ? `${maxWidth}px` : "100%";
    return (
      <Tooltip
        preventShow={!overflow}
        content={children}
        position={position}
        delayShow={250}
        className="sk-inline-flex"
      >
        <div
          className={classes}
          style={{ maxWidth: maxWidthValue }}
          ref={this.refElement}
        >
          {" "}
          {children}{" "}
        </div>
      </Tooltip>
    );
  }
}
