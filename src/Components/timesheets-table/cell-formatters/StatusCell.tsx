import * as React from 'react'
import classnames from 'classnames'
import { TimesheetStatus } from '../TimesheetsTable'

export interface IStatusCell {
  type: TimesheetStatus
  className?: string
}

interface StatusStyle {
  className: string
  style: React.CSSProperties
}

// TODO: Replace styles with tilewind classes
const statusStyles: {
  [index: string]: StatusStyle
} = {
  draft: { className: 'sk-bg-orange-lighter', style: { backgroundColor: 'rgba(239, 149, 74, 0.12)', color: '#ef954a' } },
  submitted: { className: 'sk-bg-yellow-lightest sk-text-yellow', style: { backgroundColor: 'rgba(0, 126, 230, 0.12)', color: '#007ee6' } },
  approved: { className: 'sk-bg-green-lightest', style: { color: '#59b66e' } },
  rejected: { className: 'sk-bg-red-lightest sk-text-red', style: {} }
}

export const StatusCell: React.FC<IStatusCell> = props => {
  const baseClassName = 'sk-leading-tight sk-text-xxs sk-px-4 sk-py-2 sk-rounded-medium sk-truncate sk-max-w-full sk-inline-block'
  const statusStyle = statusStyles[props.type.toLowerCase()]
  return (
    <div
      className={ classnames(baseClassName, statusStyle.className, props.className) }
      style={ { ...statusStyle.style } }
    >
      <span className="sk-flex sk-items-center sk-h-full">
        { props.type }
      </span>
    </div>
  )
}
