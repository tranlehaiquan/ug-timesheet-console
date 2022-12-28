import * as React from "react";
import classnames from "classnames";

import { Icon } from "../../icon/Icon";
import { Button } from "../../buttons/button/Button";
import { FilterPillProps } from "../interfaces";

export const FilterPill: React.RefForwardingComponent<
  HTMLDivElement,
  FilterPillProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(
  (
    {
      name,
      selected = [],
      isActive = false,
      fixed = false,
      onClick,
      onRemove,
      classNames,
    },
    ref
  ) => {
    const [width, setWidth] = React.useState<number>(null);
    const labelsRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (labelsRef.current) {
        const element = labelsRef.current;
        const nextElement = element.nextElementSibling as HTMLElement;
        const parentElement = element.parentNode as HTMLElement;

        const buttonWidth = element.nextElementSibling
          ? nextElement.offsetWidth
          : 0;
        const isOverflow =
          element.clientWidth + buttonWidth > parentElement.offsetWidth;
        isOverflow && setWidth(parentElement.offsetWidth - buttonWidth);
      }
    }, [onRemove]);

    return (
      <div
        ref={ref}
        data-sk-name="sk-added-filter"
        className={classnames(
          "sk-flex sk-flex-no-wrap sk-whitespace-no-wrap sk-max-w-xs sk-border sk-border-solid sk-rounded sk-items-center hover:sk-bg-blue-lightest",
          {
            "sk-cursor-default": fixed,
            "sk-cursor-pointer": !fixed,
            "sk-border-blue-600 sk-bg-blue-lightest": !fixed && isActive,
            "sk-border-transparent sk-bg-grey-lightest": fixed || !isActive,
          },
          classNames
        )}
      >
        <div
          data-sk-name="sk-sk-added-filter-handler"
          ref={labelsRef}
          style={{ maxWidth: width || "" }}
          onClick={onClick}
          className={classnames(
            "sk-px-3 sk-py-2 sk-m-0 sk-border-0 sk-max-h-4 sk-max-w-full sk-flex sk-flex-no-wrap sk-items-baseline",
            { "sk-pr-0": !fixed && !!onRemove }
          )}
        >
          {name && <NameRenderer name={name} />}
          {!!selected.length && (
            <SelectionRenderer
              selected={selected}
              className={name ? "sk-ml-1" : ""}
            />
          )}
        </div>
        {!fixed && onRemove && (
          <Button
            onClick={onRemove}
            data-sk-name="sk-remove-filter"
            buttonType="transparent"
            className="sk-px-3 sk-py-1 sk-m-0 sk-border-0 sk-text-grey hover:sk-text-navy-light"
          >
            <Icon name="remove" size={8} />
          </Button>
        )}
      </div>
    );
  }
);

const NameRenderer: React.FC<{ name: string }> = ({ name }) => (
  <span className="sk-text-xs sk-font-regular sk-text-navy-light">{name}:</span>
);

const selectionClassNames =
  "sk-text-sm sk-font-medium sk-text-navy sk-truncate sk-max-w-full";

const SelectionRenderer: React.FC<{
  selected: string[];
  className: string;
}> = ({ selected, className }) => {
  return selected.length !== 2 ? (
    <div className={classnames(selectionClassNames, className)}>
      {selected.length > 2
        ? `${selected.length} selected`
        : selected.join(", ")}
    </div>
  ) : (
    <SelectionRendererEdge selected={selected} className={className} />
  );
};
const SelectionRendererEdge: React.FC<{
  selected: string[];
  className: string;
}> = ({ selected, className }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [firstTruncated, setFirstTruncated] = React.useState<boolean>(null);

  React.useEffect(() => {
    if (!!ref.current && typeof firstTruncated === "undefined") {
      setFirstTruncated(ref.current.clientWidth < ref.current.scrollWidth);
    }
  }, [firstTruncated]);

  React.useEffect(() => {
    setFirstTruncated(undefined);
  }, [selected[0]]);
  return (
    <div className={classnames(selectionClassNames, className)} ref={ref}>
      {typeof firstTruncated === "undefined"
        ? `${selected[0]}, .......`
        : firstTruncated
        ? `${selected.length} selected`
        : selected.join(", ")}
    </div>
  );
};
