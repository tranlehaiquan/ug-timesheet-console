import React from 'react'
import { format } from 'date-fns'

import { FormInputElement } from 'skedulo-ui'
import { Label } from '../Utils/Label'
import { hoursToDuration } from '../../../common/utils/dateTimeHelpers'
import ReduxDataTypes, { UID } from '../../../Store/DataTypes'

interface BreaksSelectProps {
  Breaks: ReduxDataTypes.Break[]
  onChange: (selections: Set<UID>) => void
  selections: Set<UID>
}

interface SingleBreakSelectProps {
  Break: ReduxDataTypes.Break
  onChange: (id: UID) => void
  isSelected: boolean
}

const SingleBreakSelect: React.FC<SingleBreakSelectProps> = ({ Break, onChange, isSelected }) => {
  const startDate = new Date(Break.Start)
  const endDate = new Date(Break.End)

  const startTime = format(startDate, 'HH:mm')
  const endTime = format(endDate, 'HH:mm')

  const duration = hoursToDuration((endDate.getTime() - startDate.getTime()) / 3600000)

  const label = (
    <span className="sk-flex">
      <span className="sk-mr-4 sk-w-24">{ startTime } - { endTime }</span>
      { duration && <Label text={ `(${duration})` } /> }
    </span>
  )

  return (
    <FormInputElement
      key={ Break.UID }
      type="checkbox"
      onChange={ () => onChange(Break.UID) }
      checked={ isSelected }
      inlineLabel={ label }
      className="sk-mb-3"
      inlineLabelClassName="sk-ml-4"
    />
  )
}

const BreaksSelect: React.FC<BreaksSelectProps> = props => {
  const onSingleBreakChange = (id: UID) => {
    const newSelections = new Set(props.selections)
    const isSelected = props.selections.has(id)
    if (isSelected) {
      newSelections.delete(id)
    } else {
      newSelections.add(id)
    }

    props.onChange(newSelections)
  }

  const areAllSelected = () => props.selections.size === props.Breaks.length
  const onSelectAllChange = () => {
    props.onChange(areAllSelected()
      ? new Set()
      : new Set(props.Breaks.map(Break => Break.UID)))
  }

  return (
    <div className="sk-mb-8">
      <h3 className="sk-mb-3">Shift break</h3>
      <Label text="The selected shift breaks below will also be created as Timesheet Entries" />
      <div className="sk-mt-6">
        <FormInputElement
          type="checkbox"
          onChange={ onSelectAllChange }
          checked={ areAllSelected() }
          inlineLabel="All breaks"
          inlineLabelClassName="sk-font-semibold sk-ml-4"
        />
        <div className="sk-ml-6 sk-mt-3">
          {
            props.Breaks &&
            props.Breaks.map(Break => (
              <SingleBreakSelect
                key={ Break.UID }
                Break={ Break }
                onChange={ () => onSingleBreakChange(Break.UID) }
                isSelected={ props.selections.has(Break.UID) }
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default BreaksSelect
