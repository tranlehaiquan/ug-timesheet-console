import * as React from "react";
import classnames from "classnames";

export interface IPropsSub extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export const Menu: React.FC<IPropsSub> = ({
  children,
  className = "",
  ...props
}) => {
  const ulClasses = "sk-list-none";
  const menuItemClasses =
    "menu-min-width sk-cursor-pointer sk-text-sm sk-text-navy sk-font-normal sk-bg-white sk-max-w-xs sk-mt-1 sk-py-1 sk-border sk-border-solid sk-border-grey-lighter sk-shadow sk-rounded-medium";

  return (
    <ul
      {...props}
      className={classnames(ulClasses, menuItemClasses, className)}
    >
      {children}
    </ul>
  );
};

export const MenuItem: React.FC<IPropsSub> = ({
  children,
  className = "",
  ...props
}) => {
  const liClasses = "sk-py-2 hover:sk-bg-grey-lightest sk-px-3 sk-break-words";
  return (
    <li {...props} className={classnames(liClasses, className)}>
      {children}
    </li>
  );
};
