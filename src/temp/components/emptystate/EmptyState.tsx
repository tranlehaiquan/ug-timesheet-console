import * as React from "react";
import classnames from "classnames";

interface IEmptyState extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  title: string;
  message: string;
  className?: string;
}

export const EmptyState: React.SFC<IEmptyState> = ({
  imgSrc,
  title,
  message,
  className,
  children,
  ...otherProps
}) => {
  return (
    <div
      className={classnames("sk-text-center sk-leading-normal", className)}
      {...otherProps}
    >
      <img src={imgSrc} className="sk-w-24" />
      <div className="sk-pt-5 sk-font-medium sk-text-base sk-text-navy-lighter">
        {title}
      </div>
      <div className="sk-text-navy-lighter sk-font-normal sk-text-sm sk-mb-4">
        {message}
      </div>
      {children}
    </div>
  );
};
