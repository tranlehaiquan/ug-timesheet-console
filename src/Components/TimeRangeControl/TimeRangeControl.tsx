import * as React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { CalendarControls, RangeType } from "skedulo-ui";
// import { ReduxDataTypes } from '../../StoreV2/DataTypes'

import "./TimeRangeControl.scss";
import {
  setDateRange,
  setDateRangeType,
} from "../../StoreV2/slices/filterSlice";
import { RootState } from "../../StoreV2/store";

const rangeOptions: RangeType[] = ["week", "2-weeks", "month"];

const getRangeEndDate = (startDate: Date, range: string) => {
  const endDate = new Date(startDate);

  switch (range) {
    case "week":
      endDate.setDate(endDate.getDate() + 6);
      break;
    case "2-weeks":
      endDate.setDate(endDate.getDate() + 13);
      break;
    case "month":
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      break;
    default:
  }

  endDate.setUTCHours(23);
  endDate.setUTCMinutes(59);
  endDate.setUTCSeconds(59);

  return endDate;
};

export const TimeRangeControl: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDateISO = useSelector(
    (state: RootState) => state.filter.dateRange.startDate
  );
  const selectedDate = moment(selectedDateISO, "YYYY-MM-DD").toDate();
  const selectedRange = useSelector(
    (state: RootState) => state.filter.dateRangeType
  );

  const onDateSelect = (date: Date) => {
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    );
    dispatch(
      setDateRange({
        startDate,
        endDate: getRangeEndDate(startDate, selectedRange),
      })
    );
  };

  const onRangeSelect = (range: RangeType) => {
    dispatch(setDateRangeType(range));
    dispatch(
      setDateRange({
        startDate: selectedDate,
        endDate: getRangeEndDate(selectedDate, range),
      })
    );
  };

  return (
    <div className="time-range-control__container">
      <CalendarControls
        showTodayButton={false}
        selected={selectedDate}
        onDateSelect={onDateSelect}
        selectedRange={selectedRange}
        onRangeChange={onRangeSelect}
        rangeOptions={rangeOptions}
      />
    </div>
  );
};
