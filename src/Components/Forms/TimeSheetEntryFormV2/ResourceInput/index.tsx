import { get } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/StoreV2/store";
import { Select } from "../../Controls/Select";
import { Label } from "../../Utils/Label";

interface IProps {
  resourceId: string;
  onChange: (resourceId: string) => void;
}

const ResourceInput = ({ resourceId, onChange }: IProps) => {
  const resources = useSelector((state: RootState) => state.resource.values);
  const resource = resources.find((resource) => resource.UID === resourceId);
  const handleChange = (resourceObj: object) => {
    const resourceId = get(resourceObj, "UID", null);
    onChange(resourceId);
  };

  return (
    <div className="sk-mb-6">
      <Label text="Resource" />
      <Select
        optionLabel="Name"
        searchFields={["Name"]}
        label={(resource && resource.Name) || "Select resource"}
        data={resources || []}
        onOptionClick={handleChange}
      />
    </div>
  );
};

export default React.memo(ResourceInput);
