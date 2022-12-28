import { Dispatch } from 'redux'
import moment from 'moment'

import { uniqBy, chunk, assign } from 'lodash'
import {
  makeActionsSet,
  makeReducers,
  makeAsyncActionCreatorSimp,
  makeActionCreator } from '../common/utils/redux-helpers'

import * as Queries from './queries'

import ReduxDataTypes, { TimeRange, DefinedEntryTypes, Avatars, UID } from './DataTypes'

import { Services, GraphQLRequest } from '../Services/Services'
import { autoPaginationGraphqlRequest } from '../Services/GraphQLServices'
import { dataService } from '../Services/DataServices'

const RESOURCE = makeActionsSet('RESOURCE')
const NEW_ENTRY = makeActionsSet('NEW_ENTRY')
const CLEAR_NEW_ENTRY_STATE = 'CLEAR_NEW_ENTRY_STATE'
const USERS_AVATARS = makeActionsSet('USERS_AVATARS')
const ENV_VENDOR = makeActionsSet('ENV_VENDOR')

interface VendorResp {
  vendorInfo: {
    vendor: ReduxDataTypes.VendorType
  }
}

export const getVendorInfo = makeAsyncActionCreatorSimp(
  ENV_VENDOR, () => async () => {
    const { vendorInfo: { vendor } } = await Services.metadata._apiService.get<VendorResp>('auth/whoami')
    return { vendor }
  }
)

export const clearNewEntrState = makeActionCreator(CLEAR_NEW_ENTRY_STATE)

export const getResources = makeAsyncActionCreatorSimp(
  RESOURCE, () => async (dispatch: Dispatch) => {
    // const resp = await Services.graphQL.fetch<{resources: ReduxDataTypes.Resource[]}>({
    //   query: Queries.AllResourcesQuery
    // })
    const resources = await autoPaginationGraphqlRequest<ReduxDataTypes.Resource>(
      Queries.AllResourcesQuery, 'resources', {}, ['Name', 'UID']
    )
    dispatch(getUsersAvatars(resources.reduce((acc, { User }) => User ? [...acc, User.UID] : acc, [] as UID[])))
    return { resources }
  }
)

export const getUsersAvatars = makeAsyncActionCreatorSimp(
  USERS_AVATARS, (ids: UID[]) => async () => {
    if (ids.length > 0) {
      const chunkedIds = chunk(ids, 200)
      const avatars = await Promise.all(chunkedIds.map(chunkedPack => Services.metadata._apiService.get(
        `files/avatar?user_ids=${[...new Set(chunkedPack)]}`
      )))

      const resp = avatars.reduce((prev, item) => assign(item, prev), {})
      // const resp = await Services.metadata._apiService.get(
      //   `files/avatar?user_ids=${[...new Set(ids)]}`
      // )
      return resp
    }
    return {}
  }
)

export const getNewEntryData = makeAsyncActionCreatorSimp(
  NEW_ENTRY, (entryType: DefinedEntryTypes, resourceUID: UID) => async (dispatch: Dispatch, getState: () => ReduxDataTypes.State) => {
    const store = getState()
    const resp = await dataService.fetchGraphQl<ReduxDataTypes.Job | ReduxDataTypes.Shift | ReduxDataTypes.Activity | ReduxDataTypes.Availability>({
      ...newEntryQueries[entryType](resourceUID, store.timeRange)
    })
    return resp
  }
)

const newEntryQueries: {[key in DefinedEntryTypes]: (resourceUID: string, { startDate, endDate }: TimeRange) => GraphQLRequest} = {
  Job: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, 'YYYY-MM-DD').startOf('day')
    const endDateMoment = moment(endDate, 'YYYY-MM-DD').endOf('day')
    return {
      query: Queries.NewEntryJobsQuery,
      variables: {
        filters: `Status != 'Declined' AND Resource.UID == '${resourceUID}' AND Start < ${endDateMoment.toISOString()} AND End > ${startDateMoment.toISOString()}`
      }
    }
  },
  Shift: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, 'YYYY-MM-DD').startOf('day')
    const endDateMoment = moment(endDate, 'YYYY-MM-DD').endOf('day')
    return {
      query: Queries.NewEntryShiftsQuery,
      variables: {
        filters: `Resource.UID == '${resourceUID}' AND Shift.Start < ${endDateMoment.toISOString()} AND Shift.End > ${startDateMoment.toISOString()}`
      }
    }
  },
  Activity: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, 'YYYY-MM-DD').startOf('day')
    const endDateMoment = moment(endDate, 'YYYY-MM-DD').endOf('day')
    return {
      query: Queries.NewEntryActivityQuery,
      variables: {
        filters: `Resource.UID == '${resourceUID}' AND Start < ${endDateMoment.toISOString()} AND End > ${startDateMoment.toISOString()}`
      }
    }
  },
  Unavailability: (resourceUID, { startDate, endDate }) => {
    const startDateMoment = moment(startDate, 'YYYY-MM-DD').startOf('day')
    const endDateMoment = moment(endDate, 'YYYY-MM-DD').endOf('day')
    return {
      query: Queries.NewEntryUnavailabilityQuery,
      variables: {
        filters: `IsAvailable == false AND Resource.UID == '${resourceUID}' AND Start < ${endDateMoment.toISOString()} AND Finish > ${startDateMoment.toISOString()}`
      }
    }
  }
}

