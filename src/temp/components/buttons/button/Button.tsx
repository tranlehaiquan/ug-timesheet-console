import * as React from 'react'
import classNames from 'classnames'

import { LoadingSpinner } from '../../loader/spinner/LoadingSpinner'

export type ButtonTypes = 'primary' | 'secondary' | 'transparent'

type IButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement> & {
  /**
  * The type of button to be displayed. Primary | Secondary | Transparent
  */
  buttonType: ButtonTypes,
  /**
  * Pass additional class names
  */
  className?: string,
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
}

/**
* Button component
*/
export const Button: React.RefForwardingComponent<HTMLButtonElement, IButtonProps> = React.forwardRef<HTMLButtonElement, IButtonProps>(({ buttonType, compact, loading, children, className, ...otherProps }, ref) => {

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
    className
  )

  return (
    <button { ...otherProps }  className={ classes } ref={ ref }>
      <div className={ loading ? 'sk-invisible' : 'sk-visible' }>
        { children }
      </div>
      <div className="sk-pin sk-absolute sk-m-auto sk-flex sk-justify-center sk-items-center">
        <LoadingSpinner className={ loading ? 'sk-visible' : 'sk-invisible' } size={ 18 } />
      </div>
    </button>
  )
})
