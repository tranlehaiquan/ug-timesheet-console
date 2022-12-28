import * as React from "react";
import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";
import values from "lodash/values";
import sortBy from "lodash/sortBy";
import classnames from "classnames";

import { Badge } from "../../badge/Badge";
import { Button } from "../../buttons/button/Button";
import { FormInputElement } from "../../forms/FormElements";
import { Icon } from "../../icon/Icon";
import {
  ListTypes,
  Options,
  DropdownListProps,
  Omit,
  ArrayOptionRendererProps,
} from "../interfaces";

type ListHandlers<T = Options> = {
  [key in ListTypes]: (
    label: string,
    value: boolean
  ) => (prevOptions: React.SetStateAction<T>) => T;
};
type IOnOptionClick = (label: string) => React.ChangeEventHandler<HTMLElement>;

export const DropdownList: React.FC<DropdownListProps> = (props) => {
  const {
    onSearch,
    onOptionClick,
    searchPlaceholder = "Search filters...",
    showSearchFor = 10,
    emptyState = "No results found",
    options = {},
    selectedCount,
  } = props;
  if (Array.isArray(options)) {
    return (
      <ArrayOptionRenderer
        options={options}
        onOptionClick={onOptionClick}
        onSearch={onSearch}
        searchPlaceholder={searchPlaceholder}
        showSearchFor={showSearchFor}
        emptyState={emptyState}
        selectedCount={selectedCount}
      />
    );
  }
  return (
    <InputOptionRenderer
      {...props}
      options={options}
      searchPlaceholder={searchPlaceholder}
      showSearchFor={showSearchFor}
      emptyState={emptyState}
    />
  );
};

const InputOptionRenderer: React.FC<
  Omit<DropdownListProps, "options"> & { options: Options }
