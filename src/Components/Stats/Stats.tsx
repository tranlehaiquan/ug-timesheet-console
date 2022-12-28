import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from 'skedulo-ui'
import { RootState } from 'src/StoreV2/store'
import { doTimeSheetStatistics } from '../../StoreV2/slices/summarySlice'
import Summary from './Summary'
import Workload from './Workload'

const Stats: React.FC = () => {
  const dispatch = useDispatch()
  const { filterValues, dateRange } = useSelector(
    (state: RootState) => state.filter
  )
  const isLoading = useSelector((state: RootState) => state.summary.loading)

  useEffect(() => {
    dispatch(doTimeSheetStatistics(''))
  }, [
    JSON.stringify(
      filterValues.map(({ filterValues }) => filterValues).filter(Boolean)
    ),
    JSON.stringify(dateRange)
  ])

  return (
    <div className="sk-flex sk-justify-around sk-text-xxs">
      <div className="sk-items-center sk-border sk-flex sk-justify-center sk-flex-grow sk-rounded-medium sk-min-h-150px">
        {isLoading && <Loading align="center" />}
        {!isLoading && <Summary className="sk-flex-1" />}
      </div>
      <div className="sk-flex sk-items-center sk-border sk-flex-grow sk-rounded-medium sk-ml-6 sk-min-h-150px">
        {isLoading && <Loading align="center" />}
        {!isLoading && <Workload />}
      </div>
    </div>
  )
}

export default Stats
