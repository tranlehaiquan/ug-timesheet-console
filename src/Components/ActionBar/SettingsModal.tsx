import React, { useState, useEffect } from "react";
import {
  ConfirmationModal,
  ButtonDropdown,
  Menu,
  MenuItem,
  Icon,
  Button,
} from "skedulo-ui";

import ReduxDataTypes from "../../StoreV2/DataTypes";

const distanceOptions: ReduxDataTypes.DistanceUnit[] = ["KM", "MI"];

const distanceNames: { [key in ReduxDataTypes.DistanceUnit]: string } = {
  KM: "kilometers",
  MI: "miles",
};

interface Props {
  onClose: () => void;
  onSubmit: (settings: ReduxDataTypes.Settings) => void;
  settings: ReduxDataTypes.Settings;
}

const SettingsModal: React.FunctionComponent<Props> = (props) => {
  const [settings, setSettings] = useState({ ...props.settings });
  useEffect(() => setSettings(props.settings), [props.settings]);

  const onCancel = () => {
    setSettings({ ...props.settings });
    props.onClose();
  };

  const renderDistance = () => (
    <>
      <span>Distance</span>
      <ButtonDropdown
        label={distanceNames[settings.distanceUnit]}
        compact={false}
        disabled={false}
        buttonType="secondary"
      >
        <Menu>
          {distanceOptions.map((option) => (
            <MenuItem
              onClick={() => setSettings({ ...settings, distanceUnit: option })}
              key={option}
            >
              {distanceNames[option]}
            </MenuItem>
          ))}
        </Menu>
      </ButtonDropdown>
    </>
  );

  return (
    <ConfirmationModal
      onConfirm={() => props.onSubmit(settings)}
      onCancel={onCancel}
      confirmButtonText="Submit"
    >
      <div className="sk-pb-20">
        <div className="sk-flex sk-justify-between sk-items-center sk-mb-8 sk-text-base">
          <h3>Settings</h3>
          <Button buttonType="transparent" onClick={onCancel} compact>
            <Icon name="remove" size={12} />
          </Button>
        </div>
        <div className="sk-flex sk-justify-between sk-items-center">
          {renderDistance()}
        </div>
      </div>
    </ConfirmationModal>
  );
};

export default SettingsModal;
