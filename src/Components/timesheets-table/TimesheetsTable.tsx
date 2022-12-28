import React from "react";
import { connect } from "react-redux";

import {
  DynamicTable,
  TableConfig,
  // TableTotalConfig
  Pagination,
} from "skedulo-ui";

import { get } from "lodash";
import { ReduxDataTypes } from "src/StoreV2/DataTypes";
import { resetOrder, setOrder } from "../../StoreV2/slices/orderSlice";

// import Stats from '../../components/Stats'
// import ActionBar from '../ActionBar'
import {
  metersToKilometers,
  metersToMiles,
} from "../../common/utils/distanceUnits";

import {
  getTSEntryColumns,
  getTableOptions,
  // getTotalConfig,
  // TimesheetTableTotalItem
} from "./TableConfig";
// import { filterBySearchPhrase } from './tableFilters'
import UpdateStatusModal, {
  UpdateStatusModalProps,
  SingleUpdateModalAction,
} from "./UpdateStatusModal";

import "./TimesheetsTable.scss";
import { RootState } from "../../StoreV2/store";
import { ITEMS_PER_PAGE } from "../../../src/common/constants/timeSheetEntry";
import {
  selectTimeSheetByEntryId,
  selectTimeSheetEntryById,
} from "../../StoreV2/slices/timeSheetEntriesSlice";
import { setLoading } from "../../StoreV2/slices/globalLoading/globalLoadingSlice";

export type TimesheetStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

interface TimeSheetEntryTableProps {
  timeSheetEntries: ReduxDataTypes.TimesheetEntry[];
  showLoading: boolean;
  onSubmit: (timesheetId: string | string[], comment: string) => void;
  onReject: (timesheetId: string | string[], comment: string) => void;
  onApprove: (timesheetId: string | string[], comment: string) => void;
  onRecall: (timesheetId: string, timesheetStatus: TimesheetStatus) => void;
  onDelete: (timesheetId: string) => void;
  onSelect?: (selectedTimesheetsUIDs: Set<string>) => void;
  handlePageChange: (currentPage: number) => void;
  settings: ReduxDataTypes.Settings;
  currentPage: number;
  totalTSEntries: number;
  selectedTimesheetEntryUIDs: Set<string>;
  searchValue: string;
  setOrder: typeof setOrder;
  resetOrder: typeof resetOrder;
  setLoading: typeof setLoading;
}

interface TimeSheetEntryTableState {
  tableConfig: TableConfig<ReduxDataTypes.TimesheetEntry>;
  // totalConfig: TableTotalConfig<
  //   ReduxDataTypes.TimesheetTableItem,
  //   TimesheetTableTotalItem
  // >
  formattedItems: ReduxDataTypes.TimesheetEntry[];
  expandedRowUID: string;
  updateStatusModalProps: Partial<UpdateStatusModalProps>;
}

class TimesheetsTable extends React.Component<
  TimeSheetEntryTableProps,
  TimeSheetEntryTableState
