import * as React from "react";
import "./ValidationMessages.scss";
import { Icon } from "skedulo-ui";

export const ValidationError: React.FC = ({ children }) => {
  return (
    <div className="box error-box">
      <div className="box__icon error-box__icon">
        <Icon name="exclamation" size={12} color="#faeae9" />
      </div>
      <div className="error-box__content">{children}</div>
    </div>
  );
};

export const ValidationWarning: React.FC = ({ children }) => {
  return (
    <div className="box warning-box">
      <div className="box__icon warning-box__icon">
        <Icon name="exclamation" size={12} color="#faeae9" />
      </div>
      <div className="warning-box__content">{children}</div>
    </div>
  );
};
