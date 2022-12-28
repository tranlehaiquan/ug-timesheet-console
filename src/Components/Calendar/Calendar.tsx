import * as React from "react";
import { eachDayOfInterval } from "date-fns";

import { Head } from "./Head";
import { Viewport } from "./Viewport";

import "./Calendar.scss";

export interface CalendarEvent {
  typeId: string | number;
  start: Date;
  end: Date;
  name: string;
  fontColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  payload?: object;
  recurrent?: boolean;
  onClick?: (event: CalendarEvent) => void;
}

const dayCellHeight = 80;

interface Props {
  startDate: Date;
  endDate: Date;
  events?: CalendarEvent[];
  customSubheader?: (data: {
    day: Date;
    dayEvents: CalendarEvent[];
    allEvents: CalendarEvent[];
  }) => React.ReactElement;
}

const defaultSubheader = (data: {
  day: Date;
  dayEvents: CalendarEvent[];
  allEvents: CalendarEvent[];
}) => {
  return <p>{data.day.toISOString()}</p>;
};

const daysVisible = 7;

export const Calendar: React.FC<Props> = ({
  startDate,
  endDate,
  events,
  customSubheader,
}) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const ref = React.useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = React.useState(0);
  const [columnWidth, setColumnWidth] = React.useState(0);
  const verticalScroll = days.length > 7;

  React.useLayoutEffect(() => {
    const scrollMeasurer = document.createElement("div");
    scrollMeasurer.className = "calendar__scrollMeasurer";
    document.body.appendChild(scrollMeasurer);
    const currentScrollWidth =
      scrollMeasurer.offsetWidth - scrollMeasurer.clientWidth;
    setScrollWidth(currentScrollWidth);
    document.body.removeChild(scrollMeasurer);
    setColumnWidth(
      (ref.current!.offsetWidth - 60 - currentScrollWidth) / daysVisible
    );

    const topScrollShift = verticalScroll ? 39 : 0;
    ref.current!.scroll(0, dayCellHeight * 9 + topScrollShift);
  }, []);

  return (
    <div className="calendar--wrapper">
      <span
        className="calendar--bottomSmoother"
        style={{ bottom: `${(verticalScroll ? scrollWidth : 0) + 1}px` }}
      />
      <div ref={ref} className="calendar--container">
        <Head
          days={days}
          customSubheader={customSubheader || defaultSubheader}
          columnWidth={verticalScroll ? columnWidth : undefined}
          events={events || []}
        />
        <Viewport
          days={days}
          events={events || []}
          dayCellHeight={dayCellHeight}
          columnWidth={verticalScroll ? columnWidth : undefined}
        />
      </div>
    </div>
  );
};
