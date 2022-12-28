import React, { useEffect, useState } from "react";
import { ITime } from "..";
import { TimePickerInput } from "../../Controls/TimePickerInput";
import { parseLocalDateToZonedDate } from "../../Utils/date";
import { Label } from "../../Utils/Label";

interface IProps {
  start: string;
  end: string;
  timeZone: string;
  onChange: (time: ITime) => void;
}

const StartEndTimeInput = ({ start, end, timeZone, onChange }: IProps) => {
  const [fieldValue, setFieldValue] = useState<{ start: Date; end: Date }>({
    start: null,
    end: null,
  });

  const handleTimeChange = (type: "start" | "end") => (value: Date) => {
    setFieldValue((preState) => {
      return {
        ...preState,
        [type]: value,
      };
    });
  };

  useEffect(() => {
    if (start && end) {
      setFieldValue({
        start: parseLocalDateToZonedDate(start, timeZone),
        end: parseLocalDateToZonedDate(end, timeZone),
      });
    }
  }, [start, end]);

  const handleSaveDataToForm = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (fieldValue.start && fieldValue.end) {
      const { start, end } = fieldValue;
      onChange({
        start: { hour: start.getHours(), minute: start.getMinutes() },
        end: { hour: end.getHours(), minute: end.getMinutes() },
      });
    }
  };

  return (
    <>
      <div className="sk-mb-6 sk-flex">
        <div className="sk-w-1/2 sk-mr-3">
          <Label text="Start Time" />
          <TimePickerInput
            selected={fieldValue.start}
            onChange={handleTimeChange("start")}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            disabled={!fieldValue.start}
            onBlur={handleSaveDataToForm}
          />
        </div>
        <div className="sk-w-1/2 sk-ml-3">
          <Label text="End Time" />
          <TimePickerInput
            selected={fieldValue.end}
            onChange={handleTimeChange("end")}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            disabled={!fieldValue.end}
            onBlur={handleSaveDataToForm}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(StartEndTimeInput);
