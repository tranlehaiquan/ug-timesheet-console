import React from "react";
import { useSelector } from "react-redux";

import { Icon } from "skedulo-ui";

import "./Summary.scss";

import { selectSummary } from "../../StoreV2/slices/summarySlice";
import {
  breakHoursToHoursAndMinutes,
  breakMilisecondsToHoursAndMinutes,
} from "../../common/utils/dateTimeHelpers";
import {
  metersToKilometers,
  metersToMiles,
} from "../../common/utils/distanceUnits";
import { RootState } from "../../StoreV2/store";
import ReduxDataTypes from "../../StoreV2/DataTypes";
import classNames from "classnames";

const distanceUnitLabels = {
  MI: "Mi",
  KM: "km",
};

const renderTimeValue = (time: { hours: number; minutes: number }) => {
  return (
    <>
      {time.hours ? (
        <>
          <span className="summary__number">{time.hours}</span>
          <span className="summary__unit sk-mr-1">h</span>
        </>
      ) : null}
      {time.minutes || !time.hours ? (
        <>
          <span className="summary__number">{time.minutes}</span>
          <span className="summary__unit">min</span>
        </>
      ) : null}
    </>
  );
};

const renderDistance = (
  distance: number,
  distanceUnit: ReduxDataTypes.DistanceUnit
) => {
  const convertedDistance =
    distanceUnit === "MI"
      ? metersToMiles(distance)
      : metersToKilometers(distance);
  const formattedDistance = Math.floor(convertedDistance * 100) / 100;
  return (
    <>
      <span className="summary__number">{formattedDistance}</span>
      <span className="summary__unit">{distanceUnitLabels[distanceUnit!]}</span>
    </>
  );
};

export const Summary: React.FC<{ className?: string }> = ({ className }) => {
  const { summary } = useSelector((state: RootState) => selectSummary(state));
  const distanceUnit = useSelector(
    (state: RootState) => state.setting.distanceUnit
  );
  const unavailabilityTime = breakHoursToHoursAndMinutes(
    summary.unavailability
  );
  // convert Time in Minute to milliseconds
  const loggedTime = breakMilisecondsToHoursAndMinutes(summary.logged * 60000);

  return (
    <div className={classNames("summary", className)}>
      <span className="summary__label summary__label--1">
        <span className="summary__icon">
          <Icon name="jobs" size={18} />
        </span>
        <span>Total jobs in period</span>
      </span>
      <span className="summary__number summary__value--1">{summary.jobs}</span>
      <span className="summary__label summary__label--2">
        <span className="summary__icon">
          <Icon name="activity" size={18} />
        </span>
        <span>Total Time Logged</span>
      </span>
      <span className="summary__value--2">{renderTimeValue(loggedTime)}</span>
      <span className="summary__label summary__label--3">
        <span className="summary__icon">
          <Icon name="map" size={18} />
        </span>
        <span>distance traveled</span>
      </span>
      <span className="summary__value--3">
        {renderDistance(summary.distance, distanceUnit)}
      </span>
      <span className="summary__label summary__label--4">
        <span className="summary__icon">
          <Icon name="availability" size={18} />
        </span>
        <span>unavailable</span>
      </span>
      <span className="summary__value--4">
        {renderTimeValue(unavailabilityTime)}
      </span>
    </div>
  );
};

export default React.memo(Summary);
