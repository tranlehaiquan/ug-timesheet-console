import React, { useEffect, useState } from "react";
import { IDate } from "..";
import { DatePicker } from "../../Controls/DatePicker";
import {
  parseLocalDateToZonedDate,
  parseZonedDateToLocalDate,
} from "../../Utils/date";
import { Label } from "../../Utils/Label";

interface IProps {
  defaultValue: IDate;
  timeZone: string;
  onChange: (date: IDate) => void;
}

const StartEndDateInput = ({
  defaultValue = { start: "", end: "" },
  timeZone,
  onChange,
}: IProps) => {
  const [fieldValue, setFieldValue] = useState<IDate>({
    start: "",
    end: "",
  });

  const handleDateChange = (type: "start" | "end") => (value: Date) => {
    const valueISO = value
      ? parseZonedDateToLocalDate(value, timeZone).toISOString()
      : null;
    setFieldValue((preState) => {
      return {
        ...preState,
        [type]: valueISO,
      };
    });

    if (type === "start") {
      onChange({ start: valueISO, end: fieldValue.end });
    }
    if (type === "end") {
      onChange({ start: fieldValue.start, end: valueISO });
    }
  };

  useEffect(() => {
    const { start, end } = defaultValue;
    setFieldValue({ start, end });
  }, [defaultValue.start, defaultValue.end]);

  return (
    <>
      <div className="sk-mb-8">
        <Label text="Start Date" />
        <DatePicker
          selected={
            fieldValue.start
              ? parseLocalDateToZonedDate(fieldValue.start, timeZone)
              : null
          }
          onChange={handleDateChange("start")}
        />
      </div>
      <div className="sk-mb-6">
        <Label text="End Date" />
        <DatePicker
          selected={
            fieldValue.end
              ? parseLocalDateToZonedDate(fieldValue.end, timeZone)
              : null
          }
          onChange={handleDateChange("end")}
        />
      </div>
    </>
  );
};

export default React.memo(StartEndDateInput);
