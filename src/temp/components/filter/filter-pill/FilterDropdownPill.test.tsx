import * as React from 'react'
import { mount } from 'enzyme'

import pickBy from 'lodash/pickBy'

import { FilterDropdownPill } from './FilterDropdownPill'
import { Options, DropdownListProps } from '../interfaces'
import { PopOutBase } from '../../popout/PopOutBase';

const TEST_NAME = 'testName'
const OPTIONS = [
  'Option',
  'Option 2',
  'Option 3'
]

const getWrapper = (props = {
  filter: {
    name: TEST_NAME,
    options: OPTIONS as DropdownListProps['options']
  }
}) => mount(<FilterDropdownPill { ...props } />)
const attrName = (name, prefix = '') => `${prefix}[data-sk-name="${name}"]`

describe('Filter Dropdown Pill', () => {
  it('renders array list',() => {
    const wrapper = getWrapper()

    const onClickHandlers = OPTIONS.reduce((acc,optionName) => ({
      ...acc,
      [optionName]: jest.fn()
    }),{})

    expect(wrapper.find(attrName('sk-added-filter'))).toHaveLength(1)
    wrapper.setProps({ onOptionClick: label =>  onClickHandlers[label].mockReturnValue(label) })
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(false)
    wrapper.setProps(({ isActive: true }))
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(true)

    expect(wrapper.find(attrName('sk-filter-dropdown-row', 'li'))).toHaveLength(OPTIONS.length)

    wrapper.find(attrName('sk-filter-dropdown-row', 'li')).at(2).simulate('click')
    expect(onClickHandlers[OPTIONS[2]]).toHaveBeenCalledTimes(1)
    expect(onClickHandlers[OPTIONS[2]]).toHaveLastReturnedWith(OPTIONS[2])

    expect(wrapper.find(attrName('sk-filter-search-input', 'input'))).toHaveLength(0)
    wrapper.setProps({ showSearchFor: 1 })
    expect(wrapper.find(attrName('sk-filter-search-input', 'input'))).toHaveLength(1)
    expect(wrapper.find(attrName('sk-filter-search-input', 'input')).is(':focus')).toBe(true)

    wrapper.find(attrName('sk-filter-search-input', 'input')).simulate('change', { target: { value: 'no match' } })
    expect(wrapper.find(attrName('sk-filter-dropdown-row', 'li'))).toHaveLength(0)
    expect(wrapper.find(attrName('sk-filter-empty-state'))).toHaveLength(1)
    expect(wrapper.find(attrName('sk-filter-empty-state')).text()).toEqual('No results found')

    wrapper.setProps({ emptyState: 'empty' })
    wrapper.find(attrName('sk-filter-search-input', 'input')).simulate('change', { target: { value: 'no match' } })
    expect(wrapper.find(attrName('sk-filter-empty-state')).text()).toEqual('empty')

    wrapper.find(attrName('sk-filter-search-input', 'input')).simulate('change', { target: { value: 'Option' } })
    expect(wrapper.find(attrName('sk-filter-dropdown-row', 'li'))).toHaveLength(3)

    wrapper.find(attrName('sk-filter-search-input', 'input')).simulate('change', { target: { value: OPTIONS[1] } })
    expect(wrapper.find(attrName('sk-filter-dropdown-row', 'li'))).toHaveLength(1)
    expect(wrapper.find(attrName('sk-filter-dropdown-row', 'li')).text()).toEqual(OPTIONS[1])
  })

  it('renders input list', () => {
    const wrapper = getWrapper({
      filter: {
        name: TEST_NAME,
        options: OPTIONS.reduce((acc, optionName) => ({ ...acc, [optionName]: false }), {} as Options)
      }
    })

    const onApply = jest.fn()
    const onClickHandlers = OPTIONS.reduce((acc,optionName) => ({
      ...acc,
      [optionName]: jest.fn()
    }),{})

    const applyButton = () => wrapper.find(attrName('sk-filter-apply', 'button'))
    const listElements = () => wrapper.find(attrName('sk-filter-dropdown-row', 'li'))

    expect(wrapper.find(attrName('sk-added-filter'))).toHaveLength(1)
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(false)
    wrapper.setProps(({ isActive: true }))
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(true)

    expect(applyButton()).toHaveLength(0)
    wrapper.setProps({ onApply: options => onApply.mockReturnValue(options) })
    expect(applyButton()).toHaveLength(1)
    expect(applyButton().prop('disabled')).toEqual(true)

    expect(listElements()).toHaveLength(OPTIONS.length)
    expect(listElements().at(0).find('input[type="checkbox"]')).toHaveLength(1)
    listElements().at(0).find('input[type="checkbox"]').simulate('change', { target: { checked: true } })

    expect(applyButton().prop('disabled')).toEqual(false)
    expect(onApply).not.toBeCalled
    applyButton().simulate('click')
    expect(onApply).toReturnWith({ Option: true, 'Option 2': false, 'Option 3': false })

    wrapper.setProps({ onOptionClick: label =>  onClickHandlers[label].mockReturnValue(label) })
    listElements().at(1).find('input[type="checkbox"]').simulate('change', { target: { checked: true } })
    listElements().at(2).find('input[type="checkbox"]').simulate('change', { target: { checked: true } })
    expect(onApply).toReturnWith({ Option: true, 'Option 2': false, 'Option 3': false })

    expect(onClickHandlers[OPTIONS[1]]).toHaveBeenCalledTimes(1)
    expect(onClickHandlers[OPTIONS[1]]).toHaveLastReturnedWith(OPTIONS[1])
    expect(onClickHandlers[OPTIONS[2]]).toHaveBeenCalledTimes(1)
    expect(onClickHandlers[OPTIONS[2]]).toHaveLastReturnedWith(OPTIONS[2])

    wrapper.setProps({ onApply: options => onApply.mockReturnValue(options) })
    applyButton().simulate('click')
    expect(onApply).toReturnWith({ Option: true, 'Option 2': true, 'Option 3': true })

    // radio
    wrapper.setProps({ listType: 'radio' })
    expect(listElements().at(0).find('input[type="radio"]')).toHaveLength(1)
    listElements().at(0).find('input[type="radio"]').simulate('change', { target: { checked: true } })

    expect(applyButton().prop('disabled')).toEqual(false)
    applyButton().simulate('click')
    expect(onApply).toReturnWith({ Option: true, 'Option 2': false, 'Option 3': false })

    wrapper.setProps({ onOptionClick: label =>  onClickHandlers[label].mockReturnValue(label) })
    listElements().at(1).find('input[type="radio"]').simulate('change', { target: { checked: true } })
    listElements().at(2).find('input[type="radio"]').simulate('change', { target: { checked: true } })
    expect(onApply).toReturnWith({ Option: true, 'Option 2': false, 'Option 3': false })

    applyButton().simulate('click')
    expect(onApply).toReturnWith({ Option: false, 'Option 2': false, 'Option 3': true })
  })

  it('renders search only list', () => {
    const wrapper = getWrapper({
      filter: {
        name: TEST_NAME,
        options: [...OPTIONS, 'test'].reduce((acc, optionName) => ({ ...acc, [optionName]: false }), {} as Options)
      }
    })
    const onApply = jest.fn()
    const applyButton = () => wrapper.find(attrName('sk-filter-apply', 'button'))
    const searchInput = () => wrapper.find(attrName('sk-filter-search-input', 'input'))
    const listElements = () => wrapper.find(attrName('sk-filter-dropdown-row', 'li'))

    wrapper.setProps({ searchOnly: true })
    expect(wrapper.find(attrName('sk-added-filter'))).toHaveLength(1)
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(false)
    wrapper.setProps(({ isActive: true }))
    expect(wrapper.find(PopOutBase).prop('visible')).toEqual(true)

    wrapper.setProps({ onApply: options => onApply.mockReturnValue(Object.keys(pickBy(options)).length) })

    expect(applyButton()).toHaveLength(1)
    expect(searchInput()).toHaveLength(1)
    expect(searchInput().is(':focus')).toEqual(true)

    searchInput().simulate('change', { target: { value: 'option' } })
    expect(listElements()).toHaveLength(OPTIONS.length)

    listElements().at(0).find('input[type="checkbox"]').simulate('change', { target: { checked: true } })
    listElements().at(1).find('input[type="checkbox"]').simulate('change', { target: { checked: true } })
    expect(listElements()).toHaveLength(OPTIONS.length)

    applyButton().simulate('click')
    expect(onApply).toReturnWith(2)
  })
})
