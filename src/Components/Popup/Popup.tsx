import React from "react";
import "./Popup.scss";

export const Popup: React.FC<{
  children: React.ReactElement;
  isVisible: boolean;
}> = ({ children, isVisible }) =>
  isVisible && (
    <div className="sk-popup-wrapper">
      <div className="sk-popup-content">{children}</div>
    </div>
  );
