import * as React from "react";

export type sortDirection = "asc" | "desc";

export interface TableConfig<T> {
  columns: TableConfigColumns<T>[];
  condensed?: boolean;
  options?: {
    sortable?: {
      /**
       * function to handle data update
       * note: dynamic table dosen't store data in state,
       * so this function should update data prop
       */
      onSort: (
        sortedData?: T[],
        sortedBy?: string,
        sortDirection?: sortDirection
      ) => void;

      /**
       * default sort key
       */
      sortKey?: string;

      /**
       * default sort direction
       */
      initialSortDirection?: sortDirection;
    };
    selectable?: {
      /**
       * key for column with unique data to select by
       */
      selectBy: keyof T;
      onSelect: (selectBy: keyof T, selection: Set<any>, data: T[]) => void;
      /**
       * header select input indicator
       */
      selectAll?: boolean;
    };
    expandable?: {
      onExpand: (rowData: T) => React.ReactElement;
    };
    /**
     * fixed column indicator
     */
    fixedFirstColumn?: boolean;
  };

  /**
   * classes applied directly to <thead>
   */
  headerClasses?: string;

  /**
   * classes applied directly to <tr>
   */
  rowClasses?: string;
}

export interface TableConfigColumns<T, K extends keyof T = keyof T> {
  /**
   * key to determine which data should be presented in each column
   * used as default label if `name` is not provided
   */
  key: K;

  /**
   * sorting possibility indicator
   * @default false
   */
  sortable?: boolean;
  /**
   * custom sorting function
   */
  sortingFunction?(data: T[], key: string, order: sortDirection): T[];
  resizable?: boolean;
  /**
   * name used as label in header
   */
  name?: string;

  /**
   * width of the column (default: minWidth: '120px')
   */
  width?: number;
  /**
   * classes applied directly to <th>
   */
  headerCellClasses?: string;

  /**
   * classes applied directly to <td>
   */
  cellClasses?: string;

  /**
   * text displayed for no data cell (default: `No ${key} data`)
   */
  emptyPlaceholderText?: string;
  cellRenderer?: (
    cellData: T[K],
    row: T,
    index: number,
    rowIndex: number
  ) => React.ReactNode;
}

export interface GroupedData<T> {
  /**
   * name used as label in grouped header
   */
  name: string;

  /**
   * content to be displayed in grouped section
   */
  data: T[];
}

export interface TableTotalConfig<T, U> extends TableConfig<T> {
  getTotalData: (tableData: T[]) => U;
}
