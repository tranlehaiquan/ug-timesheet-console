import { noop, toNumber } from "lodash";
import React, { useEffect, useState } from "react";
import { FormInputElement } from "skedulo-ui";
import { IDistance } from "..";
import { Select } from "../../Controls/Select";
import { Label } from "../../Utils/Label";

interface IProps {
  defaultValue: {
    distance: number;
    distanceUnit: string;
  };
  onChange: (distanceObj: IDistance) => void;
}

const DistanceInput = ({ defaultValue, onChange }: IProps) => {
  const [fieldValue, setFieldValue] = useState<IDistance>({
    value: defaultValue.distance || 0,
    unit: defaultValue.distanceUnit || "",
  });

  const handleDistanceChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    if (toNumber(value) < 1000) {
      setFieldValue((preState) => {
        return {
          ...preState,
          value: toNumber(value),
        };
      });
    }
  };

  useEffect(() => {
    const { distance, distanceUnit } = defaultValue;
    if (distance && distanceUnit) {
      setFieldValue({ value: distance, unit: distanceUnit });
    }
  }, [defaultValue.distance, defaultValue.distanceUnit]);

  return (
    <div className="sk-w-1/2">
      <Label text="Distance" />
      <div className="sk-flex">
        <div className="sk-w-2/3">
          <FormInputElement
            inputMode="numeric"
            value={fieldValue.value || ""}
            onChange={handleDistanceChange}
            onBlur={() => {
              onChange({
                value: fieldValue.value,
                unit: fieldValue.unit,
              });
            }}
          />
        </div>
        <div className="sk-w-1/3 sk-ml-3">
          <Select
            label={fieldValue.unit}
            data={[{ label: "KM" }, { label: "MI" }]}
            optionLabel="label"
            disabled
            onOptionClick={noop}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(DistanceInput);
