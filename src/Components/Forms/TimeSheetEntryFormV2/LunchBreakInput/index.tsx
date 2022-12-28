import React, { useEffect, useState } from "react";
import { LUNCH_BREAK_OPTIONS } from "src/common/constants/lunchBreak";
import { Select } from "../../Controls/Select";
import { Label } from "../../Utils/Label";

interface IProps {
  defaultValue: number;
  onChange: (distanceObj: number) => void;
}

const LunchBreakInput = ({ defaultValue, onChange }: IProps) => {
  const [fieldValue, setFieldValue] = useState<number>(0);

  const handleLunchBreakChange = (option: { label: string; value: number }) => {
    setFieldValue(option.value);
    onChange(option.value);
  };

  useEffect(() => {
    setFieldValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="sk-mb-8">
      <Label text="Lunch Break" />
      <Select
        label={
          LUNCH_BREAK_OPTIONS.find((option) => option.value === fieldValue)
            .label
        }
        optionLabel="label"
        data={LUNCH_BREAK_OPTIONS}
        onOptionClick={(data: object) => {
          handleLunchBreakChange(data as { label: string; value: number });
        }}
      />
    </div>
  );
};

export default React.memo(LunchBreakInput);
