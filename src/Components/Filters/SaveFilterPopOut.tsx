import React, { useState } from "react";

import {
  Button,
  FormElementWrapper,
  FormInputElement,
  FormLabel,
  Icon,
  PopOutBase,
} from "skedulo-ui";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "src/StoreV2/store";

import ReduxDataTypes from "src/StoreV2/DataTypes";

import { isEqual } from "lodash";
import {
  setSavedFilter,
  setSelectedSavedFilter,
} from "../../StoreV2/slices/filterSlice";
import { dataService } from "../../Services/DataServices";
import { toastMessage } from "../../common/utils/notificationUtils";

const SaveFilterPopOut: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter.filterValues);
  const savedFilters = useSelector(
    (state: RootState) => state.filter.savedFilters
  );
  const selectedSavedFilter = useSelector(
    (state: RootState) => state.filter.selectedSavedFilter
  );
  const dateRange = useSelector((state: RootState) => state.filter.dateRange);
  const dateRangeType = useSelector(
    (state: RootState) => state.filter.dateRangeType
  );
  const userId = useSelector((state: RootState) => state.user.id);

  const [name, setName] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const excludedFilterName: string[] = savedFilters.map(
    (item: { filterName: string }) => item.filterName
  );

  const isDuplicatedName = !!name && excludedFilterName.includes(name);

  const isFilterChange = () => {
    if (!selectedSavedFilter) return false;

    const currentFilterSet: ReduxDataTypes.FilterSet[] = filters.map(
      ({ name, filterValues }) => {
        return {
          name,
          filterValues,
        };
      }
    );

    const filterSelectChanged = !isEqual(
      selectedSavedFilter.filterSet,
      currentFilterSet
    );
    const dateRangeChanged = !isEqual(selectedSavedFilter.dateRange, dateRange);

    return filterSelectChanged || dateRangeChanged;
  };

  const getPreference = async () => {
    try {
      const configPreference = await dataService.fetchConfigPreference();

      if (
        configPreference.timesheetConsoleFilter &&
        configPreference.timesheetConsoleFilter.length
      ) {
        dispatch(setSavedFilter(configPreference.timesheetConsoleFilter));
      }
    } catch (error) {
      toastMessage.error("Fetch saved filter failed!");
    }
  };

  const onSaveFilter = async (filterName: string) => {
    try {
      const filterSet: ReduxDataTypes.FilterSet[] = filters.map((filter) => {
        return {
          name: filter.name,
          filterValues: filter.filterValues,
        };
      });

      await dataService.addConfigPreference({
        timesheetConsoleFilter: [
          ...savedFilters,
          {
            filterName,
            filterSet,
            userId,
            isPrivate,
            dateRange,
            dateRangeType,
          },
        ],
      });
      await getPreference();
      dispatch(
        setSelectedSavedFilter({
          filterName,
          filterSet,
          userId,
          isPrivate,
          dateRange,
          dateRangeType,
        })
      );
    } catch (error) {
      toastMessage.error("Saved failed!");
    } finally {
      setName(null);
      setIsPrivate(false);
    }
  };

  const onSubmit = () => {
    onSaveFilter(name);
    setName("");
    setVisible(false);
  };

  const saveChanges = async () => {
    try {
      const filterSet: ReduxDataTypes.FilterSet[] = filters.map((filter) => {
        return {
          name: filter.name,
          filterValues: filter.filterValues,
        };
      });

      const savedFiltersNotChange = savedFilters.filter(
        (filter) => filter.filterName !== selectedSavedFilter.filterName
      );

      await dataService.addConfigPreference({
        timesheetConsoleFilter: [
          ...savedFiltersNotChange,
          {
            ...selectedSavedFilter,
            filterSet,
            dateRange,
            dateRangeType,
          },
        ],
      });
      await getPreference();
      dispatch(
        setSelectedSavedFilter({
          ...selectedSavedFilter,
          filterSet,
          dateRange,
          dateRangeType,
        })
      );
    } catch (error) {
      toastMessage.error("Saved failed!");
    }
  };

  return (
    <>
      <PopOutBase
        visible={visible}
        trigger={
          <Button
            buttonType="secondary"
            className="sk-pl-2 sk-pr-2"
            onClick={() => setVisible(true)}
          >
            <Icon name="bookmark" />
          </Button>
        }
      >
        <div className="sk-p-4 sk-w-1/6 sk-bg-white sk-border">
          <div className="sk-mb-4">
            <FormLabel optional={false}>Filter Name</FormLabel>
            <FormElementWrapper
              validation={{
                isValid: !isDuplicatedName,
                error: isDuplicatedName ? "Duplicated name" : "",
              }}
            >
              <FormInputElement
                className="sk-mt-2 sk-mb-2"
                name=""
                onChange={(e) => setName(e.target.value)}
              />
            </FormElementWrapper>
            <FormElementWrapper>
              <FormInputElement
                inlineLabel="Save as private"
                type="checkbox"
                name=""
                onChange={(e) => setIsPrivate(Boolean(e.target.value))}
              />
            </FormElementWrapper>
          </div>
          <div className="sk-flex sk-justify-end border-top sk-bg-white sk-bottom-0 sk-sticky">
            <Button buttonType="secondary" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button
              buttonType="primary"
              className="sk-ml-2"
              onClick={() => onSubmit()}
              disabled={!name || isDuplicatedName}
            >
              Save
            </Button>
          </div>
        </div>
      </PopOutBase>
      {isFilterChange() && (
        <Button
          buttonType="primary"
          className="sk-ml-2"
          onClick={() => saveChanges()}
        >
          Save changes
        </Button>
      )}
    </>
  );
};

export default SaveFilterPopOut;
