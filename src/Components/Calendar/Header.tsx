import * as React from "react";
import { format, isSameDay } from "date-fns";

import { CalendarEvent } from "./Calendar";

import "./Header.scss";

interface HeaderProps {
  columnId: number;
  day: Date;
  events: CalendarEvent[];
  customSubheader?: (data: {
    day: Date;
    dayEvents: CalendarEvent[];
    allEvents: CalendarEvent[];
  }) => React.ReactElement;
}

export const Header = ({
  columnId,
  day,
  events,
  customSubheader,
}: HeaderProps) => {
  const dayEvents = events.filter((event) => isSameDay(event.start, day));
  return (
    <>
      <div
        className="calendar--header_cell sk-bg-white"
        style={{
          gridColumnStart: columnId,
          gridRowStart: 1,
        }}
      >
        {format(day, "E d")}
      </div>
      {customSubheader && (
        <div
          className="calendar--header_cell sk-bg-grey-lightest"
          style={{
            gridColumnStart: columnId,
            gridRowStart: 2,
          }}
        >
          {customSubheader({ day, dayEvents, allEvents: events })}
        </div>
      )}
    </>
  );
};
