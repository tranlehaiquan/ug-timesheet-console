import * as React from "react";
import classnames from "classnames";

import { IconNames, Icon } from "../icon/Icon";

type BannerType = "general" | "success" | "warning" | "error";

export interface IInlineBannerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type: BannerType;
  /**
   * The type of banner. (general, success, warning or error)
   */
  className?: string;
}

interface InlineBannerStyleSet {
  icon: IconNames;
  classes: string;
  iconBackgroundClasses: string;
}

/**
 * Displays a inline banner with various styling depending on the type.
 */
export const InlineBanner: React.FC<IInlineBannerProps> = ({
  type,
  className,
  children,
  ...otherProps
}) => {
  const bannerStyleSet: { [name: string]: InlineBannerStyleSet } = {
    general: {
      classes: "sk-bg-blue-lighter",
      icon: "info",
      iconBackgroundClasses: "sk-bg-blue",
    },
    success: {
      classes: "sk-bg-green-lightest",
      icon: "tick",
      iconBackgroundClasses: "sk-bg-green",
    },
    error: {
      classes: "sk-bg-red-lightest",
      icon: "exclamation",
      iconBackgroundClasses: "sk-bg-red",
    },
    warning: {
      classes: "sk-bg-orange-lightest",
      icon: "exclamation",
      iconBackgroundClasses: "sk-bg-orange",
    },
  };

  const defaultClasses =
    "sk-text-navy sk-text-sm sk-font-medium sk-flex sk-items-center sk-w-full sk-py-3 sk-rounded";
  const { icon, classes, iconBackgroundClasses } = bannerStyleSet[type] || {
    classes: "",
    icon: null,
    iconBackgroundClasses: "",
  };

  return (
    <div
      {...otherProps}
      className={classnames(defaultClasses, classes, className)}
    >
      <div
        className={classnames(
          "sk-flex sk-justify-center sk-items-center sk-rounded-full sk-mx-3 sk-w-5 sk-h-5",
          iconBackgroundClasses
        )}
      >
        <Icon name={icon} size={10} className="sk-text-white" />
      </div>
      {children}
    </div>
  );
};