const newEntryJobTransform = (jobAllocations: JobAllocations[]) => jobAllocations.map((jobAllocation: JobAllocations) => ({
  ...jobAllocation.Job,
  JobAllocationId: jobAllocation.UID,
  TravelDistance: jobAllocation.TravelDistance,
  Start: jobAllocation.TimeInProgress ? jobAllocation.TimeInProgress : jobAllocation.Job.Start,
  End: jobAllocation.TimeCompleted ? jobAllocation.TimeCompleted : jobAllocation.Job.End,
  LunchBreakDuration: jobAllocation.LunchBreakDuration,
  Premiums: jobAllocation.Premiums
}))

const newEntryShiftTransform = (resourceShifts: ResourceShift[]) => resourceShifts.map((resourceShift: ResourceShift) => {
  const isFinished = !!(resourceShift.ActualStart && resourceShift.ActualEnd)

  return {
    isFinished,
    ...resourceShift.Shift,
    Breaks: resourceShift.Breaks || [],
    Start: resourceShift.ActualStart ? resourceShift.ActualStart : resourceShift.Shift.Start,
    End: resourceShift.ActualEnd ? resourceShift.ActualEnd : resourceShift.Shift.End
  }
})

const userAvatarsTransform = (avatars: Avatars) => {
  const avatarsCopy = { ...avatars }
  delete avatarsCopy.type
  return {
    avatars: avatarsCopy
  }
}

interface ResourceShift {
  Shift: ReduxDataTypes.Shift
  Breaks: {
    Start: string
    End: string
  }[]
  ActualStart: string
  ActualEnd: string
}
interface JobAllocations { UID: string, Job: ReduxDataTypes.Job, TravelDistance: number, TimeInProgress: string, TimeCompleted: string, Status: string, LunchBreakDuration: number, Premiums: string[] }

interface NewEntryResp {
  jobAllocations?: JobAllocations[]
  resourceShifts?: ResourceShift[]
  activities?: ReduxDataTypes.Activity[]
  availabilities?: ReduxDataTypes.Availability[]
}

const newEntryTransform = ({ jobAllocations, resourceShifts, activities, availabilities }: NewEntryResp, store: ReduxDataTypes.State) => ({
  newEntryJob: jobAllocations ? newEntryJobTransform(uniqBy([
    ...jobAllocations.filter(item => item.Job.JobStatus !== 'Cancelled' && item.Status !== 'Deleted'),
    ...jobAllocations.filter(item => item.Job.JobStatus === 'Cancelled')
  ], 'JobId')) : store.newEntryJob,
  newEntryShift: resourceShifts ? newEntryShiftTransform(resourceShifts) : store.newEntryShift,
  newEntryActivity: activities || store.newEntryActivity,
  newEntryUnavailability: availabilities || store.newEntryUnavailability
})

export const fetchReducers = {
  ...makeReducers(ENV_VENDOR, { dataField: 'vendor' }),
  ...makeReducers(USERS_AVATARS, { transform: userAvatarsTransform }),
  ...makeReducers(NEW_ENTRY, { transform: newEntryTransform }),
  ...makeReducers(RESOURCE, { dataField: 'resources' }),
  [CLEAR_NEW_ENTRY_STATE]: (state: ReduxDataTypes.State) => ({
    ...state,
    newEntryJob: undefined,
    newEntryShift: undefined,
    newEntryActivity: undefined,
    newEntryUnavailability: undefined
  }) as ReduxDataTypes.State
}
