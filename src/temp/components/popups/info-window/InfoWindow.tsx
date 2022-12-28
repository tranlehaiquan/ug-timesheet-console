import * as React from "react";
import { mapValues } from "lodash";
import { render, unmountComponentAtNode } from "react-dom";

import {
  getPositionEvalOrder,
  getPositionScores,
  getBestFit,
  adjustContentDisplayCoordinates,
  IAnchorScores,
  notTargetAreas,
  ICursorOptions,
  ICursorPoints,
  Position,
} from "./info-window-utils";

export type Position = Position;

export type IEvent = "click" | "hover" | "mount";

export interface IInfoWindowStyles<T> {
  triangleStyles: {
    top: T;
    left: T;
  };
  contentStyles: {
    top: T;
    left: T;
  };
}

export interface IRequiredProps {
  /**
   * Content to be shown inside the info window
   */
  content: JSX.Element | JSX.Element[] | React.ReactNode | string;
  /**
   * Preferred direction around the trigger to open the info window
   */
  position: Position;
}

export type IInfoWindowProps = IRequiredProps & {
  /**
   * IEvent type used to trigger the info window
   */
  event?: IEvent;
  /**
   * Cursor options control what happens to the info window while moving the mouse within the trigger
   */
  cursorOption?: ICursorOptions;
  /**
   * Delay the render of the info window after the trigger event has been fired
   */
  delayShow?: number;
  /**
   * Prevent the display of the info window regardless of the trigger event
   */
  preventShow?: boolean;
  /**
   * ClassName to be given to the wrapper around the info window content
   */
  containerClassName?: string;
  /**
   * ClassName to be given to the wrapper around the trigger component
   */
  className?: string;
  /**
   * Data attributes to be applied to the wrapper around the trigger component
   */
  dataAttributes?: { [key: string]: string };
  /**
   * Apply 'display: inline-block' style to the wrapper around the trigger component
   */
  displayInline?: boolean;
  /**
   * Render a close button within the wrapper around the info window content
   */
  withCloseButton?: boolean;
  /**
   * Offset the trigger points used to calculate the render positions by this number of pixels
   */
  positionOffset?: number;
  /**
   * Will be called when the mouse over event is fired on the trigger component
   */
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Will be called when the mouse leave event is fired on the trigger component
   */
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Will be called when the info window is closed (regardless of the trigger event)
   */
  onClose?: () => void;
  /**
   * Styles to apply to the wrapper around the trigger component
   */
  style?: React.CSSProperties;
};

interface IState {
  show: boolean;
}

/**
 *  The infowindow module allows us to create an element next to an element. By setting props, we can determine the direction of its placement and how it gets triggered. The infowindow module has some smarts that will
    detect if it's about to get rendered off the screen. If it is, it will adjust the placement of the infowindow until it can be rendered. If it cannot be rendered in any direction, the code will pick the direction
    where the least amount of overflow is occuring. The order it tries to find a new placement in is top, right, down, left.
    The above example uses a button as the trigger for the info window, but any html element can be used as long as its passed as a child of the <InfoWindow /> component
 */
export class InfoWindow extends React.PureComponent<IInfoWindowProps, IState> {
  private _showDelayId: NodeJS.Timer | number = null;
  private _triggerRef: HTMLSpanElement = null;
  private _renderContainer: HTMLDivElement = null;
  private _contentRef: HTMLDivElement = null;
  private _triangleRef: HTMLSpanElement = null;
  private _cursorPosition: ICursorPoints = null;
  private _triggerRect: ClientRect = null;

