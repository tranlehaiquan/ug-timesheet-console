import * as React from "react";
import classnames from "classnames";

export type BadgeTypes = "default" | "primary" | "important" | "neutral";

interface IProps {
  /**
   * Value to be displayed in badge
   */
  count: number;
  /**
   * Optional value to indicate when count should be truncated with '+' (default 99)
   */
  countLimiter?: number;
  /**
   * The type of badge to be displayed. Default | Primary | Important | Neutral (default 'primary')
   */
  badgeType?: BadgeTypes;
  className?: string;
}

export const Badge: React.SFC<IProps> = ({
  count = 0,
  countLimiter = 99,
  badgeType = "default",
  className,
}) => {
  const checkedCount = Math.max(0, count);
  const checkedCountLimiter = Math.max(1, countLimiter);
  const countText =
    checkedCount > checkedCountLimiter
      ? `${checkedCountLimiter}+`
      : `${checkedCount}`;

  return (
    <div
      className={classnames(
        "sked-badge-min-w",
        "sk-text-xxs sk-font-medium sk-tracking-wide sk-h-5 sk-pb-px sk-rounded-full sk-inline-flex sk-items-center sk-justify-center",
        { "sked-badge-wider": checkedCount > 9 || countLimiter < 9 },
        { "sk-text-blue sk-bg-blue-lightest": badgeType === "default" },
        { "sk-text-white sk-bg-blue": badgeType === "primary" },
        { "sk-text-white sk-bg-red": badgeType === "important" },
        { "sk-text-navy-light sk-bg-grey-lighter": badgeType === "neutral" },
        className
      )}
      data-sk-name={`sk-badge-${badgeType}`}
    >
      {countText}
    </div>
  );
};
