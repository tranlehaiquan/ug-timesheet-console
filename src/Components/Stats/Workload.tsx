import React, { useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import { useSelector } from 'react-redux'

import { Tooltip } from 'skedulo-ui'
import { RootState } from '../../StoreV2/store'

import './Workload.scss'

const MAX_MEANINGFUL_PARTS = 6

interface GraphPart {
  title: string
  value: number
  color: string
}

const getTooltipContent = (part?: GraphPart) => {
  return (
    <span>
      {
        part
          ? <><span style={ { color: part.color } }>&bull; </span>{ `${part.title} ${Math.round(part.value)}%` }</>
          : 'No data'
      }
    </span>
  )
}

const COLORS = [
  '#007ee6',
  '#ffc878',
  '#75c8f6',
  '#3da499',
  '#8d68c3',
  '#000'
]

const prepareWorkloadData = (workload: {[index: string]: number }) => {
  if (!(workload && Object.keys(workload).length)) return []

  const jobTypes = Object.keys(workload)
  const sum = jobTypes.reduce((acc, key) => acc + workload[key], 0)
  const parts = jobTypes
    .sort((key1, key2) => (workload[key1] >= workload[key2] ? -1 : 1))
    .map((key, index) => ({
      title: key,
      value: workload[key] / sum * 100,
      color: COLORS[index]
    }))

  if (parts.length > MAX_MEANINGFUL_PARTS) {
    const other = parts
      .slice(MAX_MEANINGFUL_PARTS - 1)
      .reduce((acc, part) => ({
        ...acc,
        title: 'Other',
        value: acc.value + part.value,
        color: '#000'
      }))

    return [
      ...parts.slice(0, MAX_MEANINGFUL_PARTS - 1),
      other
    ]
  }

  return parts
}

const renderLegend = (parts: GraphPart[]) => {
  return (
    <div className="sk-text-xs sk-capitalize workload__legend">
      {
        parts.map((part, idx) => (
          <div
            className="sk-mb-2 sk-leading-none"
            key={ idx }
          >
            <span
              className="sk-text-2xl sk-pr-2"
              style={ { color: part.color } }
            >
              &bull;
            </span>
            <span>{ part.title }</span>
          </div>
        ))
      }
    </div>
  )
}

const renderLegendPlaceholder = () => (
  <div className="sk-mt-8">No data</div>
)

export const Workload: React.FC = () => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipContent, setTooltipContent] = useState(<span />)

  const { workload } = useSelector((state: RootState) => state.summary)
  const parts = prepareWorkloadData(workload)

  const onMouseOverChart = (event: React.MouseEvent, data: any[], index: number) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY })
    setTooltipVisible(true)
    setTooltipContent(getTooltipContent(parts[index]))
  }

  const getTooltipContainerStyle = () => ({
    top: tooltipPosition.y - 5,
    left: tooltipPosition.x - 5,
    display: tooltipVisible ? 'block' : 'none'
  })

  const getEmptyChartData = () => ([{
    title: 'No data',
    value: 100,
    color: '#f3f5f9'
  }])

  return (
    <div className="workload">
      <div className="workload__tooltip-container" style={ getTooltipContainerStyle() }>
        <Tooltip content={ tooltipContent } position="top" colorScheme="light">
          <div className="workload__tooltip-hoverable" style={ { display: tooltipVisible ? 'block' : 'none' } } />
        </Tooltip>
      </div>
      <div className="sk-mr-16">
        <h3 className="sk-mt-4 sk-mb-6 sk-w-48 sk-text-lg">Workload distribution</h3>
        { parts.length ? renderLegend(parts) : renderLegendPlaceholder() }
      </div>
      <div className="workload__chart-container sk-pt-2 sk-self-center">
        <PieChart
          style={ { height: '7rem' } }
          data={ parts.length ? parts : getEmptyChartData() }
          lineWidth={ 20 }
          onMouseOver={ onMouseOverChart }
        />
      </div>
    </div>
  )
}
export default Workload
