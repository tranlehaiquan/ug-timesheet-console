import * as React from 'react'
import classNames from 'classnames'

interface ILoadingSpinnerProps {
  /**
  * Additional class names
  */
  className?: string,
  /**
  * The size of the loader. If no prop is passed the default size is 24px.
  */
  size?: number,
  /**
  * The color of the loader. If no prop is passed, it uses the color of parent container.
  */
  color?: string,
}

/**
* Loading Spinner inherits the color used in the parent element.
* It accepts a size prop which defines the size of the spinner in px.
*/
export const LoadingSpinner: React.SFC<ILoadingSpinnerProps> = ({ size = 24, color = 'currentColor', className }) => (
  <div className={ classNames('loading-spinner', { [className]: className }) }>
    <svg className="loading-spinner--circular" viewBox="25 25 50 50" width={ size } height={ size }>
      <circle
        className="loading-spinner--path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke={ color }
        strokeWidth="5"
        strokeMiterlimit="10"
      />
    </svg>
  </div>
)
