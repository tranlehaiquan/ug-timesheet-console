import * as React from "react";
import icons from "./iconPaths";
import classNames from "classnames";

export type IconNames = keyof typeof icons;

interface IProps extends React.SVGAttributes<SVGElement> {
  /**
   * Name of the icon
   */
  name: IconNames;
  /**
   * className applied to the containing div
   */
  className?: string;
  /**
   * Size of the icon to override the default (pixels)
   */
  size?: number;
  /**
   * Function to call on click
   */
  onClick?: (event?: React.MouseEvent<SVGElement>) => void;
}

const DEFAULT_SIZE = 18;

/**
 * The Icon component should be used whenever an icon needs to be displayed. It will naturally inherit any text colour but this can be changed by supplied a class directly. Default size of 18px/18px.
 */
export const Icon = ({
  name,
  className,
  size,
  onClick,
  ...otherProps
}: IProps) => {
  const Component = icons[name];
  return (
    <Component
      {...otherProps}
      height={size || DEFAULT_SIZE}
      width={size || DEFAULT_SIZE}
      onClick={onClick}
      className={classNames("sk-flex-shrink-0 sk-fill-current", className)}
    />
  );
};
