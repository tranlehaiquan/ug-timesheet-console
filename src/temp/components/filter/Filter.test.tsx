import * as React from 'react'
import { mount } from 'enzyme'

import { Button } from '../buttons/button/Button'
import { ButtonGroup } from '../button-group/ButtonGroup'
import { Filter, ADD_FILTER } from './Filter'
import { IFilter } from './interfaces'
import { PopOutBase } from '../popout/PopOutBase'

const getDefaultTestProps = (onFilter = activeFilters => {}, showSearch = -1) => {
  return {
    onFilter,
    filters: [
      {
        name: 'filter1',
        options: [
          'option1',
          'option2',
          'option3',
          'option4'
        ],
        showSearchFor: showSearch
      },
      {
        name: 'filter2',
        options: [
          'abc',
          'def'
        ],
        type: 'radio'
      }
    ] as IFilter<any>[]
  }
}

describe('Filter', () => {
  it('renders empty filter', () => {
    const wrapper = mount(<Filter { ...getDefaultTestProps() } />)

    expect(wrapper.find('[data-sk-name="sk-new-filter"]')).toHaveLength(1)
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(false)
    expect(wrapper.state('activeDropdown')).toEqual('')
    expect(wrapper.state('activeFilters')).toEqual([])
  })

  it('renders dropdown on click', () => {
    const wrapper = mount(<Filter { ...getDefaultTestProps() } />)

    expect(wrapper.find(Button)).toHaveLength(1)
    expect(wrapper.find('sked-add-filter-button--active')).toHaveLength(0)
    expect(wrapper.find(ButtonGroup)).toHaveLength(0)

    wrapper.find(Button).simulate('click')
    expect(wrapper.state('activeDropdown')).toEqual(ADD_FILTER)
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(true)
    expect(wrapper.find('[data-sk-name="sk-filter-dropdown-row"]')).toHaveLength(wrapper.prop('filters').length)

    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(0).simulate('click')
    expect(wrapper.find('[data-sk-name="sk-filter-dropdown-row"]')).toHaveLength(wrapper.prop('filters')[0].options.length)

  })

  it('adds and removes filters', () => {
    let callbackValue
    const wrapper = mount(<Filter { ...getDefaultTestProps(activeFilters => { callbackValue = activeFilters }) } />)

    const apply = () => wrapper.find('[data-sk-name="sk-filter-apply"]').at(0).simulate('click')

    wrapper.find(`button[data-sk-name="${ADD_FILTER}"]`).simulate('click')
    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(0).simulate('click')
    expect(wrapper.find('[data-sk-name="sk-added-filter"]')).toHaveLength(1)
    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(0).find('input').simulate('change', { target: { checked: true } })
    apply()
    expect(wrapper.state('activeFilters')[0].options.option1).toEqual(true)

    wrapper.find('[data-sk-name="sk-sk-added-filter-handler"]').simulate('click')
    expect(wrapper.find(PopOutBase).at(0).prop('visible')).toEqual(true)
    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(1).find('input').simulate('change', { target: { checked: true } })
    apply()
    expect(wrapper.state('activeFilters')[0].options.option2).toEqual(true)

    wrapper.find(`button[data-sk-name="${ADD_FILTER}"]`).simulate('click')
    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(1).simulate('click')
    expect(wrapper.state('activeDropdown')).toEqual(wrapper.prop('filters')[1].name)
    expect(wrapper.find(PopOutBase).at(1).prop('visible')).toEqual(true)
    apply() // button disabled w/o selection
    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(0).find('input').simulate('change', { target: { checked: true } })
    apply()

    expect(wrapper.state('activeDropdown')).toEqual('')
    expect(wrapper.find('[data-sk-name="sk-added-filter"]')).toHaveLength(2)
    expect(wrapper.state('activeFilters')[1].options.abc).toEqual(true)

    wrapper.find('[data-sk-name="sk-sk-added-filter-handler"]').at(1).simulate('click')
    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(1).find('input').simulate('change', { target: { checked: true } })
    apply()

    expect(wrapper.state('activeFilters')[1].options.def).toEqual(true)

    expect(wrapper.state('activeFilters')).toEqual(callbackValue)
  })

  it('filters options with search', () => {
    const wrapper = mount(<Filter { ...getDefaultTestProps(undefined, 1) } />)

    wrapper.find(Button).simulate('click')
    wrapper.find('[data-sk-name="sk-filter-dropdown-row"]').at(0).simulate('click')
    wrapper.find('[data-sk-name="sk-filter-search-input"]').find('input').simulate('change', { target: { value: '2' } })
    expect(wrapper.find('[data-sk-name="sk-filter-dropdown-row"]')).toHaveLength(1)

    wrapper.find('[data-sk-name="sk-filter-search-input"]').find('input').at(0).simulate('change', { target: { value: 'option' } })
    expect(wrapper.find('[data-sk-name="sk-filter-dropdown-row"]')).toHaveLength(wrapper.prop('filters')[0].options.length)

    wrapper.find('[data-sk-name="sk-filter-search-input"]').at(0).simulate('change', { target: { value: 'option1' } })
    expect(wrapper.find('[data-sk-name="sk-filter-dropdown-row"]')).toHaveLength(1)

    wrapper.find('[data-sk-name="sk-filter-search-input"]').at(0).simulate('change', { target: { value: '' } })
    expect(wrapper.find('[data-sk-name="sk-filter-dropdown-row"]')).toHaveLength(wrapper.prop('filters')[0].options.length)
  })
})
