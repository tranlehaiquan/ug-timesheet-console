import * as React from "react";
import { areIntervalsOverlapping, endOfDay } from "date-fns";
import { startOfDay } from "date-fns/esm";

import { Day } from "./Day";
import { TimeRange } from "./TimeRange";
import { CalendarEvent } from "./Calendar";

import "./Calendar.scss";

interface Props {
  days: Date[];
  events: CalendarEvent[];
  dayCellHeight: number;
  columnWidth?: number;
}

const getEventsOfDay = (events: CalendarEvent[], date: Date) => {
  return events.filter((event) =>
    areIntervalsOverlapping(
      { start: event.start, end: event.end },
      { start: startOfDay(date), end: endOfDay(date) }
    )
  );
};

export const Viewport: React.FC<Props> = ({
  days,
  events,
  dayCellHeight,
  columnWidth,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    ref.current!.scroll(0, dayCellHeight * 9);
  }, []);

  const finalColumnWidth =
    columnWidth !== undefined ? `${columnWidth}px` : "1fr";

  return (
    <div className="calendar--viewportWrapper">
      <div
        ref={ref}
        className="calendar--viewport"
        style={{
          height: `${dayCellHeight * 8}px`,
          display: "grid",
          gridTemplateColumns: `60px repeat(${days.length}, ${finalColumnWidth})`,
          gridTemplateRows: `repeat(24, ${dayCellHeight}px)`,
        }}
      >
        <TimeRange />
        {days.map((day, index) => (
          <Day
            key={index}
            day={day}
            columnId={index + 2}
            events={getEventsOfDay(events, day)}
            cellHeight={dayCellHeight}
          />
        ))}
      </div>
    </div>
  );
};
