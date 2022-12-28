import * as React from "react";
import { Icon, Button } from "skedulo-ui";

export interface FormModalHeaderProps {
  title: string;
  onHide: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FormModalHeader: React.FC<FormModalHeaderProps> = ({
  title,
  onHide,
}) => {
  return (
    <header className="sk-flex sk-justify-between sk-items-center sk-mb-8">
      <h3 style={{ fontSize: 20, color: "#223049" }}>{title}</h3>
      <Button
        buttonType="transparent"
        onClick={onHide}
        compact
        className="sk-p-1 sk-leading-none"
      >
        <Icon
          name="remove"
          size={12}
          color="#485875"
          className="sk-cursor-pointer"
        />
      </Button>
    </header>
  );
};

export default FormModalHeader;
