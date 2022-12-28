import * as React from "react";
import { useSelector } from "react-redux";
import { PopperProps } from "react-popper";
import classnames from "classnames";
import { get } from "lodash";
import moment from "moment-timezone";

import {
  ResponsiveDropdown,
  PopOutBase,
  Button,
  Icon,
  FormInputElement,
  LoadingSpinner,
  DropdownListProps,
} from "skedulo-ui";
import { RootState } from "src/StoreV2/store";
import { EntryTypes, ReduxDataTypes } from "../../../StoreV2/DataTypes";

const containsString = (value?: string | number, searchString = "") => {
  return (
    value !== undefined &&
    value !== null &&
    value.toString().toLowerCase().indexOf(searchString.toLowerCase()) > -1
  );
};

const searchObject = (
  item: object,
  paths: string[] = [],
  searchString: string
) => {
  if (!searchString) {
    return true;
  }

  for (const path of paths) {
    const value = get(item, path);
    if (containsString(value, searchString)) {
      return true;
    }
  }

  return false;
};

const selectData =
  (type: EntryTypes, searchValue: string) => (state: RootState) => {
    const data: (
      | ReduxDataTypes.Job
      | ReduxDataTypes.Shift
      | ReduxDataTypes.Activity
      | ReduxDataTypes.Availability
    )[] = get(state.timeSheetEntries.newEntryInForm, `newEntry${type}`);

    if (!data) {
      return [];
    }

    return searchValue
      ? data.filter((item) =>
          searchObject(item, ["Name", "DisplayName"], searchValue)
        )
      : data;
  };

