import * as React from "react";
import { format } from "date-fns";
import { range } from "lodash";

import "./Calendar.scss";

const hours = range(0, 24).map((hour) => new Date(0, 0, 0, hour));

export const TimeRange: React.FC = () => {
  return (
    <>
      {hours.map((hour, index) => (
        <div
          key={index}
          className="calendar--time_range_item"
          style={{
            gridColumnStart: 1,
            gridRowStart: index + 1,
          }}
        >
          <span className="calendar--time_range_label">
            {format(hour, "ha").toLowerCase()}
          </span>
        </div>
      ))}
    </>
  );
};
