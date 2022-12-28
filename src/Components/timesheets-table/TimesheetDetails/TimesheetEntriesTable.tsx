import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupBy, isNil, get } from "lodash";
import classnames from "classnames";
import { Icon } from "skedulo-ui";
import { NumberCell } from "../cell-formatters/NumberCell";
import { DateTimeCell } from "../cell-formatters/DateTimeCell";
import { DurationCell } from "../cell-formatters/DurationCell";
import { ReduxDataTypes } from "../../../Store/DataTypes";
import { BaseModal, ConfirmationModal } from "../../Modals";
import TimesheetEntryForm from "../../Forms/TimesheetEntryForm/TimesheetEntryForm";

import "./TimesheetEntriesTable.scss";
import { deleteTimesheetEntry } from "../../../Mutations/input";

export interface TimesheetEntryTableItem extends ReduxDataTypes.TimesheetEntry {
  Duration: number;
  Distance: number;
  DistanceUnit: ReduxDataTypes.DistanceUnit;
}

interface ITimesheetEntriesTable {
  timesheet?: ReduxDataTypes.TimesheetTableItem;
}

interface ITimesheetEntriesGroupRows {
  entries: ReduxDataTypes.TimesheetEntry[];
  columns: {
    key: keyof ReduxDataTypes.TimesheetEntry;
    className?: string;
    cellRenderer?: (
      entry: ReduxDataTypes.TimesheetEntry,
      isFirst?: boolean
    ) => React.ReactElement;
  }[];
}

