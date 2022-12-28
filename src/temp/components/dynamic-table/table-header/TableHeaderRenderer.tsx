import * as React from "react";
import classnames from "classnames";

import { TableConfigColumns, sortDirection } from "../DynamicTable-utils";
import { Icon } from "../../icon/Icon";
import { FormInputElement } from "../../forms/FormElements";
import { TableHead, IHeaderCell } from "../../table/Table";

interface Props<T> extends React.HTMLAttributes<HTMLElement> {
  columns: TableConfigColumns<T>[];
  sortHandler?: (
    key: string,
    customSortingFunction: (
      data: T[],
      key: string,
      order: sortDirection
    ) => T[],
    sortDirection: sortDirection
  ) => (event?: React.MouseEvent<SVGElement>) => void;
  sortBy?: string;
  sortDirection?: sortDirection;
  className?: string;
  selectAll?: boolean;
  selectable?: boolean;
  selectChecked?: boolean;
  onSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resizable?: boolean;
  expandable?: boolean;
  fixedColumn?: boolean;
}

type ArrowGenericComponent = <T>(
  props: Props<T>
) => React.ReactElement<Props<T>>;

export const TableHeaderRenderer: ArrowGenericComponent = (props) => {
  const { className, selectable, expandable, fixedColumn } = props;

  return (
    <TableHead
      cells={[
        ...(selectable
          ? [
              {
                minWidth: 1,
                width: 1,
                name: "select-all",
                resizable: false,
                className: classnames({ "sked-fixed-cell-head": fixedColumn }),
                content: () => selectCell(props),
              },
            ]
          : []),
        ...dynamicCells(props),
        ...(expandable
          ? [
              {
                minWidth: 34,
                width: 34,
                name: "expand",
                resizable: false,
                className: classnames("sked-table-header-cell"),
                content: () => <></>,
              },
            ]
          : []),
      ]}
      className={className}
    />
  );
};

const selectCell: ArrowGenericComponent = ({
  selectAll,
  onSelect,
  selectChecked,
}) => (
  <span>
    {selectAll && (
      <FormInputElement
        type="checkbox"
        id="select-all"
        onChange={onSelect}
        checked={!!selectChecked}
      />
    )}
  </span>
);

const dynamicCells = <T extends {}>({
  columns,
  selectable,
  fixedColumn,
  sortBy,
  sortDirection,
  sortHandler,
}: Props<T>): IHeaderCell[] =>
  columns.map((cell: TableConfigColumns<T>, index: number) => {
    const {
      name,
      key,
      width,
      headerCellClasses,
      sortable,
      sortingFunction,
      resizable,
    } = cell;
    const label = name || (key as string);
    const isSorted = sortBy === key;
    const isFixed = fixedColumn && !selectable && index === 0;
    const isFixedWithSelect = fixedColumn && selectable && index === 0;
    return {
      resizable,
      width,
      name: label,
      className: classnames(
        "sked-table-header-cell",
        headerCellClasses || "",
        { "sked-fixed-cell-head": isFixed },
        { "sked-fixed-cell-head-selectable": isFixedWithSelect }
      ),
      content: (label) => (
        <div>
          <div
            key={`${label}-${index}`}
            className={classnames("sked-table-header-cell-label")}
          >
            {label}
            {sortable &&
              (isSorted ? (
                <div
                  data-sk-name="sort-icon"
                  className={classnames("sked-table-header-cell-icon", {
                    "sked-table-header-cell-icon--sortedBy": isSorted,
                  })}
                >
                  <Icon
                    name={sortDirection === "asc" ? "arrowUp" : "arrowDown"}
                    size={12}
                    onClick={sortHandler(
                      key as string,
                      sortingFunction,
                      sortDirection
                    )}
                  />
                </div>
              ) : (
                <div
                  data-sk-name="sort-icon"
                  className={classnames("sked-table-header-cell-icon")}
                >
                  <Icon
                    name={"arrowDown"}
                    size={12}
                    onClick={sortHandler(
                      key as string,
                      sortingFunction,
                      "desc"
                    )}
                  />
                </div>
              ))}
          </div>
          {(isFixed || isFixedWithSelect) && (
            <div className="sked-table-fixed-column-shadow-br" />
          )}
        </div>
      ),
    };
  });
