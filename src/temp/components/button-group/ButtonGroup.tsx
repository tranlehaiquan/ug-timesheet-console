import * as React from "react";
import classNames from "classnames";

interface IButtonGroup extends React.HTMLProps<HTMLDivElement> {
  compact?: boolean;
}

export const ButtonGroup = (props: IButtonGroup) => {
  const { compact, className, ...otherProps } = props;
  const classes = classNames(
    "sked-button-group",
    { "sked-button-group--compact": compact },
    className
  );

  return (
    <div className={classes} {...otherProps}>
      {props.children}
    </div>
  );
};
