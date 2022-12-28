import React from 'react'
import { connect } from 'react-redux'

import { isArray, isEqual } from 'lodash'
import { LoadingSpinner } from 'skedulo-ui'
import { TIME_SHEET_STATUS } from '../../common/constants/timesheet'
import { fetchResources } from '../../StoreV2/slices/resourceSlice'
import { RootState } from '../../StoreV2/store'
import { fetchTimeSheetEntries, selectTimeSheetIdByEntryId, updateTimeSheetEntry, updateTimeSheetStatus } from '../../StoreV2/slices/timeSheetEntriesSlice'

import { toastMessage } from '../../common/utils/notificationUtils'
// import {
//   initSubscriptionService,
//   registerNewSubscription
// } from '../../Store/reducersSubscriptions'
import { ReduxDataTypes } from '../../StoreV2/DataTypes'
import TimesheetsTable from '../../components/timesheets-table/TimesheetsTable'

import { NewTimesheetButton } from './NewTimesheetButton'
import { TimeRangeControl } from '../../components/TimeRangeControl/TimeRangeControl'
import { BulkActionsButton } from './BulkActionsButton'
import ActionBar from '../../Components/ActionBar'
import { DEFAULT_TS_ENTRY_PAGINATION, ITEMS_PER_PAGE } from '../../common/constants/timeSheetEntry'
import Stats from '../../Components/Stats'
import { dataService } from '../../Services/DataServices'

interface Props extends Pick<RootState, 'filter' | 'timeSheetEntries' | 'user' | 'order'> {
  fetchResources: typeof fetchResources.prototype
  // initSubscriptionService: typeof initSubscriptionService
  updateTimeSheetStatus: typeof updateTimeSheetStatus.caller
  // registerNewSubscription: typeof registerNewSubscription
  updateTimeSheetEntry: typeof updateTimeSheetEntry.caller
  fetchTimeSheetEntries: typeof fetchTimeSheetEntries.prototype
}

interface State {
  selectedTimesheetEntryUIDs: Set<string>
  showLoading: boolean
  currentPage: number
  searchValue: string
}

class AllTimeSheetsEntryPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedTimesheetEntryUIDs: new Set<string>(),
      showLoading: false,
      currentPage: 0,
      searchValue: ''
    }
  }

  async componentDidMount() {
    this.props.fetchResources()
    this.props.fetchTimeSheetEntries(DEFAULT_TS_ENTRY_PAGINATION)
    // this.props.initSubscriptionService()
  }

  componentDidUpdate(prevProps: Props) {
    // if (prevProps.subscriptionStatus !== 'connected' && this.props.subscriptionStatus === 'connected') {
    //   this.props.registerNewSubscription('TimesheetUpdate', true)
    //   this.props.registerNewSubscription('TimesheetEntryChange', true)
    // }
    const {
      dateRange: prevDateRange,
      filterValues: prevFilterValues
    } = prevProps.filter
    const { dateRange, filterValues } = this.props.filter
    const isDiffDateRange =
    prevDateRange.startDate !== dateRange.startDate ||
    prevDateRange.endDate !== dateRange.endDate
    const isDiffFilters =
    JSON.stringify(filterValues.map(value => value.filterValues).filter(Boolean)) !==
    JSON.stringify(prevFilterValues.map(value => value.filterValues).filter(Boolean))

    const prevOrder = prevProps.order
    const { order } = this.props
    const isDiffOrder = !isEqual(prevOrder, order)

    if (isDiffDateRange || isDiffFilters || isDiffOrder) {
      this.setState(prevState => ({ ...prevState, currentPage: 0 }))
      this.props.fetchTimeSheetEntries(DEFAULT_TS_ENTRY_PAGINATION)
    }
  }

  preparePaginationParams = () => {
    const currentPage = this.state.currentPage - 1 > 0 ? this.state.currentPage - 1 : 0
    return { entriesPerPage: ITEMS_PER_PAGE, page: currentPage * ITEMS_PER_PAGE }
  }

  updateStatuses = async (
    timeSheetIds: string | string[],
    status: string,
    comment: string = null
  ) => {
    await this.props.updateTimeSheetStatus({
      timeSheetIds: Array.isArray(timeSheetIds) ? timeSheetIds : [timeSheetIds],
      comment,
      userId: this.props.user.id,
      status
    })
    this.setState(prevState => ({
      ...prevState,
      selectedTimesheetEntryUIDs: new Set<string>()
    }))
    this.props.fetchTimeSheetEntries(this.preparePaginationParams())
  }

  getJobAllocationIds = (timeSheetEntryId: string) => {
    const newEntries = this.getNewEntries(timeSheetEntryId)
    let jobAllocations: string[] = []
    newEntries.forEach(entry => {
      const jas = entry.Job.JobAllocations
      jobAllocations = jobAllocations.concat(jas.map(ja => ja.UID))
    })
    return jobAllocations
  };

  getNewEntries = (timeSheetEntryId: string): ReduxDataTypes.TimesheetEntry[] => {
    const newTimeSheetEntries = this.props.timeSheetEntries.values.filter(entry => {
      return entry.UID === timeSheetEntryId && entry.IsNew
    })

    return newTimeSheetEntries
  }

  onSelect = (selectedTimesheetEntryUIDs: Set<string>) => {
    this.setState({
      selectedTimesheetEntryUIDs
    })
  };

  onSubmit = (timeSheetEntryId: string | string[], comment: string) => {
    let timeSheetId: string | string[]
    if (isArray(timeSheetEntryId)) {
      timeSheetId = timeSheetEntryId.map(id => selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, id))
    } else {
      timeSheetId = selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, timeSheetEntryId)
    }
    this.updateStatuses(timeSheetId, TIME_SHEET_STATUS.SUBMITTED, comment)
  };

  onApprove = async (
    timeSheetEntryId: string | string[],
    comment: string = null
  ) => {
    let jobAllocationIds: string[] = []
    let newEntryIds: string[] = []
    let timeSheetIds: string[] = []
    this.setState(preState => ({
      ...preState,
      showLoading: true
    }))

    if (!isArray(timeSheetEntryId)) {
      jobAllocationIds = this.getJobAllocationIds(timeSheetEntryId)
      newEntryIds = this.getNewEntries(timeSheetEntryId).map(entry => entry.UID)
      timeSheetIds = [selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, timeSheetEntryId)]
    } else {
      for (const entryId of timeSheetEntryId) {
        jobAllocationIds = jobAllocationIds.concat(this.getJobAllocationIds(entryId))
        newEntryIds = newEntryIds.concat(this.getNewEntries(entryId).map(entry => entry.UID))
        timeSheetIds = timeSheetIds.concat(selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, entryId))
      }
    }
    try {
      // generate PDF + Update TS status + Update Entry isNew field
      await dataService.triggerGeneratePdf(true, jobAllocationIds)
      await Promise.all(
        newEntryIds.map(id => {
          return this.props.updateTimeSheetEntry({
            UID: id,
            IsNew: false
          })
        })
      )
      await this.updateStatuses(timeSheetIds, TIME_SHEET_STATUS.APPROVED, comment)
    } catch (err) {
      if ((err as Error).message) toastMessage.error((err as Error).message)
    } finally {
      this.setState(preState => ({
        ...preState,
        showLoading: false
      }))
    }
  };

  onReject = (timeSheetEntryId: string | string[], comment: string = null) => {
    let timeSheetId: string | string[]
    if (isArray(timeSheetEntryId)) {
      timeSheetId = timeSheetEntryId.map(id => selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, id))
    } else {
      timeSheetId = selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, timeSheetEntryId)
    }
    this.updateStatuses(timeSheetId, TIME_SHEET_STATUS.REJECTED, comment)
  };

  onRecall = (timeSheetEntryId: string, timeSheetStatus: string) => {
    let newStatus = timeSheetStatus
    const timeSheetId = selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, timeSheetEntryId)
    if (timeSheetStatus === TIME_SHEET_STATUS.APPROVED) newStatus = TIME_SHEET_STATUS.SUBMITTED
    if (timeSheetStatus === TIME_SHEET_STATUS.REJECTED) newStatus = TIME_SHEET_STATUS.SUBMITTED
    if (timeSheetStatus === TIME_SHEET_STATUS.SUBMITTED) newStatus = TIME_SHEET_STATUS.DRAFT
    this.updateStatuses(timeSheetId, newStatus)
  };

  onDelete = async () => {
    // const timeSheetId = selectTimeSheetIdByEntryId(this.props.timeSheetEntries.values, timeSheetEntryId)
  };

  onPageChange = (page: number) => {
    this.setState(prevState => ({
      ...prevState,
      currentPage: page
    }), () => {
      this.props.fetchTimeSheetEntries(this.preparePaginationParams())
    })
  };

  onSearch = (value: string) => {
    this.setState(prevState => ({ ...prevState, searchValue: value }))
  }

  onClearSearch = () => {
    this.setState(prevState => ({ ...prevState, searchValue: '' }))
  }

  render() {
    return (
      <div className="sk-bg-white sk-min-h-screen sk-pt-6 sk-relative">
        <section className="sk-mb-4 sk-mx-6 sk-flex sk-justify-between">
          <TimeRangeControl />
          <div className="sk-flex sk-flex-row">
            <BulkActionsButton
              selectedTimeSheetEntryUIDs={ this.state.selectedTimesheetEntryUIDs }
              onReject={ this.onReject }
              onApprove={ this.onApprove }
            />
            <NewTimesheetButton />
          </div>
        </section>
        <section className="timesheets-table__section">
          <ActionBar onSearch={ this.onSearch } onClearSearch={ this.onClearSearch } />
        </section>
        <section className="timesheets-table__section timesheets-table__stats">
          <Stats />
        </section>
        <section className="sk-mb-4">
          <TimesheetsTable
            onSubmit={ this.onSubmit }
            onApprove={ this.onApprove }
            onReject={ this.onReject }
            onRecall={ this.onRecall }
            onDelete={ this.onDelete }
            onSelect={ this.onSelect }
            handlePageChange={ this.onPageChange }
            currentPage={ this.state.currentPage }
            selectedTimesheetEntryUIDs={ this.state.selectedTimesheetEntryUIDs }
            searchValue={ this.state.searchValue }
          />
        </section>
        {this.state.showLoading && (
          <div className="sk-flex sk-fixed sk-w-full sk-h-full sk-justify-center sk-pin-t sk-pin-l sk-bg-black/5">
            <LoadingSpinner size={ 84 } color="#0b86ff" />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  timeSheetEntries: state.timeSheetEntries,
  filter: state.filter,
  user: state.user,
  order: state.order
  // subscriptionStatus: state.subscriptionStatus
})

const mapDispatchToProps = {
  fetchResources,
  // initSubscriptionService,
  updateTimeSheetStatus,
  // deleteTimesheet,
  // registerNewSubscription,
  updateTimeSheetEntry,
  fetchTimeSheetEntries
}

export default connect(mapStateToProps, mapDispatchToProps)(AllTimeSheetsEntryPage)
