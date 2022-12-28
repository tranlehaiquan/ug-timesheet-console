import * as React from "react";
import { format } from "date-fns";

import { Header } from "./Header";
import { CalendarEvent } from "./Calendar";

import "./Calendar.scss";

interface HeadProps {
  days: Date[];
  events: CalendarEvent[];
  customSubheader?: (data: {
    day: Date;
    dayEvents: CalendarEvent[];
    allEvents: CalendarEvent[];
  }) => React.ReactElement;
  columnWidth?: number;
}

const localTimeZone = format(Date.now(), "O");

export const Head: React.FC<HeadProps> = ({
  days,
  events,
  customSubheader,
  columnWidth,
}) => {
  const headersXOffset = 2;
  const finalColumnWidth =
    columnWidth !== undefined ? `${columnWidth}px` : "1fr";

  return (
    <div
      className="calendar--head"
      style={{
        gridTemplateColumns: `60px repeat(${days.length}, ${finalColumnWidth}`,
        gridTemplateRows: "auto",
      }}
    >
      <div
        className="calendar--timezone"
        style={{
          gridColumnStart: 1,
          gridRowStart: 1,
        }}
      >
        {localTimeZone}
      </div>
      <span
        className="calendar--topSmoother"
        style={{
          gridColumnStart: 1,
          gridRowStart: 2,
          gridRowEnd: -1,
        }}
      />
      {days.map((day, index) => (
        <Header
          key={index}
          columnId={headersXOffset + index}
          day={day}
          events={events}
          customSubheader={customSubheader}
        />
      ))}
    </div>
  );
};
