import React, { useCallback, useEffect } from "react";

import { Icon, Menu, MenuItem, PopOut, RangeType } from "skedulo-ui";

import { useSelector, useDispatch } from "react-redux";

import { RootState } from "src/StoreV2/store";

import ReduxDataTypes from "src/StoreV2/DataTypes";

import { startOfDay, endOfDay } from "date-fns";

import {
  setSavedFilter,
  setSelectedSavedFilter,
  setDateRange,
  setDateRangeType,
  setFilters,
  resetFilters,
} from "../../StoreV2/slices/filterSlice";
import { dataService } from "../../Services/DataServices";
import { toastMessage } from "../../common/utils/notificationUtils";

import "./SavedViews.scss";

const SavedViews: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const savedFilters = useSelector(
    (state: RootState) => state.filter.savedFilters
  );
  const selectedSavedFilter = useSelector(
    (state: RootState) => state.filter.selectedSavedFilter
  );
  const userId = useSelector((state: RootState) => state.user.id);

  const accessAbleSavedFilters = savedFilters.filter((item) => {
    return !item.isPrivate || item.userId === userId;
  });

  const getPreference = async () => {
    try {
      const configPreference = await dataService.fetchConfigPreference();

      if (configPreference.timesheetConsoleFilter) {
        if (configPreference.timesheetConsoleFilter.length) {
          dispatch(setSavedFilter(configPreference.timesheetConsoleFilter));
        } else {
          dispatch(setSavedFilter([]));
        }
      }
    } catch (error) {
      toastMessage.error("Fetch saved filter failed!");
    }
  };

  const applySavedFilter = (selectedFilter: ReduxDataTypes.SavedFilter) => {
    if (!selectedFilter && !selectedFilter.filterSet) return;

    const value = selectedFilter.filterSet.map(({ name, filterValues }) => {
      return {
        name,
        value: filterValues,
      };
    });

    dispatch(setFilters(value));
  };

  const onSelectSavedFilter = (
    event: React.MouseEvent,
    selectedFilter: ReduxDataTypes.SavedFilter
  ) => {
    event.stopPropagation();

    const filterDateRange: {
      startDate: Date | null;
      endDate: Date | null;
    } = {
      startDate: null,
      endDate: null,
    };
    if (selectedFilter.dateRange.startDate) {
      filterDateRange.startDate = startOfDay(
        new Date(selectedFilter.dateRange.startDate)
      );
    }
    if (selectedFilter.dateRange.endDate) {
      filterDateRange.endDate = endOfDay(
        new Date(selectedFilter.dateRange.endDate)
      );
    }

    applySavedFilter(selectedFilter);

    dispatch(setSelectedSavedFilter(selectedFilter));
    dispatch(setDateRange(filterDateRange));
    dispatch(setDateRangeType(selectedFilter.dateRangeType as RangeType));
  };

  const onRemoveFilter = async (
    event: React.MouseEvent,
    name: string,
    index: number
  ) => {
    event.stopPropagation();

    try {
      await dataService.addConfigPreference({
        timesheetConsoleFilter: savedFilters.filter(
          (item: Partial<ReduxDataTypes.SavedFilter>, idx: number) => {
            return item.filterName !== name && idx !== index;
          }
        ),
      });
      if (selectedSavedFilter && selectedSavedFilter.filterName === name) {
        dispatch(setSelectedSavedFilter(null));
        dispatch(resetFilters());
      }
      await getPreference();
    } catch (error) {
      toastMessage.error("Removed failed!");
    }
  };

  const myFilterSetsTrigger = useCallback(() => {
    return (
      <div className="my-filters-btn sk-leading-normal sk-flex sk-h-8 sk-max-w-auto sk-rounded sk-items-center sk-mr-2 sk-cursor-pointer sk-px-3 sk-text-neutral-750 hover:sk-bg-blue-light sk-bg-grey-lightest">
        <p>
          {selectedSavedFilter ? selectedSavedFilter.filterName : "Saved Views"}
        </p>
        <Icon name="chevronDown" size={8} />
      </div>
    );
  }, [selectedSavedFilter]);

  useEffect(() => {
    const initData = async () => {
      await getPreference();
    };

    initData();
  }, []);

  return (
    <PopOut placement="bottom" trigger={myFilterSetsTrigger}>
      {() => (
        <Menu>
          {!accessAbleSavedFilters.length && (
            <MenuItem className="sk-p-0" contentEditable={false}>
              <div className="sk-flex sk-justify-between sk-items-center sk-px-3 sk-py-2">
                <span className="sk-w-full">No saved items</span>
              </div>
            </MenuItem>
          )}
          {accessAbleSavedFilters.map(
            (item: ReduxDataTypes.SavedFilter, index: number) => (
              <MenuItem
                key={`${item.filterName}-${index}`}
                className="sk-p-0"
                onClick={(e) => onSelectSavedFilter(e, item)}
              >
                <div className="sk-flex sk-justify-between sk-items-center">
                  {/* tslint:disable-next-line: jsx-no-lambda */}
                  <p className="sk-w-full sk-px-3 sk-py-2">{item.filterName}</p>
                  <Icon
                    name="trash"
                    size={24}
                    className="sk-text-neutral-500 sk-pl-2"
                    /* tslint:disable-next-line: jsx-no-lambda */
                    onClick={(e) => onRemoveFilter(e, item.filterName, index)}
                  />
                </div>
              </MenuItem>
            )
          )}
        </Menu>
      )}
    </PopOut>
  );
};

export default SavedViews;
