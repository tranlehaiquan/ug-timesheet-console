import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { Label } from "../../Utils/Label";

interface IProps {
  defaultValue: string;
  onChange: (description: string) => void;
}

const DescriptionInput = ({ defaultValue, onChange }: IProps) => {
  const [fieldValue, setFieldValue] = useState<string>("");

  const handleDescriptionChange = (event: React.SyntheticEvent) => {
    setFieldValue(get(event, "target.value"));
  };

  useEffect(() => {
    setFieldValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="sk-mb-8">
      <Label text="Description" />
      <textarea
        className="tse-form__description-field"
        rows={3}
        onChange={handleDescriptionChange}
        onBlur={() => onChange(fieldValue)}
        value={fieldValue}
      />
    </div>
  );
};

export default React.memo(DescriptionInput);