const TimesheetEntriesGroupRows: React.FC<ITimesheetEntriesGroupRows> = ({
  entries,
  columns,
}) => {
  return (
    <>
      {entries.map((entry, entryIndex) => {
        return (
          <tr key={entryIndex} className="sked-table-row">
            {columns.map((column, colIndex) => {
              const isFirst = entryIndex === 0;
              const isLast = entryIndex === entries.length - 1;
              return (
                <td
                  key={colIndex}
                  className={classnames(
                    "sk-py-3 sk-px-5 sk-text-xs sk-border-grey-lighter",
                    column.className,
                    {
                      "sk-border-b": isLast,
                    }
                  )}
                >
                  {column.cellRenderer
                    ? column.cellRenderer(entry, isFirst)
                    : isNil(entry[column.key])
                    ? "-"
                    : entry[column.key]}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};

const getNameOrDisplayName = (
  entry: ReduxDataTypes.TimesheetEntry,
  suffix: string
) => {
  const name = get(entry, `${suffix}.Name`);
  const displayName = get(entry, `${suffix}.DisplayName`);
  return name || displayName || suffix;
};

const getEntryType = (entry: ReduxDataTypes.TimesheetEntry) => {
  switch (entry.EntryType) {
    case "Job":
      return getNameOrDisplayName(entry, "Job");
    case "Shift":
      return getNameOrDisplayName(entry, "Shift");
    case "Activity":
      return getNameOrDisplayName(entry, "Activity");
    case "Unavailability":
      return getNameOrDisplayName(entry, "Unavailability");
    case "Manual":
      return "Manual";
    default:
      return "-";
  }
};

const getPremiums = (premiums: string) => {
  if (!premiums) {
    return "";
  }

  const values: string[] = JSON.parse(premiums);

  return values.join(", ");
};

export const TimesheetEntriesTable: React.FC<ITimesheetEntriesTable> = ({
  timesheet,
}) => {
  const [updateTimesheetEntryId, setUpdateTimesheetEntryId] = React.useState<
    string | undefined
  >(undefined);
  const [deleteTimesheetEntryId, setDeleteTimesheetEntryId] = React.useState<
    string | undefined
  >(undefined);
  const { defaultTimezone } = useSelector<
    ReduxDataTypes.State,
    ReduxDataTypes.Settings
  >((state) => state.settings);
  const dispatch = useDispatch();

  if (!timesheet) return null;

  // const timesheetEntries = timesheet.Entries
  const timesheetEntriesTableItems = timesheet.Entries;

  // TODO: might be expensive. Move to upper component?
  const entriesByDay = groupBy(
    timesheetEntriesTableItems,
    (entry) => entry.StartDate
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteTimesheetEntry(deleteTimesheetEntryId!));
    } catch (ex) {
      // TODO: Fix: actions must be plain objects
      console.error(ex);
    } finally {
      setDeleteTimesheetEntryId(undefined);
    }
  };

  const columns = [
    {
      key: "StartDate" as keyof ReduxDataTypes.TimesheetEntry,
      name: "Date",
      // cellRenderer: (entry: ReduxDataTypes.TimesheetEntry, isFirst?: boolean) => isFirst
      //   ? <DateTimeCell date={ entry.StartDate } time={ entry.StartTime } format="DD MMMM YYYY" timezone={ entry.Timezone || defaultTimezone } />
      //   : <></>
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <DateTimeCell
          date={entry.StartDate}
          time={entry.StartTime}
          format="DD MMMM YYYY"
          timezone={entry.Timezone || defaultTimezone}
        />
      ),
    },
    {
      key: "Job" as keyof ReduxDataTypes.TimesheetEntry,
      name: "Type",
      className: "sk-pl-0",
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <span>{getEntryType(entry)}</span>
      ),
    },
    {
      key: "Description" as keyof ReduxDataTypes.TimesheetEntry,
    },
    {
      key: "StartTime" as keyof ReduxDataTypes.TimesheetEntry,
      name: "Start",
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <DateTimeCell
          date={entry.StartDate}
          time={entry.StartTime}
          timezone={entry.Timezone || defaultTimezone}
          format="D MMM YYYY h:mm a (z)"
        />
      ),
    },
    {
      key: "EndTime" as keyof ReduxDataTypes.TimesheetEntry,
      name: "End",
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <DateTimeCell
          date={entry.EndDate}
          time={entry.EndTime}
          timezone={entry.Timezone || defaultTimezone}
          format="D MMM YYYY h:mm a (z)"
        />
      ),
    },
    {
      key: "Duration" as keyof ReduxDataTypes.TimesheetEntry,
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <DurationCell
          value={
            typeof entry.Duration === "number" ? entry.Duration : undefined
          }
          isInMinutes
        />
      ),
    },
    {
      key: "Lunch Break" as keyof ReduxDataTypes.TimesheetEntry,
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <DurationCell
          value={
            typeof entry.LunchBreakDuration === "number"
              ? entry.LunchBreakDuration
              : undefined
          }
          isInMinutes
        />
      ),
    },
    {
      key: "Actual Duration" as keyof ReduxDataTypes.TimesheetEntry,
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <DurationCell
          value={
            typeof entry.ActualDuration === "number"
              ? entry.ActualDuration
              : undefined
          }
          isInMinutes
        />
      ),
    },
    {
      key: "Premiums" as keyof ReduxDataTypes.TimesheetEntry,
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <span>{getPremiums(entry.Premiums)}</span>
      ),
    },
    {
      key: "Distance" as keyof ReduxDataTypes.TimesheetEntry,
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <NumberCell
          value={
            entry.Distance! % 1 ? entry.Distance!.toFixed(2) : entry.Distance
          }
          unit={entry.DistanceUnit}
        />
      ),
    },
    {
      key: "UID" as keyof ReduxDataTypes.TimesheetEntry,
      name: " ",
      width: 120,
      cellRenderer: (entry: ReduxDataTypes.TimesheetEntry) => (
        <>
          <Icon
            name="edit"
            size={15}
            className="tset-action-button"
            onClick={() => setUpdateTimesheetEntryId(entry.UID)}
          />
          <Icon
            name="trash"
            size={15}
            className="tset-action-button"
            onClick={() => setDeleteTimesheetEntryId(entry.UID)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <table className="sk-w-full sk-border-collapse sk-table-fixed sk-border-grey-light sk-border-l sk-border-r">
        <thead className="sk-bt-2 sk-bb-2 sk-border-t sk-border-b sk-border-grey-light sk-bg-grey-lightest sk-text-navy-lighter sk-text-xxs sk-uppercase">
          <tr className="sk-h-10 sk-text-left">
            {columns.map((column, index) => {
              return (
                <th
                  key={index}
                  className={classnames(
                    "sk-px-5 sk-font-medium sked-table-header-cell",
                    column.className
                  )}
                  style={{ width: column.width ? `${column.width}px` : "" }}
                >
                  {column.name || column.key}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Object.keys(entriesByDay).map((groupKey, groupIndex) => {
            return (
              <TimesheetEntriesGroupRows
                key={groupIndex}
                entries={entriesByDay[groupKey]}
                columns={columns}
              />
            );
          })}
        </tbody>
      </table>
      <BaseModal
        title="Update Timesheet Entry"
        isOpened={!!updateTimesheetEntryId}
        onClose={() => setUpdateTimesheetEntryId(undefined)}
      >
        <TimesheetEntryForm
          close={() => setUpdateTimesheetEntryId(undefined)}
          TimesheetUID={timesheet.UID}
          TimesheetEntryUID={updateTimesheetEntryId}
        />
      </BaseModal>
      {deleteTimesheetEntryId && (
        <ConfirmationModal
          isOpened={!!deleteTimesheetEntryId}
          onConfirm={onDelete}
          onClose={() => setDeleteTimesheetEntryId(undefined)}
          confirmLabel="Yes, remove"
          title="Delete Timesheet Entry"
          className="sked-modal-small"
        >
          <p className="sk-mb-16">
            Do you really want to delete this Timesheet Entry? You won't be able
            to restore it later
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};
