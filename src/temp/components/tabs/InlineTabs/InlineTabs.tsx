import * as React from 'react'
import { omit } from 'lodash'
import classNames from 'classnames'
import { InlineTabSubmenu, SubmenuItem, MenuNotification } from './InlineTabSubmenu'
import { Dropdown } from '../../dropdown/Dropdown'

export interface InlineTab {
  name: string
  id: string
  icon?: string
  iconClasses?: string
  submenu?: SubmenuItem[]
}
export interface TabClickReturn {
  tabClickedId: InlineTab['id']
  submenuClickedId?: SubmenuItem['id']
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Tabs required to render
   */
  tabs: InlineTab[]
  /**
   * Function to call when a tab is clicked, returns the ID of the tab that was clicked
   * If a submenu item is clicked it will return both the parent ID and the submenu ID.
   * If you click the parent tab it will return the parentTabId and the first submenu item ID
   */
  onTabClick: (response: TabClickReturn) => void
  /**
   * Passing a icon through will render it center to the right by default.
   * You can pass a tabIconClassName through to modify this.
   */
  tabIconClassName?: string
  /**
   * By default the component will use the first tab as the default active tab.
   * If this needs to be different, you can pass this prop through.
   * It should be used for routing tabs so the components state will be in sync
   * across page rereshes
   */
  initialActiveTab?: InlineTab
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
  /**
   * If you want a submenu item to be active by default you can pass a ID of the submenu item.
   * initialActiveTab prop needs to be supplied for this one to work and the id of the submenu item //#endregion
   * must be inside the submenu of the initialActiveTab item
   * This is partially for routing. So if you refresh a page you can pull the URL and pass the subroute through and the
   * state will remain in sync
   */
  initialActiveSubmenuItem?: string
}

export const getInitialSubmenuItem = ({ initialActiveSubmenuItem, initialActiveTab, tabs }: Pick<IProps, 'initialActiveSubmenuItem' | 'tabs' | 'initialActiveTab'>): string => {
  if (initialActiveTab && initialActiveTab.submenu) {
    const item = initialActiveSubmenuItem ? initialActiveTab.submenu.find(a => a.id.toLowerCase() === initialActiveSubmenuItem.toLowerCase()) : null
    return item ? item.id : initialActiveTab.submenu[0].id
  } else if (tabs[0].submenu) {
    return tabs[0].submenu[0].id
  }
  return null
}

export interface IState {
  activeTab: InlineTab['id']
  submenuIsActive: boolean
  activeSubmenuRef: HTMLLIElement
  submenuItems: SubmenuItem[]
  /**
   * Difference between activeSubmenuParentId and activeTab is
   * activeSubmenuParentId is used to keep hover state when a user is using
   * the submenu
   */
  activeSubmenuParentId: InlineTab['id']
  activeSubmenuItem: SubmenuItem['id']
}

export class InlineTabs extends React.PureComponent<IProps, IState> {
  state: IState = {
    activeTab: this.props.initialActiveTab ? this.props.initialActiveTab.id : this.props.tabs[0].id,
    submenuItems: null,
    submenuIsActive: false,
    activeSubmenuRef: null,
    activeSubmenuParentId: null,
    activeSubmenuItem: getInitialSubmenuItem(this.props)
  }

  tabs: {
    [key: string]: HTMLLIElement
  }

  constructor(props: IProps) {
    super(props)

    this.tabs = {}
  }

  createRefs = (refId: InlineTab['id']) => (ref: HTMLLIElement) => (this.tabs[refId] = ref)

  handleTabClick = (tabClickedId: InlineTab['id'], submenuClickedId?: SubmenuItem['id']) => () => {
    const { tabs, onTabClick } = this.props

    if (this.tabs[tabClickedId]) {
      // If they click the top level tab we want to set the sub tab as the first submenu item
      const activeSubTabToSet = tabs.find(tab => tab.id === tabClickedId).submenu[0].id
      this.setState({ activeTab: tabClickedId, activeSubmenuItem: activeSubTabToSet, submenuIsActive: false })

      onTabClick({ tabClickedId, submenuClickedId: submenuClickedId || activeSubTabToSet })
    } else {
      this.setState({ activeTab: tabClickedId, submenuIsActive: false, activeSubmenuItem: null })
      onTabClick({ tabClickedId, submenuClickedId: null })
    }
  }

