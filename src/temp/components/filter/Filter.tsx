import * as React from 'react'
import classnames from 'classnames'
import values from 'lodash/values'
import { PopperProps } from 'react-popper'
import pickBy from 'lodash/pickBy'

import { Button } from '../buttons/button/Button'
import { Icon } from '../icon/Icon'
import { PopOutBase } from '../popout/PopOutBase'

import { FilterDropdownPill } from './filter-pill/FilterDropdownPill'
import { DropdownList } from './filter-dropdown/DropdownList'
import { ResponsiveDropdown } from './filter-pill/ResponsiveDropdown'
import { Options, IActiveFilter, FilterProps  } from './interfaces'

interface State<T> {
  activeDropdown: string
  activeFilters: IActiveFilter<T>[]
}

export const ADD_FILTER = 'addFilter'

export class Filter<T> extends React.PureComponent<FilterProps<T>, State<T> > {
  private _addFilterRef: React.RefObject<HTMLButtonElement>

  constructor(props: FilterProps<T>) {
    super(props)

    this._addFilterRef = React.createRef<HTMLButtonElement>()

    this.state = {
      activeDropdown: '',
      activeFilters: [...this.prepareFixed(), ...this.preparePreSelected()]
    }

  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClickHandler)
  }

  preparePreSelected = () => {
    const { filters } = this.props
    const preselectedFilters = filters.filter(({ preselected }) => !!preselected)
    return preselectedFilters.map(filter => ({
      ...filter,
      options: filter.options.reduce((acc, option) => ({ ...acc, [option]: filter.preselected.includes(option) }), {})
    }))
  }

  prepareFixed = () => {
    const { filters } = this.props
    const fixedFilters = filters.filter(({ fixed }) => fixed)

    return fixedFilters.map(filter => ({
      ...filter,
      options: filter.options.reduce((acc, option) => ({ ...acc, [option]: true }), {})
    }))
  }

  documentClickHandler = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement
    !target.matches(`[data-sk-name="sked-dropdownlist"] ${target.tagName}`) && this.hideDropdown()
  }

  showDropdown = (name: string) => () => {
    this.hideDropdown(() => {
      document.addEventListener('click', this.documentClickHandler)
      this.setState(({ activeDropdown: name }))
    })
  }

  hideDropdown = (cb?: () => void) => {
    document.removeEventListener('click', this.documentClickHandler)
    this.setState({
      activeFilters: this.state.activeFilters
        .filter(({ name, options }) =>
          name !== this.state.activeDropdown || values(options).some(selected => selected)),
      activeDropdown: ''
    }, cb)
  }

  applyFilter = (name: string) => (options: Options) => () => {
    this.setState({
      activeFilters: this.state.activeFilters
        .map(filter =>
          name === filter.name ? { ...filter, options } : filter)
    },
    () => {
      this.setState({ activeDropdown: '' })
      this.props.onFilter(this.state.activeFilters)
    })
  }

  deleteFilter = (name: string) => () => {
    this.setState({
      activeFilters: this.state.activeFilters.filter(({ name: filterName }) => filterName !== name)
    },
    () => this.props.onFilter(this.state.activeFilters))
  }

  addNewFilter = (name: string) => () => {
    const { activeFilters } = this.state

    if (activeFilters.some(({ name: filterName }) => filterName === name)) {
      this.hideDropdown(this.showDropdown(name))
      return
    }

    const { filters } = this.props
    const theFilter = filters
      .find(({ name: filterName }) => name === filterName)
    const newFilterOptions = theFilter
      .options
      .reduce((acc, option) => ({ ...acc, [option]: false }), {})

    this.hideDropdown(
      () => this.createFilter({ ...theFilter, name, options: newFilterOptions })
    )
  }

  createFilter = (newFilter: IActiveFilter<T>) => {
    this.setState({
      activeFilters: [
        ...this.state.activeFilters,
        newFilter
      ]
    }, this.showDropdown(newFilter.name))
  }

  newFilterOptions = () => {
    const selectedCount =
      this.state.activeFilters.reduce((acc, { name, options }) => ({ ...acc, [name]: Object.keys(pickBy(options)).length }) ,{})
    return (
      <DropdownList
        showSearchFor={ this.props.listShowSearchFor }
        options={ this.props.filters.filter(({ fixed }) => !fixed).map(({ name }) => name) }
        onOptionClick={ this.addNewFilter  }
        selectedCount={ selectedCount }
      />
    )
  }

  render() {
    const { classNames } = this.props
    const { activeFilters, activeDropdown } = this.state
    return (
      <div
        data-sk-name="sk-new-filter"
        className={ classnames('sk-flex sk-w-full sk-flex-wrap sk-p-1', classNames) }
      >
        { activeFilters.map((filter, index) => (
          <FilterDropdownPill
            isActive={ filter.name === activeDropdown }
            key={ index }
            filter={ { name: filter.name, options: filter.options } }
            onPillClick={ this.showDropdown(filter.name) }
            onApply={ this.applyFilter(filter.name) }
            onRemove={ this.deleteFilter(filter.name) }
            listType={ filter.listType }
            showSearchFor={ filter.showSearchFor }
            searchPlaceholder={ filter.searchPlaceholder }
            fixed={ filter.fixed }
            searchOnly={ filter.searchOnly }
            single={ filter.single }
            pillClassnames="sk-m-1"
          />
        ))
        }
          <ResponsiveDropdown
            children={
              // tslint:disable-next-line: jsx-no-lambda
            (modifiers: PopperProps['modifiers'], placement: PopperProps['placement']) => (
              <PopOutBase
                visible={ this.state.activeDropdown === ADD_FILTER }
                placement={ placement }
                modifiers={ modifiers }
                trigger={
                  <Button
                    className="sk-text-blue hover:sk-text-blue-dark sk-m-1"
                    sked-filter-type={ ADD_FILTER }
                    data-sk-name={ ADD_FILTER }
                    buttonType="transparent"
                    compact
                    onClick={ this.showDropdown(ADD_FILTER) }
                    ref={ this._addFilterRef }
                  >
                    <Icon name="plus" size={ 12 } /> Add filter
                  </Button>
                }
              >
                { this.newFilterOptions() }
              </PopOutBase>
            ) }
          />
      </div>
    )
  }
}
