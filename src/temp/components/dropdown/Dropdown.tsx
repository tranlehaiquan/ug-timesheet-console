import { Placement } from "@popperjs/core";
import * as React from "react";
import { Manager, Popper, Reference } from "react-popper";

interface IProps {
  /**
   * The element you are rendering the drop down from
   */
  trigger: JSX.Element | React.ReactNode;
  children: React.ReactNode;
  visible?: boolean;
  placement?: Placement;
  modifiers?: any;
}

const defaultModifiers = {
  flip: { enabled: true },
  shift: { enabled: true },
  preventOverflow: { enabled: true },
};

export const Dropdown: React.FC<IProps> = ({
  trigger,
  visible,
  children,
  placement,
  modifiers = defaultModifiers,
}) => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <div ref={ref} data-sk-name="dropdown-reference">
          {trigger}
        </div>
      )}
    </Reference>
    {visible && (
      <Popper placement={placement} modifiers={modifiers}>
        {({ style, ref }) => (
          <div className="sk-z-10" style={style} ref={ref}>
            {children}
          </div>
        )}
      </Popper>
    )}
  </Manager>
);
