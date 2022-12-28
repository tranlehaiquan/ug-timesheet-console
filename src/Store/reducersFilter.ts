import { Dispatch } from "redux";
import {
  makeActionCreator,
  makeAsyncActionCreatorSimp,
  makeActionsSet,
} from "../common/utils/redux-helpers";
import ReduxDataTypes, { TimesheetStatus } from "./DataTypes";
import { getTimesheets } from "./reducersTimesheets";

const FILTERS_BUILD = "FILTERS_BUILD";
const FILTERS_VALUES_SET = "FILTERS_VALUES_SET";
const FILTERS_SETUP = makeActionsSet("FILTERS_SETUP");
const TIMESHEETS_FILTER = makeActionsSet("TIMESHEETS_FILTER");

// const PRESET_FILTERS = [
//   {
//     name: 'PrimaryRegion',
//     value: (options: string[]) => [[...options].sort()[0]]
//   }
// ]

const filtesrMap: {
  [index: string]: {
    label: string;
    selector: string;
  };
} = {
  Name: {
    label: "Resource",
    selector: "Resource.Name",
  },
  Category: {
    label: "Category",
    selector: "Resource.Category",
  },
  ResourceType: {
    label: "Resource Type",
    selector: "Resource.ResourceType",
  },
  WorkingHourType: {
    label: "Working Hour Type",
    selector: "Resource.WorkingHourType",
  },
  PrimaryRegion: {
    label: "Primary Region",
    selector: "Resource.PrimaryRegion.Name",
  },
};

const customFiltersOptionsMap: {
  [index: string]: (
    name: string,
    resources: ReduxDataTypes.Resource[]
  ) => string[];
} = {
  ResourceTags: createTagsFilterOptions,
  ResourceRegions: createRegionsFilterOptions,
  PrimaryRegion: createPrimaryRegionFilterOptions,
};

const createFilter = (
  name: keyof ReduxDataTypes.Resource,
  resources: ReduxDataTypes.Resource[]
) => {
  const options = customFiltersOptionsMap[name]
    ? customFiltersOptionsMap[name](name, resources)
    : createSimpleTypeFilterOptions(name, resources);

  options.sort();

  // const defFilter = PRESET_FILTERS.find(({ name: presetFilterName }) => presetFilterName === name)

  // return defFilter
  //   ? { name, options, selector: filtesrMap[name].selector, value: defFilter.value(options), preselected: defFilter.value(options), description: filtesrMap[name].label }
  //   : { name, options, selector: filtesrMap[name].selector, value: (null as string[]), description: filtesrMap[name].label }

  // UG-406 remove default filter (should be all by default)
  return {
    name,
    options,
    selector: filtesrMap[name].selector,
    value: null as string[],
    description: filtesrMap[name].label,
  };
};

function createSimpleTypeFilterOptions(
  name: keyof ReduxDataTypes.Resource,
  resources: ReduxDataTypes.Resource[]
) {
  const allOptions = new Set(
    resources
      .map((resource) => resource[name] as string)
      .filter((value) => value !== null)
  );

  return [...allOptions];
}

function createTagsFilterOptions(
  name: string,
  resources: ReduxDataTypes.Resource[]
) {
  const allTags = resources.reduce((acc: string[], resource) => {
    const tags = resource.ResourceTags.map(
      (resourceTags) => resourceTags.Tag.Name
    );
    return [...acc, ...tags];
  }, []);

  return [...new Set(allTags)];
}

function createRegionsFilterOptions(
  name: string,
  resources: ReduxDataTypes.Resource[]
) {
  const allRegions = resources.reduce((acc: string[], resource) => {
    const regions = resource.ResourceRegions.map(
      (resourceTags) => resourceTags.Region.Name
    );
    return [...acc, ...regions];
  }, []);

  return [...new Set(allRegions)];
}

function createPrimaryRegionFilterOptions(
  name: string,
  resources: ReduxDataTypes.Resource[]
) {
  const allRegions = resources.map((resource) => resource.PrimaryRegion.Name);
  return [...new Set(allRegions)];
}

const statusFilter = {
  description: "Status",
  name: "Status",
  selector: "Status",
  options: ["Draft", "Submitted", "Approved", "Rejected"],
  value: null as TimesheetStatus,
};

const buildFilters = (resources: ReduxDataTypes.Resource[]) => {
  const filterNames = Object.keys(
    resources[0] || {}
  ) as (keyof ReduxDataTypes.Resource)[];

  const filters = filterNames
    .filter((name) => !!filtesrMap[name])
    .map((name) => createFilter(name, resources));

  return [statusFilter, ...filters];
};

export const setupFiltersSimp = makeActionCreator(FILTERS_BUILD);
export const setupFilters = makeAsyncActionCreatorSimp(
  FILTERS_SETUP,
  () => (dispatch: Dispatch) => {
    dispatch(setupFiltersSimp());
    dispatch(getTimesheets());
  }
);

export const setFiltersValuesSimp = makeActionCreator(
  FILTERS_VALUES_SET,
  null,
  "values"
);
export const setFiltersValues = makeAsyncActionCreatorSimp(
  TIMESHEETS_FILTER,
  (values: { name: string; value: string[] }[]) => (dispatch: Dispatch) => {
    dispatch(setFiltersValuesSimp(values));
    dispatch(getTimesheets());
  }
);

export default {
  [FILTERS_BUILD]: (state: ReduxDataTypes.State) => ({
    ...state,
    filters: buildFilters(state.resources!),
  }),
  [FILTERS_VALUES_SET]: (
    state: ReduxDataTypes.State,
    { values }: { values: { name: string; value: string[] }[] }
  ) => ({
    ...state,
    filters: state.filters!.map((filter) => {
      const filterValue = values.find((value) => value.name === filter.name);
      return {
        ...filter,
        value: filterValue ? filterValue.value : null,
      };
    }),
  }),
};
