import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Icon } from 'skedulo-ui'

import ReduxDataTypes from '../../StoreV2/DataTypes'
import SettingsModal from './SettingsModal'
import ActionBarSearch from './ActionBarSearch'
import { setTimeSheetSetting } from '../../StoreV2/slices/settingSlice'

import Filters from '../Filters'

import './ActionBar.scss'
import { RootState } from '../../StoreV2/store'

interface Props {
  onSearch: (searchPhrase: string) => void
  onClearSearch: () => void
}

const ActionBar: React.FunctionComponent<Props> = ({ onSearch, onClearSearch }) => {
  const dispatch = useDispatch()
  const settings = useSelector((state: RootState) => state.setting)
  const [isSettingsModalOpened, setSettingsModalOpened] = useState(false)
  const openSettingsModal = () => setSettingsModalOpened(true)
  const closeSettingsModal = () => setSettingsModalOpened(false)

  const onSettingsModalSubmit = (newSettings: ReduxDataTypes.Settings) => {
    dispatch(
      setTimeSheetSetting({
        defaultTimezone: newSettings.defaultTimezone,
        distanceUnit: newSettings.distanceUnit,
        showErrorMessage: newSettings.showErrorMessage
      })
    )
    closeSettingsModal()
  }

  return (
    <div className="action-bar">
      <div className="action-bar__left">
        <Filters />
      </div>
      <div className="action-bar__right">
        <div className="action-bar__items">
          <ActionBarSearch onSearch={ onSearch } onClear={ onClearSearch } />
          <Button buttonType="transparent" onClick={ openSettingsModal } compact>
            <span>
              <Icon name="settings" size={ 18 } />
            </span>
          </Button>
        </div>
      </div>
      {isSettingsModalOpened && (
        <SettingsModal
          settings={ settings }
          onClose={ closeSettingsModal }
          onSubmit={ onSettingsModalSubmit }
        />
      )}
    </div>
  )
}

export default React.memo(ActionBar)