  constructor(props: IInfoWindowProps) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    if (this.props.event === "mount") {
      const triggerCoords = this._triggerRef.getBoundingClientRect();
      this._cursorPosition = {
        x: triggerCoords.left,
        y: triggerCoords.top,
      };
      this.setShow(true);
    }
  }

  componentWillUnmount() {
    clearTimeout(this._showDelayId as number);
    this.detachEventListeners();
    this.removeRenderingContainer();
  }

  componentWillReceiveProps(
    newProps: IInfoWindowProps,
    oldProps: IInfoWindowProps
  ) {
    if (newProps.preventShow !== oldProps.preventShow && newProps.preventShow) {
      this.setShow(!newProps.preventShow);
    }
  }

  setTriggerRef = (div: HTMLDivElement) => {
    this._triggerRef = div;
  };

  setContentRef = (div: HTMLDivElement) => {
    this._contentRef = div;
  };

  setTriangleRef = (span: HTMLSpanElement) => {
    this._triangleRef = span;
  };

  showHideToggle = () => {
    this.setShow(!this.state.show);
  };

  attachEventListeners() {
    document.addEventListener("click", this.handleBodyClick, true);
    document.addEventListener("scroll", this.handleScroll, true);
    document.addEventListener("mousemove", this.onMouseMove, true);
  }

  detachEventListeners() {
    clearTimeout(this._showDelayId as number);
    document.removeEventListener("click", this.handleBodyClick, true);
    document.removeEventListener("scroll", this.handleScroll, true);
    document.removeEventListener("mousemove", this.onMouseMove, true);
  }

  setShow = (show: boolean) => {
    const { show: previousShow } = this.state;
    const { preventShow, onClose } = this.props;

    const newShow = show && !preventShow;
    const isOpening = newShow !== previousShow && newShow;
    const isClosing = newShow !== previousShow && !newShow;

    const mountContent = () => {
      const addListenersThenRender = () => {
        if (isOpening) {
          this.attachEventListeners();
        } else if (isClosing) {
          this.detachEventListeners();
        }

        this.renderContent();
      };
      const { delayShow } = this.props;
      if (delayShow > 0 && isOpening) {
        this._showDelayId = setTimeout(
          () => addListenersThenRender(),
          delayShow
        );
      } else {
        addListenersThenRender();
      }
    };
    const postAction =
      onClose && isClosing
        ? () => {
            mountContent();
            onClose();
          }
        : mountContent;

    this.setState({ show: show && !preventShow }, postAction);
  };

  registerMousePosition(e: MouseEvent | React.MouseEvent<any> | null) {
    let newPos: ICursorPoints = null;
    if (e) {
      newPos = {
        x: e.pageX,
        y: e.pageY,
      };
    }
    this._cursorPosition = newPos;
  }

  notTargetArea(e: MouseEvent) {
    return notTargetAreas([this._triggerRef, this._contentRef], e);
  }

  handleBodyClick = (e: MouseEvent) => {
    if (
      (this.props.event === "click" || this.props.event === "mount") &&
      this.state.show
    ) {
      if (this.notTargetArea(e)) {
        this.setShow(false);
      }
    }
  };

  handleScroll = (e: Event) => {
    const updatedTriggerRect = this._triggerRef
      ? this._triggerRef.getBoundingClientRect()
      : null;
    const pageScrolled =
      this._triggerRect.top !== updatedTriggerRect.top ||
      this._triggerRect.left !== updatedTriggerRect.left;
    if (this.state.show && pageScrolled) {
      this.setShow(false);
    }
  };

  onTriggerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.registerMousePosition(e);

    if (this.props.event === "click") {
      this.showHideToggle();
    }
  };

  onMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    this.registerMousePosition(e);

    if (!this.state.show && this.props.event === "hover") {
      this.setShow(true);
    }

    if (this.props.onMouseOver) {
      this.props.onMouseOver(e);
    }
  };

  onMouseLeave = (e: React.MouseEvent<any>) => {
    this.registerMousePosition(null);

    if (this.state.show && this.props.event === "hover") {
      this.setShow(false);
    }

    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  };

  onMouseMove = (e: MouseEvent) => {
    this.registerMousePosition(e);

    const { cursorOption } = this.props;

    if (cursorOption && cursorOption.keepOnMouseMove && this.state.show) {
      this.renderContent(false);
    }
  };

  getDisplayPosition = (
    triggerRect: ClientRect,
    triangleRect: ClientRect,
    contentRect: ClientRect
  ) => {
    const triggerPoint = this._cursorPosition;
    const { position: desiredPosition, cursorOption } = this.props;
    const windowRect = {
      height: window.innerHeight,
      width: window.innerWidth,
      top: window.scrollY,
      left: window.scrollX,
      right: window.innerWidth + window.scrollX,
      bottom: window.innerHeight + window.scrollY,
    };
    const triggerRectScrollShifted = {
      width: triggerRect.width,
      height: triggerRect.height,
      top: triggerRect.top + window.scrollY,
      left: triggerRect.left + window.scrollX,
      right: triggerRect.right + window.scrollX,
      bottom: triggerRect.bottom + window.scrollY,
    };

    const positionEvaluationOrder = getPositionEvalOrder(desiredPosition);

    const positionScores = getPositionScores(
      triggerPoint,
      triggerRectScrollShifted,
      contentRect,
      triangleRect,
      windowRect,
      cursorOption,
      this.props.positionOffset
    );

    const bestFit = getBestFit(positionEvaluationOrder, positionScores);

    if (bestFit.displayScore < 1) {
      return adjustContentDisplayCoordinates(bestFit, windowRect);
    }
    return bestFit;
  };

  computeStylesFromDisplayPosition = (
    anchor: IAnchorScores,
    triangleRect: ClientRect
  ): IInfoWindowStyles<number> => {
    const contentStyles = {
      top: anchor.display.top,
      left: anchor.display.left,
    };

    if (anchor.position === "bottom") {
      return {
        contentStyles,
        triangleStyles: {
          top: anchor.point.y,
          left: anchor.point.x - triangleRect.width / 2,
        },
      };
    }

    // top, right, left
    return {
      contentStyles,
      triangleStyles: {
        top: anchor.point.y - triangleRect.height / 2,
        left: anchor.point.x - triangleRect.width / 2,
      },
    };
  };

  computeStyles() {
    /**
     * If there is no content container we hide it until we can figure out the correct position
     */
    if (!this._contentRef) {
      return {
        contentStyles: { visibility: "hidden" },
        triangleStyles: { visibility: "hidden" },
        position: this.props.position,
      };
    }

    this._triggerRect = this._triggerRef.getBoundingClientRect();
    const triangleRect = this._triangleRef.getBoundingClientRect();

    const newPosition = this.getDisplayPosition(
      this._triggerRect,
      triangleRect,
      this._contentRef.getBoundingClientRect()
    );
    const styles = this.computeStylesFromDisplayPosition(
      newPosition,
      triangleRect
    );

    return {
      ...mapValues(styles, (container) =>
        mapValues(container, (value) => `${value}px`)
      ),
      position: newPosition.position,
    };
  }

  removeRenderingContainer() {
    if (this._renderContainer) {
      unmountComponentAtNode(this._renderContainer);
      document.body.removeChild(this._renderContainer);
      this._renderContainer = null;
      this._contentRef = null;
      this._triangleRef = null;
    }
  }

  createRenderContainer() {
    const div = document.createElement("div");
    div.className = "sked-infowindow";
    this._renderContainer = div;
    document.body.appendChild(div);
    return div;
  }

  /**
   * The first render wont be positioned properly since we don't have the width/height to calculate the position.
   * `runStyleRender` runs a second render when we have the contentContainer rendered to calculate the position.
   */
  renderContent(runStyleRender: boolean = true) {
    const { show } = this.state;
    const { withCloseButton, containerClassName } = this.props;
    const classNames = `sked-infowindow-wrapper ${containerClassName || ""}`;

    if (show) {
      const { contentStyles, triangleStyles, position } = this.computeStyles();

      const content = (
        <div data-sk-name="sked-infowindow-wrapper" className={classNames}>
          <div
            data-sk-name="sked-infowindow-content"
            ref={this.setContentRef}
            className={"sked-infowindow__content"}
            style={contentStyles as React.CSSProperties}
          >
            {this.props.content}
            {withCloseButton && (
              <button
                data-sk-name="close-infowindow-button"
                className="sk-button-icon transparent sked-infowindow__close"
                onClick={this.showHideToggle}
              >
                <i className="ski ski-remove" />
              </button>
            )}
          </div>
          <span
            ref={this.setTriangleRef}
            className={`sked-infowindow__triangle sked-infowindow__triangle--position-${position}`}
            style={triangleStyles as React.CSSProperties}
          />
        </div>
      );
      const renderContainer =
        this._renderContainer || this.createRenderContainer();
      render(
        content,
        renderContainer,
        () => runStyleRender && this.renderContent(false)
      );
    } else {
      this.removeRenderingContainer();
    }
  }

  render() {
    const { dataAttributes, className, displayInline, style } = this.props;
    const updatedStyle = displayInline
      ? { ...style, display: "inline-block" }
      : style;

    return (
      <div
        data-sk-name="sked-infowindow-trigger"
        {...dataAttributes}
        ref={this.setTriggerRef}
        onClick={this.onTriggerClick}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        className={`sked-infowindow__trigger ${className || ""}`}
        style={updatedStyle}
      >
        {React.Children.only(this.props.children)}
      </div>
    );
  }
}
