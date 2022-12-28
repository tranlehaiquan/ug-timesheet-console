import * as React from "react";
import { Manager, Popper, Reference, PopperProps } from "react-popper";

export interface IPopOutBase {
  /**
   * The element you are rendering the content from
   */
  trigger: JSX.Element | React.ReactNode;
  children: React.ReactNode;
  visible?: boolean;
  placement?: NonNullable<PopperProps["placement"]>;
  modifiers?: NonNullable<PopperProps["modifiers"]>;
}

const defaultModifiers = {
  flip: { enabled: true },
  shift: { enabled: true },
  preventOverflow: { enabled: true },
};

/**
 * PopOutBase uses react-popper/popperjs under the hood and is a wrapper that sets up the Popperjs Manager, Reference and Popper.
 * It will place any content next to the trigger based on whether it fits and what placement you specify.
 * If you need click show/hide functionality, use @PopOut
 *
 * @requires react-popper
 */
export const PopOutBase: React.FC<IPopOutBase> = React.memo(
  ({
    trigger,
    visible = true,
    children,
    placement,
    modifiers = defaultModifiers,
  }) => {
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref} data-sk-name="sked-popout">
              {trigger}
            </div>
          )}
        </Reference>
        {visible && (
          <Popper placement={placement} modifiers={modifiers}>
            {({ style, ref }) => (
              <div style={style} ref={ref} className="sk-z-20 sk-w-full">
                {children}
              </div>
            )}
          </Popper>
        )}
      </Manager>
    );
  }
);
