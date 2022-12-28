import * as React from "react";
import DatePickerLocal from "react-datepicker";
import { Icon } from "skedulo-ui";
import "./TimePicker.css";

interface TimePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled: boolean;
  dateFormat: string;
  timeFormat: string;
}

const DATE_TIME_FORMAT = "h:mm a";

export const TimePickerInput: React.FC<TimePickerProps> = ({
  selected = null,
  onChange,
  onBlur,
  disabled = false,
  dateFormat = DATE_TIME_FORMAT,
  timeFormat = DATE_TIME_FORMAT,
}) => {
  return (
    <div className="sk-w-full sk-relative">
      <DatePickerLocal
        className="sk-w-full sked-input-textbox sked-form-element__outline"
        dateFormat={dateFormat}
        selected={selected}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        showTimeSelect
        showTimeSelectOnly
        timeFormat={timeFormat}
        placeholderText="--:--"
        timeIntervals={15}
      />
      <Icon
        name="time"
        className="sk-ml-2 sk-absolute sk-pin-r sk-pin-t sk-mr-4 sk-mt-2"
        size={18}
      />
    </div>
  );
};