> {
  constructor(props: TimeSheetEntryTableProps) {
    super(props);
    this.state = {
      tableConfig: {
        options: {
          ...getTableOptions({ onSelect: this.onTimesheetSelect }),
          sortable: {
            onSort: this.onSort,
          },
        },
        columns: getTSEntryColumns(
          {
            onApprove: (timeSheetEntryId: string) => {
              this.openSingleUpdateModal(
                timeSheetEntryId,
                "approve",
                props.onApprove
              );
            },
            onSubmit: (timeSheetEntryId: string) => {
              this.openSingleUpdateModal(
                timeSheetEntryId,
                "submit",
                props.onSubmit
              );
            },
            onRecall: this.onTimesheetStatusRecall,
            onReject: (id: string) => {
              this.openSingleUpdateModal(id, "reject", props.onReject);
            },
            onDelete: (id: string) => {
              props.onDelete(id);
            },
          },
          this.props.settings.defaultTimezone
        ),
      },
      // totalConfig: getTotalConfig(),
      formattedItems: this.props.timeSheetEntries,
      expandedRowUID: "",
      updateStatusModalProps: { isOpened: false },
    };
  }

  componentDidUpdate(prevProps: TimeSheetEntryTableProps) {
    if (
      prevProps.settings !== this.props.settings ||
      prevProps.timeSheetEntries !== this.props.timeSheetEntries ||
      prevProps.searchValue !== this.props.searchValue
    ) {
      this.setState({
        formattedItems: this.filterTSEntryByResourceName(
          this.formatItems(this.props.timeSheetEntries)
        ),
      });
    }
  }

  onSort = async (
    sortedData?: ReduxDataTypes.TimesheetEntry[],
    sortedBy?: string,
    sortDirection?: string
  ) => {
    this.props.setOrder({
      field: sortedBy,
      direction: sortDirection as "desc" | "acs",
    });
  };

  openSingleUpdateModal = (
    timesheetEntryId: string,
    action: SingleUpdateModalAction,
    onConfirm: (timesheetEntryId: string | string[], comment: string) => void
  ) => {
    this.setState({
      updateStatusModalProps: {
        action,
        timeSheetEntry: selectTimeSheetEntryById(
          this.props.timeSheetEntries,
          timesheetEntryId
        ),
        onConfirm: (comment: string) => onConfirm(timesheetEntryId, comment),
        isOpened: true,
        timesheetsCount: 1,
        timesheetsToUpdateCount: 1,
        onClose: this.closeUpdateStatusModal,
      },
    });
  };

  closeUpdateStatusModal = () =>
    this.setState({ updateStatusModalProps: { isOpened: false } });

  formatItems(items: ReduxDataTypes.TimesheetEntry[]) {
    return items && items.map((item) => this.formatItem(item));
  }

  formatItem(item: ReduxDataTypes.TimesheetEntry) {
    const distanceUnitSet = this.props.settings.distanceUnit;
    if (item.Distance && item.DistanceUnit !== distanceUnitSet) {
      return {
        ...item,
        DistanceUnit: distanceUnitSet,
        Distance:
          distanceUnitSet === "MI"
            ? metersToMiles(item.Distance)
            : metersToKilometers(item.Distance),
        Entries: this.formatItemEntries(item.Entries),
      };
    }

    return item;
  }

  formatItemEntries(entries: ReduxDataTypes.TimesheetEntry[]) {
    const distanceUnitSet = this.props.settings.distanceUnit;
    return (
      entries &&
      entries.map((entry) => {
        if (entry.Distance) {
          return {
            ...entry,
            DistanceUnit: distanceUnitSet,
            Distance:
              distanceUnitSet === "MI"
                ? metersToMiles(entry.Distance)
                : metersToKilometers(entry.Distance),
          };
        }

        return entry;
      })
    );
  }

  filterTSEntryByResourceName = (
    tsEntries: ReduxDataTypes.TimesheetEntry[]
  ): ReduxDataTypes.TimesheetEntry[] => {
    return tsEntries.filter((entry) => {
      const resourceName =
        (get(entry, "Timesheet.Resource.Name") as string) || "";
      const isMatching = resourceName
        .toLowerCase()
        .includes(this.props.searchValue.toLowerCase());
      return !!isMatching;
    });
  };

  onTimesheetStatusRecall = (timeSheetEntryID: string) => {
    const timeSheet = selectTimeSheetByEntryId(
      this.props.timeSheetEntries,
      timeSheetEntryID
    );
    this.props.onRecall(timeSheetEntryID, timeSheet!.Status);
  };

  onTimesheetSelect = (
    _: keyof ReduxDataTypes.TimesheetEntry,
    selectedTimesheetsUIDs: Set<string>
  ) => {
    if (this.props.onSelect) {
      this.props.onSelect(selectedTimesheetsUIDs);
    }
  };

  onPageChange = (page: number) => {
    this.props.handlePageChange(page);
    if (this.props.onSelect) {
      this.props.onSelect(new Set());
    }
  };

  renderNoTimesheetsPlaceholder() {
    return (
      <div className="sk-flex sk-items-center sk-justify-center sk-w-full">
        <span className="sk-text-xs sk-mt-12 sk-mb-8">
          No timesheet entries available
        </span>
      </div>
    );
  }

  render() {
    if (this.state.formattedItems.length === 0) {
      return this.renderNoTimesheetsPlaceholder();
    }

    return (
      <div className="timesheets-table">
        <section className="timesheets-table__section timesheets-table__dynamic-table">
          <DynamicTable
            data={this.state.formattedItems}
            config={this.state.tableConfig}
            selection={this.props.selectedTimesheetEntryUIDs}
            // totalConfig={ this.state.totalConfig }
            expandedRows={new Set([this.state.expandedRowUID])}
            onRowExpand={(uid) =>
              this.setState((state) => ({ ...state, expandedRowUID: uid }))
            }
          />
        </section>
        {this.props.timeSheetEntries.length > 0 && (
          <section className="timesheets-table__section timesheets-table__pagination">
            <Pagination
              itemsTotal={this.props.totalTSEntries}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={this.props.currentPage}
              onPageChange={this.onPageChange}
            />
          </section>
        )}
        <UpdateStatusModal
          {...(this.state.updateStatusModalProps as UpdateStatusModalProps)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  timeSheetEntries: state.timeSheetEntries.values || [],
  totalTSEntries: state.timeSheetEntries.totalCount,
  showLoading: state.timeSheetEntries.loading || false,
  settings: state.setting,
});

const mapDispatchToProps = {
  setOrder,
  resetOrder,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetsTable);
