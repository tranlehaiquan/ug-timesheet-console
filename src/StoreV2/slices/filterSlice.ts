import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import { format } from 'date-fns'
import ReduxDataTypes from '../DataTypes'
import { RootState } from '../store'

interface FilterState {
  filterValues: ReduxDataTypes.Filter[]
  dateRange: {startDate: string, endDate: string}
}

const SLICE_NAME = 'TIME_SHEET_FILTER'

export const getDefaultTimeRange = () => {
  function getMonday(date: Date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const today = getMonday(moment().toDate())
  const startDate = format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0), 'yyyy-MM-dd')
  const endDate = format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 23, 59, 59), 'yyyy-MM-dd')

  return {
    startDate,
    endDate
  }
}

const initialState: FilterState = {
  filterValues: [],
  dateRange: getDefaultTimeRange()
}

const buildFilters = (
  resources: ReduxDataTypes.Resource[]
): ReduxDataTypes.Filter[] => {
  const filterNames = Object.keys(
    resources[0] || {}
  ) as (keyof ReduxDataTypes.Resource)[]
  const statusFilter: ReduxDataTypes.Filter = {
    description: 'Status',
    name: 'Status',
    selector: 'Timesheet.Status',
    options: ['Draft', 'Submitted', 'Approved', 'Rejected'],
    value: []
  }

  const filtersMap: {
    [index: string]: {
      label: string
      selector: string
    }
  } = {
    Name: {
      label: 'Resource',
      selector: 'Timesheet.Resource.Name'
    },
    Category: {
      label: 'Category',
      selector: 'Timesheet.Resource.Category'
    },
    ResourceType: {
      label: 'Resource Type',
      selector: 'Timesheet.Resource.ResourceType'
    },
    WorkingHourType: {
      label: 'Working Hour Type',
      selector: 'Timesheet.Resource.WorkingHourType'
    },
    PrimaryRegion: {
      label: 'Primary Region',
      selector: 'Timesheet.Resource.PrimaryRegion.Name'
    }
  }

  function createSimpleTypeFilterOptions(
    name: keyof ReduxDataTypes.Resource,
    resources: ReduxDataTypes.Resource[]
  ) {
    const allOptions = new Set(
      resources
        .map(resource => resource[name] as string)
        .filter(value => value !== null)
    )

    return [...allOptions]
  }

  const createFilter = (
    name: keyof ReduxDataTypes.Resource,
    resources: ReduxDataTypes.Resource[]
  ) => {
    const options = customFiltersOptionsMap[name]
      ? customFiltersOptionsMap[name](name, resources)
      : createSimpleTypeFilterOptions(name, resources)

    options.sort()

    return {
      name,
      options,
      selector: filtersMap[name].selector,
      value: null as string[],
      description: filtersMap[name].label
    }
  }

  function createPrimaryRegionFilterOptions(
    name: string,
    resources: ReduxDataTypes.Resource[]
  ) {
    const allRegions = resources.map(resource => resource.PrimaryRegion.Name)
    return [...new Set(allRegions)]
  }

  const customFiltersOptionsMap: {
    [index: string]: (
      name: string,
      resources: ReduxDataTypes.Resource[]
    ) => string[]
  } = {
    PrimaryRegion: createPrimaryRegionFilterOptions
  }

  const filters = filterNames
    .filter(name => !!filtersMap[name])
    .map(name => createFilter(name, resources))

  return [statusFilter, ...filters]
}

export const filterSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    initFilters: (state, action: PayloadAction<ReduxDataTypes.Resource[]>) => {
      return {
        ...state,
        filterValues: buildFilters(action.payload)
      }
    },

    setFilters: (
      state,
      action: PayloadAction<{ name: string, value: string[] }[]>
    ) => {
      const parsedFilters = state.filterValues.map(filter => {
        const filterValue = action.payload.find(
          value => value.name === filter.name
        )
        return {
          ...filter,
          filterValues: filterValue ? filterValue.value : null
        }
      })

      return {
        ...state,
        filterValues: parsedFilters
      }
    },

    setDateRange: (state, action: PayloadAction<{startDate: Date, endDate: Date}>) => {
      const { startDate, endDate } = action.payload
      return {
        ...state,
        dateRange: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      }
    },

    resetFilters: state => {
      return {
        ...state,
        ...initialState
      }
    }
  }
})

export const { initFilters, setFilters, setDateRange, resetFilters } = filterSlice.actions

export const selectTimeSheetFilter = (state: RootState) => state.filter

export default filterSlice.reducer
