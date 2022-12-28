import * as React from 'react'
import './MultiSelect.scss'
// @ts-ignore
import Select from 'react-select'

interface OptionItem {
  label: string
  value: string
}

interface MultiSelectProps {
  isDisabled: boolean
  onChange: (options: OptionItem[]) => void
  options: OptionItem[]
  value: OptionItem[]
  name?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  isDisabled,
  options,
  value,
  onChange,
  name
}) => {
  return (
    <Select
      isMulti
      isDisabled={ isDisabled }
      name={ name }
      options={ options }
      className="basic-multi-select"
      classNamePrefix="select"
      value={ value }
      onChange={ onChange }
    />
  )
}
