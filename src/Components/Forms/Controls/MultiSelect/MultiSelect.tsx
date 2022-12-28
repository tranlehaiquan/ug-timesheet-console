import * as React from "react";
import "./MultiSelect.scss";
// @ts-ignore
import Select from "react-select";
import { noop } from "lodash";

interface OptionItem {
  label: string;
  value: string;
}

interface MultiSelectProps {
  isDisabled?: boolean;
  onChange: (options: OptionItem[]) => void;
  onBlur?: (event: MouseEvent) => void;
  options: OptionItem[];
  value: OptionItem[];
  name?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  isDisabled = false,
  options,
  value,
  onChange,
  name,
  onBlur = noop,
}) => {
  return (
    <Select
      isMulti
      isDisabled={isDisabled}
      name={name}
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