export const TypedSelect: React.FC<{
  label?: string;
  types: EntryTypes[];
  selectedType: EntryTypes;
  visibleDropdown: boolean;
  loading?: boolean;
  onButtonClick: () => void;
  onTypeSelect: (value: EntryTypes) => () => void;
  onOptionClick: (data: ReduxDataTypes.TimesheetEntryRelation) => () => void;
  timezone: string;
}> = ({
  label = "Search items",
  onTypeSelect,
  selectedType,
  types,
  onOptionClick,
  onButtonClick,
  visibleDropdown,
  loading = false,
  timezone,
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const data = useSelector(selectData(selectedType, searchValue));

  React.useEffect(() => {
    if (!visibleDropdown) {
      setSearchValue("");
    }
  }, [visibleDropdown]);

  return (
    <ResponsiveDropdown>
      {(
        modifiers: PopperProps["modifiers"],
        placement: PopperProps["placement"]
      ) => (
        <PopOutBase
          visible={visibleDropdown}
          placement={placement}
          modifiers={modifiers}
          trigger={
            <Button
              className="tse-element__select"
              buttonType="secondary"
              onClick={(event) => {
                event.stopPropagation();
                onButtonClick();
              }}
              loading={loading}
            >
              {label}
              <Icon name="chevronDown" className="sk-ml-2" size={8} />
            </Button>
          }
        >
          <ArrayOptionRenderer
            options={data}
            onOptionClick={onOptionClick}
            type={selectedType}
            onSearch={setSearchValue}
            timezone={timezone}
          >
            <TypeSelect
              data={types}
              onClick={onTypeSelect}
              selectedType={selectedType}
            />
          </ArrayOptionRenderer>
        </PopOutBase>
      )}
    </ResponsiveDropdown>
  );
};

const ListLoadingIndicator: React.FC = ({ children }) => {
  const busyState = useSelector(
    ({ busy, busyCnt }: ReduxDataTypes.State) =>
      busy && busyCnt.includes("NEW_ENTRY")
  );
  return (
    <>
      {busyState ? (
        <LoadingSpinner size={16} color="#0b86ff" className="sk-p-2" />
      ) : (
        children || ""
      )}
    </>
  );
};

const ArrayOptionRenderer: React.FC<{
  onSearch: (searchValue: string) => void;
  searchPlaceholder?: string;
  onOptionClick: (
    option: ReduxDataTypes.TimesheetEntryRelation
  ) => (ev: React.MouseEvent) => void;
  options: ReduxDataTypes.TimesheetEntryRelation[];
  type: EntryTypes;
  timezone: string;
}> = ({
  onSearch,
  searchPlaceholder = "Search",
  onOptionClick,
  options,
  children,
  type,
  timezone,
}) => {
  const onSearchHandler: (ev: React.ChangeEvent<HTMLInputElement>) => void = (
    event
  ) => onSearch(event.target.value);
  return (
    <div
      data-sk-name="sked-dropdownlist"
      className="sked-dropdownlist"
      style={{ maxWidth: "auto" }}
    >
      {children}
      {type !== "Manual" && (
        <>
          <SearchItem
            onSearch={onSearchHandler}
            searchPlaceholder={searchPlaceholder || "Search"}
          />
          <DropdownBr />
          <ul className="sked-dropdownlist-list">
            <ListLoadingIndicator>
              {options && options.length ? (
                options.map((option, index) => (
                  <DropdownRow
                    onClick={onOptionClick(option)}
                    className="sked-dropdownlist-item sked-dropdownlist-item--array sk-py-1 sk-text-navy sk-flex sk-px-3"
                    key={index}
                  >
                    <OptionRenderer
                      type={type}
                      option={option}
                      timezone={timezone}
                    />
                  </DropdownRow>
                ))
              ) : (
                <p className="sk-m-2 sk-ml-3">No items found</p>
              )}
            </ListLoadingIndicator>
          </ul>
        </>
      )}
    </div>
  );
};

const DropdownRow: React.FC<{
  children: React.ReactNode;
  onClick?: (ev: React.MouseEvent) => void;
  className?: string;
}> = ({ children, className, onClick }) => (
  <li
    data-sk-name="sk-filter-dropdown-row"
    className={className}
    onClick={onClick}
  >
    {children}
  </li>
);

export const SearchItem: React.FC<
  Pick<DropdownListProps, "onSearch" | "searchPlaceholder">
> = ({ onSearch, searchPlaceholder }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  return (
    <div className="sk-text-navy-light sk-text-sm sk-flex sk-items-center sk-px-3 sk-my-1">
      <Icon name="search" size={18} className="sk-text-navy-lightest" />
      <FormInputElement
        data-sk-name="sk-filter-search-input"
        type="text"
        placeholder={searchPlaceholder}
        onChange={onSearch}
        className="sk-border-0"
        inputRef={ref}
      />
    </div>
  );
};

const DropdownBr = () => (
  <div className="sk-border-t sk-border-solid sk-border-grey-light" />
);

const OptionRenderer: React.FC<{
  type: EntryTypes;
  option: ReduxDataTypes.TimesheetEntryRelation;
  timezone: string;
}> = ({ option, type, timezone }) => {
  return (
    <div className="sk-flex sk-items-stretch sk-content-center sk-mb-1 sk-mt-1">
      <div
        style={{
          background: "rgba(0, 126, 230, 0.12)",
          padding: "8px 12px",
          color: "#007ee6",
        }}
        className="sk-flex sk-items-center sk-mr-4"
      >
        <Icon name="jobs" />
      </div>
      <div>
        <div className="sk-font-semibold sk-mb-1">
          {getOptionName(option, type, timezone)}
        </div>
        <div className="sk-text-xxs sk-text-grey sk-whitespace-pre-wrap">
          {summaryDisplay(type, option, timezone)}
        </div>
      </div>
    </div>
  );
};

const getFormattedTime = (
  option: ReduxDataTypes.TimesheetEntryRelation,
  timezone: string
) => {
  const startDate = moment.tz(option.Start, timezone).format("DD MMM yyyy");
  const startTime = moment.tz(option.Start, timezone).format("h:mm a");
  const end =
    (
      option as
        | ReduxDataTypes.Shift
        | ReduxDataTypes.Job
        | ReduxDataTypes.Activity
    ).End || (option as ReduxDataTypes.Availability).Finish;
  const endTime = moment.tz(end, timezone).format("h:mm a");
  const endDate = moment.tz(end, timezone).format("DD MMM yyyy");
  return { startDate, endDate, startTime, endTime };
};

const getOptionName = (
  option: ReduxDataTypes.TimesheetEntryRelation,
  type: EntryTypes,
  timezone: string
) => {
  if (type === "Shift") {
    const { startDate, endDate, startTime, endTime } = getFormattedTime(
      option,
      timezone
    );
    const shiftOption = option as ReduxDataTypes.Shift;
    return shiftOption.DisplayName
      ? shiftOption.DisplayName
      : `Shift ${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  if (type === "Unavailability") {
    const avaOption = option as ReduxDataTypes.Availability;
    return avaOption.Type;
  }

  return option.Name || "-";
};

const summaryDisplay = (
  type: EntryTypes,
  option: ReduxDataTypes.TimesheetEntryRelation,
  timezone: string
) => {
  const { startDate, endDate, startTime, endTime } = getFormattedTime(
    option,
    timezone
  );

  if (type === "Job") {
    const o = option as ReduxDataTypes.Job;
    return `${o.Type}${
      o.Account && o.Account.Name ? ` | ${o.Account.Name}` : ""
    } | ${o.JobStatus}\n${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  if (type === "Shift") {
    const o = option as ReduxDataTypes.Shift;
    return o.DisplayName
      ? `${startDate} ${startTime} - ${endDate} ${endTime}`
      : "";
  }
  if (type === "Unavailability") {
    return `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  if (type === "Activity") {
    return `${
      (option as ReduxDataTypes.Activity).Type
    }\n${startDate} ${startTime} - ${endDate} ${endTime}`;
  }

  return `${type} (${startDate} ${startTime} - ${endDate} ${endTime})`;
};

const TypeSelect: React.FC<{
  data: EntryTypes[];
  onClick: (value: EntryTypes) => () => void;
  selectedType: string;
}> = ({ data, onClick, selectedType }) => {
  return (
    <div className="tse-tabs">
      {data.map((element) => (
        <div
          key={element}
          className={classnames("tse-tabs__element", {
            "tse-tabs__element--selected": element === selectedType,
          })}
          onClick={onClick(element)}
        >
          {element}
        </div>
      ))}
    </div>
  );
};
