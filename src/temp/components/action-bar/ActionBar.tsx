import * as React from 'react'

import { ActionBarSearchItem } from './ActionBarSearchItem/ActionBarSearchItem'

export interface IActionBar {
  /**
  * value for items count in table
  */
  countValue: number
  /**
  * name for items displayed in tab;e
  */
  countName: string
}

interface IActionBarViewControls {
  /**
  * search item indicator
  */
  withSearch: boolean
}

export const ActionBar: React.FC<IActionBar> = ({ countValue, countName, children }) => (
  <div
    className="sk-bg-white sk-w-full sk-h-12 sk-inline-flex sk-items-center sk-px-5"
    data-sk-name="action-bar-container"
  >
    <span
      className="sk-text-grey sk-text-sm sk-capitalize sk-whitespace-no-wrap"
      data-sk-name="action-bar-details"
    >
      { `${Math.max(0, countValue)} ${countName}` }
    </span>
    <div
      data-sk-name="action-bar-items"
      className="sk-w-full sk-flex sk-items-center sk-justify-between"
    >
      { children }
    </div>
  </div >
)

export const ActionBarActions: React.FC = ({ children }) => (
  <div
    className="sk-w-full"
    data-sk-name="action-bar-actions"
  >
    { children }
  </div >
)

export const ActionBarViewControls: React.FC<IActionBarViewControls> = ({ children, withSearch }) => (
  <div
    className="sk-w-full sk-flex sk-items-center sk-justify-end sk-whitespace-no-wrap"
    data-sk-name="action-bar-view-controls"
  >
    { children }
    { withSearch && <ActionBarSearchItem /> }
  </div >
)
