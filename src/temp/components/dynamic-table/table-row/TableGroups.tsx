import * as React from "react";

import { TableConfig, GroupedData } from "../DynamicTable-utils";
import { TableRows } from "./TableRows";
import { TableGroupHeader } from "./TableGroupHeader";

interface ITableGroupsProps<T> {
  groupedData: GroupedData<T>[];
  config: TableConfig<T>;
  selection: Set<any>;
  onSelect: (key: any) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  fixedColumn: boolean;
}

export const TableGroups: <T>(
  props: ITableGroupsProps<T>
) => React.ReactElement<T> = ({
  groupedData,
  config,
  selection,
  onSelect,
  fixedColumn,
}) => {
  return (
    <>
      {groupedData.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          <TableGroupHeader
            config={config}
            name={group.name}
            groupSize={group.data.length}
          />
          <TableRows
            config={config}
            data={group.data}
            selection={selection}
            onSelect={onSelect}
            fixedColumn={fixedColumn}
          />
        </React.Fragment>
      ))}
    </>
  );
};