  handleSubmenuItemClick = (submenuClickedId: SubmenuItem['id']) => () => {
    const { activeSubmenuParentId } = this.state

    this.setState({ activeSubmenuItem: submenuClickedId, activeTab: activeSubmenuParentId, activeSubmenuParentId: null, submenuIsActive: false })

    this.props.onTabClick({ submenuClickedId, tabClickedId: activeSubmenuParentId })
  }

  handleMouseHover = (tabSubMenu: SubmenuItem[], tabId: InlineTab['id']) => () => {
    const activeSubmenuRef = this.tabs[tabId] ? this.tabs[tabId] : null

    if (activeSubmenuRef) {
      this.setState({ activeSubmenuRef, submenuIsActive: true, submenuItems: tabSubMenu, activeSubmenuParentId: tabId })
    }
  }

  handleParentMouseLeave = (tabId: InlineTab['id']) => (evt: React.MouseEvent<HTMLLIElement>) => {
    const submenuRef = this.tabs[tabId] as HTMLLIElement

    if (submenuRef) {
      const tabRect = submenuRef.getBoundingClientRect()

      // If they leave in any direction except below, hide/reset the state
      if (tabRect.top > evt.clientY || evt.clientX < tabRect.left || evt.clientX > tabRect.right) {
        this.handleSubmenuMouseLeave()
      }
    }
  }

  handleSubmenuMouseLeave = () => {
    this.setState({ activeSubmenuRef: null, submenuIsActive: false, submenuItems: null, activeSubmenuParentId: null })
  }

  render() {
    const { activeTab, activeSubmenuParentId, activeSubmenuRef, submenuIsActive, activeSubmenuItem, submenuItems } = this.state
    const { tabs, className, tabClassName, activeTabClassName, ...otherProps } = this.props

    const listContainer = classNames('sk-flex sk-border-b sk-border-grey-light sk-text-navy-lighter sk-capitalize sk-text-base sk-flex-no-shrink', className)

    const defaultTabClasses = 'sk-cursor-pointer sk-mx-3 sk-px-1 sk-pb-2 sk-inline-block sk-whitespace-no-wrap sk-leading-tight'
    const activeTabDefaultClasses = 'sk-border-b-2 sk-border-navy sk--mb-px sk-text-navy sk-font-semibold'
    const tabHoverClasses = 'hover:sk-text-navy'

    const newProps = omit(otherProps, ['onTabClick', 'initialActiveTab', 'tabIconClassName', 'initialActiveSubmenuItem'])

    return (
      <div { ...newProps } className={ listContainer }>
        <ul className="sk-list-reset">
          { tabs.map(tab => {
            const tabClasses = classNames(defaultTabClasses, tabClassName, tabHoverClasses, 'sked-active-tab', {
              [`${activeTabDefaultClasses} ${activeTabClassName ? activeTabClassName : ''} `]: activeTab === tab.id,
              'sk-text-navy': activeSubmenuParentId === tab.id
            })

            return (
              <li
                id={ tab.id }
                key={ tab.id }
                className={ tabClasses }
                onClick={ this.handleTabClick(tab.id) }
                onMouseOver={ this.handleMouseHover(tab.submenu, tab.id) }
                ref={ tab.submenu && this.createRefs(tab.id) }
                onMouseLeave={ this.handleParentMouseLeave(tab.id) }
                title={ tab.name }
                data-active={ activeTab === tab.id }
              >
                { tab.name }
                { tab.icon && <MenuNotification className={ tab.iconClasses } text={ tab.icon } /> }
              </li>
            )
          }) }
        </ul>
        { submenuIsActive && activeSubmenuRef && (
          <Dropdown trigger={ activeSubmenuRef }>
            <InlineTabSubmenu activeItem={ activeSubmenuItem } items={ submenuItems } onItemClick={ this.handleSubmenuItemClick } onMouseLeave={ this.handleSubmenuMouseLeave } />
          </Dropdown>
        ) }
      </div>
    )
  }
}
