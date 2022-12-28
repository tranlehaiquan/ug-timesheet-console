import * as React from "react";
import last from "lodash/last";
import first from "lodash/first";
import { format } from "date-fns";

import { Button } from "../buttons/button/Button";
import { ButtonDropdown } from "../buttons/button-dropdown/ButtonDropdown";
import { Icon } from "../icon/Icon";
import { Datepicker } from "../datepicker/Datepicker";
import { Menu, MenuItem } from "../menu/Menu";

type SelectDateHandler = (date: Date) => void;
type DateDirection = "forward" | "backward";

interface ITodayButtonProps {
  onDateSelect?: SelectDateHandler;
}

interface IDateSelectorProps {
  onDateSelect?: SelectDateHandler;
  selected?: Date;
  selectedRange?: RangeType;
}

interface INavigationButtonProps {
  selectedRange?: RangeType;
  onDateSelect?: SelectDateHandler;
  selected?: Date;
}

interface IRangeProps {
  selectedRange?: RangeType;
  onRangeChange?: (range: RangeType) => void;
  rangeOptions?: RangeType[];
  selected?: Date;
}

export type RangeType = "day" | "3-days" | "week" | "2-weeks" | "month";

export interface IProps {
  selected: Date;
  onRangeChange?: (range: RangeType) => void;
  onDateSelect?: SelectDateHandler;
  onNavigateNext?: () => void;
  onNavigateBack?: () => void;

  selectedRange?: RangeType;
  rangeOptions?: RangeType[];

  showTodayButton?: boolean;
  showRangePicker?: boolean;
}

const rangeOptionDescription = {
  day: "Day",
  week: "Week",
  month: "Month",
  "2-weeks": "Two weeks",
  "3-days": "Three days",
};

const moveDate = (date: Date, days: RangeType, direction: DateDirection) => {
  const d = new Date(date);
  const incOrDec = direction === "forward" ? 1 : -1;

  switch (days) {
    case "day":
      d.setDate(d.getDate() + incOrDec);
      break;
    case "3-days":
      d.setDate(d.getDate() + 3 * incOrDec);
      break;
    case "week":
      d.setDate(d.getDate() + 7 * incOrDec);
      break;
    case "2-weeks":
      d.setDate(d.getDate() + 14 * incOrDec);
      break;
    case "month":
      d.setMonth(d.getMonth() + 1 * incOrDec);
      break;
  }

  return d;
};

const createDatesRange = (startDate: Date, endDate: Date) => {
  const dates = [];
  let tempDate = new Date(startDate);
  while (endDate.getTime() !== tempDate.getTime()) {
    dates.push(tempDate);
    tempDate = moveDate(tempDate, "day", "forward");
  }
  dates.push(new Date(endDate));
  return dates;
};

const formatLongDate = (date: Date) => format(date, "MMM dd, yyyy");
const formatShortDate = (date: Date) => format(date, "MMM dd");

const TodayButton: React.FC<ITodayButtonProps> = ({ onDateSelect }) => {
  const todayHandler = () => onDateSelect(new Date());
  return (
    <Button buttonType="secondary" onClick={todayHandler}>
      Today
    </Button>
  );
};

const NavigationButtons: React.FC<INavigationButtonProps> = ({
  onDateSelect,
  selected,
  selectedRange,
}) => {
  const backwardsHandler = () =>
    onDateSelect(moveDate(selected, selectedRange, "backward"));
  const forwardsHandler = () =>
    onDateSelect(moveDate(selected, selectedRange, "forward"));

  return (
    <React.Fragment>
      <Button
        className="sked-calendar-controls__navigate-backwards"
        data-sk-name="navigate-backwards"
        buttonType="transparent"
        onClick={backwardsHandler}
      >
        <Icon name="calendarNavLeft" className="sk-h-3" />
      </Button>
      <Button
        className="sked-calendar-controls__navigate-forwards"
        data-sk-name="navigate-forwards"
        buttonType="transparent"
        onClick={forwardsHandler}
      >
        <Icon name="calendarNavRight" className="sk-h-3" />
      </Button>
    </React.Fragment>
  );
};

const DateSelector: React.FC<IDateSelectorProps> = ({
  onDateSelect,
  selectedRange = "day",
  selected,
}) => {
  const dates = [
    selected,
    moveDate(moveDate(selected, selectedRange, "forward"), "day", "backward"),
  ];
  const startDate = first(dates);
  const endDate = last(dates);

  const formattedStartDate =
    startDate.getFullYear() === endDate.getFullYear()
      ? formatShortDate(startDate)
      : formatLongDate(startDate);
  const formattedEndDate = formatLongDate(endDate);
  const formattedDate =
    selectedRange === "day"
      ? formatLongDate(selected)
      : `${formattedStartDate} - ${formattedEndDate}`;

  // Need to use the `any` type here as react datepicker will work with our node and then provide the props
  const DateRangeDisplay: React.FC<any> = React.forwardRef(
    ({ onClick }, _ref) => (
      <Button
        className="sked-calendar-controls__date-range-display"
        buttonType="transparent"
        onClick={onClick}
        data-sk-name="date-range-display"
      >
        {formattedDate}
        <Icon name="chevronDown" className="sk-ml-2" size={8} />
      </Button>
    )
  );

  return (
    <Datepicker
      customInput={<DateRangeDisplay />}
      selected={selected}
      onChange={onDateSelect}
      highlightDates={createDatesRange(dates[0], dates[1])}
    />
  );
};

const RangePicker: React.FC<IRangeProps> = ({
  selectedRange = "day",
  onRangeChange,
  rangeOptions = ["day", "3-days", "week"],
}) => {
  const rangeChangeHandler = (option: RangeType) => () => onRangeChange(option);

  return (
    <ButtonDropdown
      label={rangeOptionDescription[selectedRange]}
      data-sk-name="date-range-picker"
    >
      <Menu>
        {rangeOptions.map((option) => (
          <MenuItem key={option} onClick={rangeChangeHandler(option)}>
            {rangeOptionDescription[option]}
          </MenuItem>
        ))}
      </Menu>
    </ButtonDropdown>
  );
};

export const CalendarControls = ({
  showTodayButton = true,
  showRangePicker = true,
  ...props
}: IProps) => {
  return (
    <div className="sked-calendar-controls">
      {showTodayButton && (
        <TodayButton
          data-sk-name="today-button"
          onDateSelect={props.onDateSelect}
        />
      )}
      <NavigationButtons
        data-sk-name="navigation-buttons"
        selected={props.selected}
        onDateSelect={props.onDateSelect}
        selectedRange={props.selectedRange}
      />
      <DateSelector
        data-sk-name="date-selector"
        selected={props.selected}
        onDateSelect={props.onDateSelect}
        selectedRange={props.selectedRange}
      />
      {showRangePicker && (
        <RangePicker
          data-sk-name="range-picker"
          selectedRange={props.selectedRange}
          onRangeChange={props.onRangeChange}
          rangeOptions={props.rangeOptions}
        />
      )}
    </div>
  );
};
