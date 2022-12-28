import * as React from 'react'
import classnames from 'classnames'

interface IProps {
  /**
   * className applied to the containing div
   */
  className?: string
  /**
   * Alignment of the component
   */
  align?: 'left' | 'center' | 'right'
}
/**
 * Loading indicator for lists
 */

export const Loading: React.FunctionComponent<IProps> = ({ className, align = 'center' }) => {
  const alignment = {
    left: 'sk-text-left',
    center: 'sk-text-center',
    right: 'sk-text-right'
  }

  return (
    <div className={ classnames('loading-throb', className, alignment[align]) }>
      <div className="loading-throb__bounce loading-throb__bounce--first" />
      <div className="loading-throb__bounce loading-throb__bounce--second" />
      <div className="loading-throb__bounce loading-throb__bounce--third" />
    </div>
  )
}