> = ({
  listType,
  onSearch,
  onApply,
  onOptionClick: optionClickHandler,
  searchPlaceholder,
  emptyState,
  showList = true,
  options,
  showSearchFor,
  visibleApplyButton = true,
  classNames,
}) => {
  const [newOptions, setNewOptions] = React.useState(options);
  const [searchValue, setSearchValue] = React.useState("");
  const [allowApply, setAllowApply] = React.useState(
    values(options).includes(true)
  );
  const [visibleApply, setVisibleApply] = React.useState(visibleApplyButton);

  const searchHandler =
    onSearch || (({ target }) => setSearchValue(target.value));

  const hideButton = (val: number) =>
    setVisibleApply(visibleApplyButton && val > 0);

  React.useEffect(() => {
    setAllowApply(values(newOptions).includes(true));
  }, [newOptions]);
  // update on props change and keep selected values
  React.useEffect(() => {
    const keys = Object.keys(options);
    setNewOptions(
      pickBy(
        {
          ...options,
          ...newOptions,
        },
        (_, label) => keys.includes(label)
      )
    );
  }, [options]);

  const onOptionClick: IOnOptionClick =
    (label) =>
    ({ target }) => {
      const { checked } = target as HTMLInputElement;
      setNewOptions(listHandlers[listType](label, checked));
      !!optionClickHandler && optionClickHandler(label)(null);
    };

  const showSearch =
    !!onSearch ||
    (!!showSearchFor && Object.keys(options).length >= showSearchFor);
  return (
    <div
      data-sk-name="sked-dropdownlist"
      className={classnames("sked-dropdownlist max-w-xs sk-mx-1", classNames)}
    >
      {showSearch && (
        <SearchItem
          onSearch={searchHandler}
          searchPlaceholder={searchPlaceholder}
        />
      )}
      {showList && (
        <>
          {showSearch && <DropdownBr />}
          <ListRenderer
            options={newOptions}
            onOptionClick={onOptionClick}
            listType={listType}
            searchValue={searchValue}
            onRender={hideButton}
            emptyState={emptyState}
          />
        </>
      )}
      {onApply && visibleApply && (
        <>
          <DropdownBr />
          <div className="sk-text-navy-light sk-flex sk-justify-center sk-items-stretch sk-flex-grow">
            <Button
              data-sk-name="sk-filter-apply"
              className="sked-dropdownlist-apply sk-text-blue-600 sk-px-0 sk-w-full hover:sk-text-blue-dark"
              disabled={!allowApply}
              onClick={onApply(newOptions)}
              buttonType="transparent"
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const searchOnlyPropsReset: DropdownListProps = {
  listType: "checkbox",
  showList: false,
  options: {},
  onSearch: () => {},
};

export const SearchOnlyFilter: React.FC<DropdownListProps> = (props) => {
  const [allOptions, setAllOptions] = React.useState(props.options as Options);
  const [filteredOptions, setFilteredOptions] = React.useState(
    pickSelected(props.options as Options)
  );
  const [search, setSearch] = React.useState("");
  const onSearch = ({ target: { value } }: { target: { value: string } }) =>
    setSearch(value.toLowerCase());

  React.useEffect(() => {
    search
      ? setFilteredOptions(filterAndSort(allOptions, search))
      : setFilteredOptions(pickSelected(allOptions));
  }, [search]);

  const onApply = (options: Options) => () => {
    const newOptions: Options = { ...allOptions, ...options };
    setAllOptions(newOptions);
    setSearch("");

    props.onApply(newOptions)(null);
  };
  const filteredKeys = Object.keys(filteredOptions);

  return (
    <DropdownList
      {...props}
      {...searchOnlyPropsReset}
      showList={filteredKeys.length > 0 || search.length > 0}
      onSearch={onSearch}
      options={filteredOptions}
      onApply={onApply}
      visibleApplyButton={true}
      classNames="sked-dropdownlist-searchonly"
    />
  );
};

const filterAndSort = (allOptions: Options, search: string) => {
  const filtered = pickBy(allOptions, (_, label) =>
    label.toLowerCase().includes(search)
  );
  const sorted = sortBy(Object.keys(filtered), (label) =>
    label.toLowerCase().indexOf(search)
  );

  return sorted.reduce<{ [key: string]: boolean }>((acc, label) => {
    acc[label] = filtered[label];
    return acc;
  }, {});
};

const pickSelected = (options: Options) => pickBy(options);

const listHandlers: ListHandlers = {
  checkbox: (label, value) => (prevOptions) => ({
    ...prevOptions,
    [label]: value,
  }),
  radio: (label, value) => (prevOptions) => ({
    ...mapValues(prevOptions, (_, key) => (key === label ? value : false)),
  }),
};

const ListRenderer: React.FC<{
  options: Options;
  onOptionClick: IOnOptionClick;
  listType: ListTypes;
  emptyState: string;
  onRender?: (numberOfOptions: number) => void;
  searchValue?: string;
}> = ({
  options,
  onOptionClick,
  listType,
  emptyState,
  searchValue = "",
  onRender = () => {},
}) => {
  const items = searchValue
    ? pickBy(options, (_, label) =>
        label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;
  const itemsKeys = Object.keys(items);
  onRender(itemsKeys.length);

  return itemsKeys.length ? (
    <ul className="sked-dropdownlist-list">
      {itemsKeys.map((label, index) => (
        <DropdownRow className="sked-dropdownlist-item" key={index}>
          <FormInputElement
            checked={options[label]}
            type={listType}
            onChange={onOptionClick(label)}
            name="filter-option"
            id={`${label.replace(/\s/g, "")}-option-${index}`}
            inlineLabel={label}
          />
        </DropdownRow>
      ))}
    </ul>
  ) : (
    <DefaultEmptyState>{emptyState}</DefaultEmptyState>
  );
};

const ArrayOptionRenderer: React.FC<ArrayOptionRendererProps> = ({
  onSearch,
  onOptionClick,
  searchPlaceholder,
  showSearchFor,
  emptyState,
  options,
  selectedCount = {},
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const searchHandler =
    onSearch ||
    (({ target: { value } }: { target: { value: string } }) =>
      setSearchValue(value.toLowerCase()));
  const optionsToDisplay = searchValue
    ? options.filter((option) => option.toLowerCase().includes(searchValue))
    : options;
  const showSearch =
    !!onSearch || (!!showSearchFor && options.length >= showSearchFor);
  return (
    <div data-sk-name="sked-dropdownlist" className="sked-dropdownlist sk-mx-1">
      {showSearch && (
        <>
          <SearchItem
            onSearch={searchHandler}
            searchPlaceholder={searchPlaceholder}
          />
          <DropdownBr />
        </>
      )}
      <ul className="sked-dropdownlist-list">
        {optionsToDisplay.length ? (
          optionsToDisplay.map((option, index) => (
            <DropdownRow
              onClick={onOptionClick(option)}
              className="sked-dropdownlist-item sked-dropdownlist-item--array sk-py-1 sk-text-navy sk-flex sk-px-3"
              key={index}
            >
              <div className="sk-flex sk-justify-between sk-items-center">
                {option}
                {!!selectedCount[option] && (
                  <Badge className="sk-ml-2" count={selectedCount[option]} />
                )}
              </div>
            </DropdownRow>
          ))
        ) : (
          <DefaultEmptyState>{emptyState}</DefaultEmptyState>
        )}
      </ul>
    </div>
  );
};

const SearchItem: React.FC<
  Pick<DropdownListProps, "onSearch" | "searchPlaceholder">
> = ({ onSearch, searchPlaceholder }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    ref.current && ref.current.focus();
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

const DropdownBr = () => (
  <div className="sk-border-t sk-border-solid sk-border-grey-light" />
);

const DefaultEmptyState: React.FC = ({ children }) => (
  <div
    data-sk-name="sk-filter-empty-state"
    className="sk-text-grey sk-px-3 sk-py-3 sk-flex sk-justify-start sk-items-center sk-text-sm"
  >
    {children}
  </div>
);
