import * as React from "react";
import { isWeekend } from "date-fns";
import classnames from "classnames";

import { CalendarEvent } from "./Calendar";
import { dayHours } from "./utils";
import { EventCard } from "./EventCard";

interface DayProps {
  columnId: number;
  day: Date;
  events: CalendarEvent[];
  cellHeight: number;
}

export const Day: React.FC<DayProps> = ({
  columnId,
  day,
  events,
  cellHeight,
}) => {
  const hours = dayHours(day);
  return (
    <>
      {hours.map((hour, index) => {
        return (
          <div
            key={index}
            className={classnames(
              "calendar__dayCell",
              isWeekend(day) ? "calendar__dayCell--weekend" : ""
            )}
            style={{
              gridColumnStart: columnId,
              gridColumnEnd: columnId + 1,
              gridRowStart: index + 1,
              gridRowEnd: index + 2,
            }}
          />
        );
      })}

      {events.map((event, index) => {
        return (
          <EventCard
            key={index}
            event={event}
            day={day}
            gridX={columnId}
            cellHeight={cellHeight}
          />
        );
      })}
    </>
  );
};
