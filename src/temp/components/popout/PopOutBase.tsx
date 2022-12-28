import * as React from 'react'
import * as PopperJS from '@popperjs/core'
import { Manager, Popper, Reference, StrictModifier } from 'react-popper'
import { Portal } from '../portal/Portal'

export interface IPopOutBase {
  /**
   * The element you are rendering the content from
   */
  trigger: JSX.Element
  visible?: boolean
  placement?: PopperJS.Options['placement']
  modifiers?: PopperJS.Options['modifiers']
  popOutContainer?: (PopperWrappedContent: JSX.Element) => JSX.Element
  children?: React.ReactNode
}

const DEFAULT_MODIFIERS: StrictModifier[] = [
  {
    name: 'flip',
    enabled: true
  },
  {
    name: 'preventOverflow',
    enabled: true
  }
]

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
    popOutContainer: portalContainer = (content: JSX.Element) => <Portal>{content}</Portal>,
    children,
    placement,
    modifiers = DEFAULT_MODIFIERS
  }) => {
    const PopperWithContent = (
      <Popper placement={placement} modifiers={modifiers} strategy="fixed">
        {({ placement: localPlacement, style, ref }) => {
          return (
            <div style={style} ref={ref} data-placement={localPlacement}>
              {children}
            </div>
          )
        }}
      </Popper>
    )

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref} data-sk-name="sked-popout">
              {trigger}
            </div>
          )}
        </Reference>
        {visible && portalContainer(PopperWithContent)}
      </Manager>
    )
  }
)
