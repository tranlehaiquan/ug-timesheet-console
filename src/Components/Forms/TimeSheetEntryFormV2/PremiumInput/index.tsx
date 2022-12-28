import React, { useEffect, useState } from "react";
import { VocabularyItem } from "src/Services/DataServices";
import { Label } from "../../Utils/Label";
import { MultiSelect } from "../../Controls/MultiSelect/MultiSelect";

interface IProps {
  defaultValue: Pick<VocabularyItem, "label" | "value">[];
  premiumOptions: Pick<VocabularyItem, "label" | "value">[];
  onChange: (value: Pick<VocabularyItem, "label" | "value">[]) => void;
}

const PremiumInput = ({ defaultValue, onChange, premiumOptions }: IProps) => {
  const [fieldValue, setFieldValue] = useState<
    Pick<VocabularyItem, "label" | "value">[]
  >([]);

  const handlePremiumChange = (
    value: Pick<VocabularyItem, "label" | "value">[]
  ) => {
    setFieldValue(value);
  };

  useEffect(() => {
    if (defaultValue) {
      setFieldValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="sk-mb-6">
      <Label text="Premiums" />
      <MultiSelect
        name="premiums"
        options={premiumOptions}
        value={fieldValue}
        onChange={handlePremiumChange}
        onBlur={() => {
          onChange(fieldValue);
        }}
      />
    </div>
  );
};

export default React.memo(PremiumInput);
