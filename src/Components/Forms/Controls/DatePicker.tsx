import * as React from 'react'
import { Button, Icon, Datepicker } from 'skedulo-ui'


import './DatePicker.scss'

interface CustomDatePickerInputProps {
  onClick?: () => void
  value?: string
  disabled?: boolean
}

const CustomDatePickerInput: React.RefForwardingComponent<HTMLButtonElement, CustomDatePickerInputProps> = React.forwardRef<HTMLButtonElement, CustomDatePickerInputProps>(({ onClick, value, disabled = false }, ref) => {
  return (
    <Button
      buttonType="secondary"
      onClick={ onClick }
      className="sk-w-full"
      disabled={ disabled }
      ref={ ref }
    >
      <div className="sk-flex sk-justify-between">
        { value || '--/--/----' }
        <Icon name="calendar" className="sk-ml-2" size={ 18 } />
      </div>
    </Button>
  )
})

interface DatePickerProps {
  selected: Date
  onChange: (date: Date) => void
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export const DatePicker: React.FC<DatePickerProps> = ({ selected, onChange, disabled = false, minDate, maxDate }) => {
  return (
    <Datepicker
      className="sk-w-full"
      dateFormat="dd/MM/yyyy"
      selected={ selected }
      onChange={ onChange }
      customInput={ <CustomDatePickerInput /> }
      disabled={ disabled }
      minDate={ minDate }
      maxDate={ maxDate }
    />
  )
}
