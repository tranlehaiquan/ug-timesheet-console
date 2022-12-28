import * as React from 'react'

const unifyUnit = (unit?: string | null) => {
  if (unit === null || unit === undefined) {
    return unit
  }

  switch (unit.toLowerCase()) {
    case 'km':
    case 'kilometers':
      return 'km'
    case 'miles':
    case 'mi':
      return 'mi'
    default:
      return unit
  }
}

interface Props {
  value?: number | string | null
  unit?: string | null
  bold?: boolean
}

export const NumberCell: React.FC<Props> = ({ value, unit = '', bold = false }) => {
  return (
    <span
      style={ {
        fontWeight: bold ? 700 : 400
      } }
    >
      { value !== null && value !== undefined ? `${value} ${unifyUnit(unit)}` : '-' }
    </span>
  )
}
