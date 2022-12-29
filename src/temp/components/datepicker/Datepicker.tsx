import * as React from "react";
import DatePickerLocal, { ReactDatePickerProps } from "react-datepicker";
import noop from "lodash/noop";
import range from "lodash/range";

import { FormElementWrapper, FormInputElement } from "../forms/FormElements";

import en from "date-fns/locale/en-GB";

export interface CustomInput extends React.PureComponent {
  value: Date;
  onClick: React.MouseEventHandler;
}

type ReactDatePickerPropsSubset = Partial<Pick<
ReactDatePickerProps,
"showTimeSelect" | "showTimeSelectOnly"
>>;

export interface IDatepickerProps extends ReactDatePickerPropsSubset {
  /**
   * The currently selected date.
   */
  selected: Date | null;
  /**
   * The action to take when the date changes
   */
  onChange: (value: Date) => void;

  /**
   * The date to open the calendar to
   */
  openToDate?: Date;
  /**
   * The locale to display the date in
   */
  locale?: string;
  /**
   * Should the calendar be displayed in the expanded state
   */
  inline?: boolean;
  /**
   *
   */
  fixedHeight?: boolean;
  /**
   * Disable updating the date picker
   */
  disabled?: boolean;
  /**
   * Provide placeholder text for the input
   */
  placeholderText?: string;
  /**
   * The format of the date to display
   */
  dateFormat?: string;
  /**
   * Any additional styling to add to the datepicker
   */
  className?: string;
  /**
   * An Array of Date that will be highlighted
   */
  highlightDates?: Date[];
  /**
   * A component that will override the default Input
   */
  customInput?: React.ReactNode;

  /**
   * Select the week Sunday to Saturday based on the current selected date
   */
  selectWeek?: boolean;
  /**
   * The callback that will receive the dates for the week selected
   */
  onWeekSelect?: (value: Date[]) => void;
  /**
   * Highlight the week which contains the highlightWeek Date
   */
  highlightWeek?: Date;
  /**
   * The earliest date user can select
   */
  minDate?: Date;
  /**
   * The latest date user can select
   */
  maxDate?: Date;
}

const weekDates: (date: Date) => Date[] = (date: Date) => {
  if (!date) {
    return [];
  }

  const currentDay = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - currentDay);

  return range(7).map((i) => {
    const day = new Date(sunday);
    day.setDate(day.getDate() + i);
    return day;
  });
};

const DefaultInput = React.forwardRef(
  (
    {
      onChange,
      onClick,
      disabled,
      placeholder,
      value,
    }: React.InputHTMLAttributes<HTMLInputElement | SVGElement>,
    ref
  ) => (
    <FormElementWrapper size="small">
      <FormInputElement
        value={value}
        onClick={onClick}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        type="input"
        inputRef={ref as React.Ref<HTMLInputElement>}
      />
    </FormElementWrapper>
  )
);

const selectDates =
  (
    onChange: (date: Date) => void,
    onWeekSelect: (dates: Date[]) => void,
    selectWeek: boolean
  ) =>
  (date: Date) => {
    if (selectWeek || onWeekSelect) {
      onWeekSelect(weekDates(date));
    }

    onChange(date);
  };

interface HighlightDates {
  [className: string]: Date[];
}

export const Datepicker: React.FC<IDatepickerProps> = ({
  onChange = noop,
  onWeekSelect = noop,
  highlightWeek,
  selected,
  selectWeek = false,
  customInput,
  highlightDates = [],
  ...pickerProps
}) => {
  const selectedWeekDates = selectWeek ? weekDates(selected) : [];
  const highlightedWeekDates = highlightWeek ? weekDates(highlightWeek) : [];
  const highlightedDates = [
    {
      "react-datepicker__day--week-selected": selectedWeekDates,
    } as HighlightDates,
    {
      "react-datepicker__day--week-hovered": highlightedWeekDates,
    } as HighlightDates,
    ...highlightDates,
  ];
  const onDateSelect = selectDates(onChange, onWeekSelect, selectWeek);

  return (
    <DatePickerLocal
      locale={en as any}
      selected={selected}
      onChange={onDateSelect}
      nextMonthButtonLabel=""
      previousMonthButtonLabel=""
      customInput={customInput || <DefaultInput />}
      highlightDates={highlightedDates}
      {...pickerProps}
    />
  );
};
