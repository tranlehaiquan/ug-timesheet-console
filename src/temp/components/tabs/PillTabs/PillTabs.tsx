import * as React from 'react'
import classNames from 'classnames'

export interface PillTab {
  id: string
  name: string
}

export interface IPillTabsProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Tabs to render
   */
  tabs: PillTab[]
  /**
   * On tab click function, returns the ID of the tab that was clicked
   */
  onTabClick: (tabClicked: string) => void
  /**
   * By default the component will use the first tab as the default active tab.
   * If this needs to be different, you can pass this prop through.
   * It should be used for routing tabs so the components state will be in sync
   * across page rereshes
   */
  initialActiveTab?: PillTab
  /**
   * Class name to override the tab parent. HTMLElement = <ul>
   */
  className?: string
  /**
   * Class names to override the individual tab. HTMLElement = <li>
   */
  tabClassName?: string
  /**
   * Class names to override the active styles of a tab. HTMLElement = <li>
   */
  activeTabClassName?: string
}

export interface IPillTabsState {
  activeTab: PillTab['id']
}

export class PillTabs extends React.PureComponent<IPillTabsProps, IPillTabsState> {
  state = {
    activeTab: this.props.initialActiveTab ? this.props.initialActiveTab.id : this.props.tabs[0].id
  }

  handleTabClick = (tabClickedId: PillTab['id']) => () => {
    this.setState({ activeTab: tabClickedId })
    this.props.onTabClick(tabClickedId)
  }

  render() {
    const { activeTab } = this.state
    const { tabs, className, tabClassName, activeTabClassName, ...otherProps } = this.props

    const classes = classNames('sk-list-reset sk-flex sk-bg-navy-lighter sk-p-2 sk-text-xs', className)
    const activeClasses = 'sk-bg-navy-light sk-opacity-100 sk-shadow'
    const tabClasses = 'sk-mr-4 sk-px-3 sk-py-1 sk-uppercase sk-rounded sk-text-white sk-cursor-pointer sk-font-semibold sk-tracking-wider sk-opacity-75 hover:sk-opacity-100 hover:sk-bg-navy-light hover:sk-shadow-tabs'

    return (
      <ul { ...otherProps } className={ classes }>
        { tabs.map(tab => {
          const combinedTabClasses = classNames(tabClasses, tabClassName, { [`${activeClasses} ${activeTabClassName ? activeTabClassName : ''}`]: activeTab === tab.id })

          return (
            <li className={ combinedTabClasses } onClick={ this.handleTabClick(tab.id) } key={ tab.id }>
              { tab.name }
            </li>
          )
        }) }
      </ul>
    )
  }
}
