import * as React from 'react'
import classNames from 'classnames'

import { LoadingSpinner } from '../../loader/spinner/LoadingSpinner'
import { IconNames, Icon } from '../../icon/Icon'

export type ButtonTypes = 'primary' | 'secondary' | 'transparent'

export type IButtonProps = {
  /**
   * The type of button to be displayed. Primary | Secondary | Transparent
   */
  buttonType: ButtonTypes
  icon?: IconNames
  /**
   * Pass additional class names
   */
  className?: string
  /**
   * Disable the button
   */
  disabled?: boolean
  /**
   * Compact sized button—used when space is tight - allowing more room for content.
   */
  compact?: boolean
  /**
   * Loading button state
   */
  loading?: boolean
  /**
   * Button is active
   */
  active?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Button component
 */
export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ buttonType, compact, loading, active, icon, children, className, ...otherProps }, ref) => {
    const buttonClassMap: { [key in ButtonTypes]: string } = {
      primary: 'sked-button--primary',
      secondary: 'sked-button--secondary',
      transparent: 'sked-button--transparent'
    }

    const classes = classNames(
      'sked-button',
      buttonClassMap[buttonType],
      {
        'sked-button--compact': compact,
        'sk-pointer-events-none': loading
      },
      {
        'sked-button--active': active
      },
      className
    )

    return (
      <button ref={ref} type="button" {...otherProps} className={classes}>
        <div
          className={classNames({
            'sk-invisible': loading,
            'sk-visible': !loading
          })}
        >
          <div className={classNames('sk-flex sk-items-center')}>
            {icon && <Icon name={icon} className="sked-button__icon" />}
            {children}
          </div>
        </div>
        <div className="sk-inset-0 sk-absolute sk-m-auto sk-flex sk-justify-center sk-items-center">
          <LoadingSpinner className={loading ? '' : 'sk-hidden'} size={18} />
        </div>
      </button>
    )
  }
)
