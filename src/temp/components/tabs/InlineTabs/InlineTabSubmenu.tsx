import * as React from "react";
import classNames from "classnames";

import { Menu, MenuItem } from "../../menu/Menu";

export interface SubmenuItem {
  name: string;
  id: string;
  icon?: string;
  iconClasses?: string;
}

interface IProps extends React.HTMLAttributes<HTMLUListElement> {
  items: SubmenuItem[];
  activeItem: SubmenuItem["id"];
  onItemClick: (itemId: SubmenuItem["id"]) => () => void;
  onMouseLeave: () => void;
}

export const MenuNotification = ({
  text,
  className,
  ...otherProps
}: {
  text: string;
  className: string;
}) => (
  <div
    {...otherProps}
    className={classNames(
      "sk-w-5 sk-h-5 sk-rounded-full sk-bg-blue-lightest sk-inline-block sk-ml-1",
      className
    )}
  >
    <p className="sk-text-blue-600 sk-font-semibold sk-text-xxs sk-m-0 sk-flex sk-justify-center sk-items-center sk-h-full">
      {text}
    </p>
  </div>
);

export const InlineTabSubmenu = ({
  items,
  onMouseLeave,
  activeItem,
  onItemClick,
  ...otherProps
}: IProps) => (
  <Menu onMouseLeave={onMouseLeave}>
    {items.map((item) => (
      <MenuItem
        key={item.id}
        onClick={onItemClick(item.id)}
        className={classNames({
          "sk-text-navy sk-font-semibold": activeItem === item.id,
        })}
      >
        {item.name}
        {item.icon && (
          <MenuNotification
            text={item.icon}
            className={item.iconClasses || ""}
          />
        )}
      </MenuItem>
    ))}
  </Menu>
);
