import moment from "moment";
import momentTz from "moment-timezone";
import React from "react";
import { FormInputElement } from "skedulo-ui";
import { minutesToDuration } from "src/common/utils/dateTimeHelpers";
import { IDate, ITime } from "..";
import { Label } from "../../Utils/Label";

interface IProps {
  date: IDate;
  time: ITime;
  timeZone: string;
}

const DurationInput = ({ date, time, timeZone }: IProps) => {
  const startDateYYYYMMDD = momentTz
    .tz(date.start, timeZone)
    .format("YYYY-MM-DD");
  const endDateYYYYMMDD = momentTz.tz(date.end, timeZone).format("YYYY-MM-DD");
  const start = moment(
    `${startDateYYYYMMDD} ${time.start.hour}:${time.start.minute}`
  );
  const end = moment(`${endDateYYYYMMDD} ${time.end.hour}:${time.end.minute}`);

  const duration = end.diff(start, "minutes");

  return (
    <div className="sk-w-1/2 sk-mr-3">
      <Label text="Duration" />
      <FormInputElement disabled value={minutesToDuration(duration) || ""} />
    </div>
  );
};

export default React.memo(DurationInput);
