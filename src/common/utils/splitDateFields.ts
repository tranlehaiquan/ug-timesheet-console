import moment from "moment";
import ReduxDataTypes from "../../Store/DataTypes";

export const splitDateFields = (entry: ReduxDataTypes.TimesheetEntry) => {
  const { StartDate: start, EndDate: end } = entry;
  const StartDate = moment(start).format("YYYY-MM-DD");
  const StartTime = moment(start).format("HH:mm");
  const EndDate = moment(end).format("YYYY-MM-DD");
  const EndTime = moment(end).format("HH:mm");
  const newEntry = { ...entry };
  return {
    ...newEntry,
    StartDate,
    StartTime,
    EndDate,
    EndTime,
  };
};
