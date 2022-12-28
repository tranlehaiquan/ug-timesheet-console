import * as React from "react";
import * as _ from "lodash";
import { storiesOf } from "@storybook/react";

import { InlineTabs } from "./InlineTabs/InlineTabs";
import { PillTabs } from "./PillTabs/PillTabs";

const pillTabs = [
  { id: "calendar", name: "Calendar" },
  { id: "swimlane", name: "Swimlane" },
  { id: "swimlane-vertical", name: "Swimlane vertical" },
  { id: "map", name: "Map" },
];

const availabilitySubmenu = [
  {
    id: "calendar",
    name: "Calendar",
  },
  {
    id: "ava-unava-req",
    name: "Availability & unavailability requests",
    icon: "2",
  },
  {
    id: "ava-templates",
    name: "Availability templates",
  },
  {
    id: "temporary-regions",
    name: "Temporary regions",
  },
];
const inlineTabs = [
  {
    id: "overview",
    name: "Overview",
    submenu: availabilitySubmenu.map((a) => ({
      name: `${a.name} overview`,
      id: `overview-${a.id}`,
    })),
  },
  { id: "schedule", name: "schedule" },
  {
    id: "jobs",
    name: "jobs",
    icon: "3",
    submenu: availabilitySubmenu.map((a) => ({ ...a, name: `Jobs ${a.name}` })),
  },
  { id: "map", name: "Map" },
  { id: "ava", name: "Availability" },
  { id: "tags", name: "tags" },
  { id: "details", name: "details" },
];

storiesOf("Tabs", module)
  .add("Pill tabs", () => (
    <div className="sk-font-sans">
      <PillTabs tabs={pillTabs} onTabClick={_.noop} />
    </div>
  ))
  .add("Inline tabs", () => (
    <div className="sk-font-sans">
      <InlineTabs tabs={inlineTabs} onTabClick={_.noop} />
    </div>
  ));
