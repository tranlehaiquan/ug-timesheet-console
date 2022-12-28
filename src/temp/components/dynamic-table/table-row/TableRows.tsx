import * as React from "react";

import { TableConfig } from "../DynamicTable-utils";
import { TableRowRenderer } from "./TableRowRenderer";
import { Option } from "../../../utils/Option";

interface ITableRowsProps<T> {
  data: T[];
  config: TableConfig<T>;
  selection: Set<any>;
  onSelect: (key: any) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  fixedColumn: boolean;
  expandedRows?: Set<any>;
  onExpand?: (key: any) => void;
}

export const TableRows: <T>(
  props: ITableRowsProps<T>
) => React.ReactElement<ITableRowsProps<T>> = ({
  data,
  config,
  selection,
  onSelect,
  fixedColumn,
  expandedRows,
  onExpand,
}) => {
  const { rowClasses } = config;

  const selectBy = Option.of(config)
    .next("options")
    .next("selectable")
    .next("selectBy")
    .getOrElse(null);

  return (
    <>
      {data.map((row, rowIndex) => (
        <TableRowRenderer
          key={rowIndex}
          rowData={row}
          config={config}
          rowIndex={rowIndex}
          className={rowClasses || ""}
          selectChecked={selectBy && selectStatus(row[selectBy], selection)}
          onSelect={onSelect}
          fixedColumn={fixedColumn}
          isExpanded={expandedRows && expandedRows.has(row[selectBy])}
          onExpand={onExpand}
        />
      ))}
    </>
  );
};

const selectStatus = (value: any, selection: Set<any>) => {
  if (selection.size === 0) {
    return false;
  }

  return selection.has(value);
};
