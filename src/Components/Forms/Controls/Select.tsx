import * as React from "react";
import { PopperProps } from "react-popper";
import { get } from "lodash";

import {
  ResponsiveDropdown,
  PopOutBase,
  Button,
  Icon,
  FormInputElement,
  DropdownListProps,
} from "skedulo-ui";

const containsString = (value: object, searchString: string) => {
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
    if (
      value !== null &&
      value !== undefined &&
      containsString(value, searchString)
    ) {
      return true;
    }
  }

  return false;
};

export const Select: React.FC<{
  data: object[];
  label?: string | React.ReactNode;
  optionLabel?: string | string[];
  searchFields?: string[];
  loading?: boolean;
  disabled?: boolean;
  onOptionClick: (data: object) => void;
  customOptionRenderer?: (option: object) => React.ReactNode;
}> = ({
  data,
  label = "Search items",
  optionLabel,
  searchFields,
  onOptionClick,
  disabled = false,
  loading = false,
  customOptionRenderer,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredData = searchFields
    ? data.filter((item) => searchObject(item, searchFields, searchValue))
    : data;

  const hideDropdown = () => {
    setIsDropdownVisible(false);
  };

  React.useEffect(() => {
    document.addEventListener("click", hideDropdown);
    return () => {
      document.removeEventListener("click", hideDropdown);
    };
  });

  React.useEffect(() => {
    if (!isDropdownVisible) {
      setSearchValue("");
    }
  }, [isDropdownVisible]);

  const onOptionClickHandler = (option: object) => {
    onOptionClick(option);
    hideDropdown();
  };

  return (
    <ResponsiveDropdown>
      {(
        modifiers: PopperProps["modifiers"],
        placement: PopperProps["placement"]
      ) => (
        <PopOutBase
          visible={isDropdownVisible}
          placement={placement}
          modifiers={modifiers}
          trigger={
            <Button
              className="tse-element__select"
              buttonType="secondary"
              onClick={() => !disabled && setIsDropdownVisible(true)}
              disabled={disabled}
              loading={loading}
            >
              {label}
              <Icon name="chevronDown" className="sk-ml-2" size={8} />
            </Button>
          }
        >
          <ArrayOptionRenderer
            options={filteredData}
            onOptionClick={onOptionClickHandler}
            searchable={!!searchFields}
            onSearch={setSearchValue}
            optionLabel={optionLabel}
            customOptionRenderer={customOptionRenderer}
          />
        </PopOutBase>
      )}
    </ResponsiveDropdown>
  );
};

const ArrayOptionRenderer: React.FC<{
  options: object[];
  optionLabel?: string | string[];
  onSearch: (searchValue: string) => void;
  onOptionClick: (option: object) => void;
  searchPlaceholder?: string;
  customOptionRenderer?: (option: object) => React.ReactNode;
  searchable: boolean;
}> = ({
  onSearch,
  searchPlaceholder = "Search",
  onOptionClick,
  options,
  optionLabel,
  children,
  customOptionRenderer,
  searchable,
}) => {
  const onSearchHandler: (ev: React.ChangeEvent<HTMLInputElement>) => void = (
    event
  ) => onSearch(event.target.value);

  return (
    <div
      data-sk-name="sked-dropdownlist"
      className="sked-dropdownlist sk-mx-1"
      style={{ maxWidth: "auto" }}
    >
      {children}
      {searchable && (
        <SearchItem
          onSearch={onSearchHandler}
          searchPlaceholder={searchPlaceholder || "Search"}
        />
      )}
      <DropdownBr />
      <ul className="sked-dropdownlist-list">
        {options && options.length ? (
          options.map((option, index) => (
            <DropdownRow
              onClick={() => onOptionClick(option)}
              className="sked-dropdownlist-item sked-dropdownlist-item--array sk-py-2 sk-text-navy sk-flex sk-px-3"
              key={index}
            >
              {customOptionRenderer
                ? customOptionRenderer(option)
                : get(option, optionLabel!, "-")}
            </DropdownRow>
          ))
        ) : (
          <p className="sk-m-2 sk-ml-3">No items found</p>
        )}
      </ul>
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
