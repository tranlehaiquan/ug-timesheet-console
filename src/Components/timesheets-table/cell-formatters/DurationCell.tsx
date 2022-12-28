import React from 'react'
import classnames from 'classnames'

import { hoursToDuration, minutesToDuration } from '../../../common/utils/dateTimeHelpers'

interface Props {
  value?: number
  bold?: boolean
  isInMinutes?: boolean
}

export const DurationCell: React.FC<Props> = ({ value, bold, isInMinutes }) => {
  const duration = isInMinutes ? minutesToDuration(value) : hoursToDuration(value)
  return (
    <span className={ classnames({ 'sk-font-semibold': bold }) }>
      { !(value === null || value === undefined) ? duration : '0' }
    </span>
  )
}
