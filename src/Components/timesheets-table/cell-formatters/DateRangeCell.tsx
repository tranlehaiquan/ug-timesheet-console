import * as React from "react";
import { format } from "date-fns";
import moment from "moment";

export const DateRangeCell = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const startDateLabel = startDate
    ? format(moment(startDate, "YYYY-MM-DD").toDate(), "dd MMM")
    : "-- --";
  const endDateLabel = endDate
    ? format(moment(endDate, "YYYY-MM-DD").toDate(), "dd MMM")
    : "-- -- ----";
  return <span>{`${startDateLabel} - ${endDateLabel}`}</span>;
};
