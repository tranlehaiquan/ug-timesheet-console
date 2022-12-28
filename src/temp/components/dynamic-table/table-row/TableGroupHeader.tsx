import * as React from "react";

import { TableConfig } from "../DynamicTable-utils";
import { TableRow } from "../../table/Table";
import { Badge } from "../../badge/Badge";

interface ITableGroupHeaderProps<T> {
  name: string;
  config: TableConfig<T>;
  groupSize: number;
}

export const TableGroupHeader: <T>(
  props: ITableGroupHeaderProps<T>
) => React.ReactElement<T> = ({ name, config: { columns }, groupSize }) => (
  <TableRow className="sk-bg-grey-lightest sk-text-navy-lighter">
    <td
      className="sk-px-5 sk-py-2 sk-text-xxs sk-uppercase"
      colSpan={columns.length + 1}
    >
      <span className="sk-mr-3 sk-font-medium sk-tracking-wide">{name}</span>
      <Badge
        badgeType={"neutral"}
        count={groupSize}
        countLimiter={groupSize + 1}
      />
    </td>
  </TableRow>
);
