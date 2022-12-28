import * as React from "react";

import { notTargetAreas } from "../popups/info-window/info-window-utils";
import { PopOutBase, IPopOutBase } from "./PopOutBase";

export interface IPopOutProps {
  /**
   * The element you are rendering the content from
   */
  trigger: (isOpen?: IPopOutState["isOpen"]) => IPopOutBase["trigger"];
  /**
   * The content to pop out
   */
  children: (
    hideDropdown: PopOut["hideDropdown"]
  ) => JSX.Element | React.ReactNode;
  /**
   * The position where the content will try to fit
   */
  placement?: IPopOutBase["placement"];
  /**
   * Defaults to false
   */
  closeOnFirstClick?: boolean;
  /**
   * Defaults to false
   * If you've set closeOnFirstClick to true, you don't need this
   */
  closeOnOuterClick?: boolean;
  /**
   * Close content on document scroll
   * Defaults to false
   */
  closeOnScroll?: boolean;
  /**
   * Override the default PopOut container which is a Portal
   */
  popOutContainer?: IPopOutBase["popOutContainer"];
  /**
   * Open the popout container on mount, ignoring any trigger.
   */
  openOnMount?: boolean;
  /**
   * When the popout hides, fire this callback.
   */
  onClose?: () => void;
}

export interface IPopOutState {
  isOpen: boolean;
}

interface IEventHandlerItem {
  register: boolean;
  type: string;
  method: EventListener;
  options?: EventListenerOptions;
}

/**
 * The PopOut component displays/hides it's children when either the supplied trigger is clicked or if the openOnMount prop is supplied.
 * It should now be used in preference of InfoWindow where possible.
 * Default placement is bottom-start
 *
 * @requires PopOutBase
 */
export class PopOut extends React.PureComponent<IPopOutProps, IPopOutState> {
  private _contentRef = React.createRef<HTMLElement>();

  private _triggerRef = React.createRef<HTMLDivElement>();

  static defaultProps = {
    usePortal: true,
  };

  constructor(props: IPopOutProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.openOnMount) {
      this.showDropdown();
      this.addOptionalListeners();
    }
  }

  componentWillUnmount() {
    /** This ensures proper cleanup in case hideDropdown is not invoked
     *  but the component is unmounted
     */
    this.removeOptionalListeners();
  }

  getEventHandlers: () => IEventHandlerItem[] = () => {
    return [
      {
        register:
          !!this.props.closeOnOuterClick || !!this.props.closeOnFirstClick,
        type: "click",
        method: this.handleDocumentClick,
        options: this.props.openOnMount ? { capture: true } : null,
      },
      {
        register: !!this.props.closeOnScroll,
        type: "scroll",
        method: this.hideDropdown,
        options: { capture: true },
      },
    ];
  };

  handleDocumentClick = (e: Event) => {
    if (
      this.state.isOpen &&
      this.props.closeOnFirstClick &&
      notTargetAreas([this._triggerRef.current], e as MouseEvent)
    ) {
      return this.hideDropdown();
    }

    if (
      this.state.isOpen &&
      this.props.closeOnOuterClick &&
      notTargetAreas([this._contentRef.current], e as MouseEvent)
    ) {
      return this.hideDropdown();
    }

    return undefined;
  };

  addOptionalListeners = () => {
    this.getEventHandlers().forEach((event) => {
      if (!event.register) {
        return;
      }
      document.addEventListener(event.type, event.method, event.options);
    });
  };

  removeOptionalListeners = () => {
    this.getEventHandlers().forEach((event) => {
      if (!event.register) {
        return;
      }

      document.removeEventListener(event.type, event.method, event.options);
    });
  };

  showDropdown = () => {
    this.setState({ isOpen: true });
  };

  hideDropdown = () => {
    this.setState({ isOpen: false });
    this.removeOptionalListeners();

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  triggerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // stop propagation here since we don't want this interaction to interfere with the document click handler we setup.
    e.stopPropagation();

    if (this.state.isOpen && !!this.props.closeOnFirstClick) {
      this.hideDropdown();
      return;
    }

    this.showDropdown();
    this.addOptionalListeners();
  };

  render() {
    const { placement, children, trigger, popOutContainer } = this.props;
    console.log()
    const { isOpen } = this.state;
    return (
      <PopOutBase
        popOutContainer={popOutContainer}
        placement={placement || "bottom-start"}
        trigger={
          <div ref={this._triggerRef} onClick={this.triggerClick}>
            {trigger(isOpen)}
          </div>
        }
        visible={isOpen}
      >
        <span ref={this._contentRef}>{children(this.hideDropdown)}</span>
      </PopOutBase>
    );
  }
}
