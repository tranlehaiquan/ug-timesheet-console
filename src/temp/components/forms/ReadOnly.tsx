import * as React from "react";
import classnames from "classnames";

import { Icon } from "../icon/Icon";

interface IProps {
  value: string;
  name: string;
  locked?: boolean;
  className?: string;
  placeholderValue?: string;
}

export const ReadOnly: React.SFC<IProps> = ({
  value,
  name,
  placeholderValue,
  locked,
  className,
  ...otherProps
}) => {
  const lockedClasses = "sk-cursor-not-allowed";
  const defaultClasses = "hover:sk-bg-grey-lightest";
  const classes = classnames(
    "sked-read-only group",
    {
      "sk-text-grey": !value,
      [defaultClasses]: !locked,
      [lockedClasses]: locked,
    },
    className
  );
  const iconClasses =
    "sk-flex-shrink-0 sk-invisible group-hover:sk-fill-navy group-hover:sk-visible group-hover:sk-text-grey sk-mx-2 sk-pointer-events-none";

  return (
    <div className="sk-flex">
      <div
        className={classes}
        data-sk-input-id={name}
        data-read-only={!locked}
        {...otherProps}
      >
        {value || placeholderValue || "None"}{" "}
        <Icon
          name={locked ? "locked" : "edit"}
          size={14}
          className={iconClasses}
        />
      </div>
    </div>
  );
};
