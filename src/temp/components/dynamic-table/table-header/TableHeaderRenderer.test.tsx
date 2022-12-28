import * as React from 'react'
import { shallow } from 'enzyme'

import { TableHeaderRenderer } from './TableHeaderRenderer'
import { TableHead } from '../../table/Table'
import { FormInputElement } from '../../forms/FormElements'
import { sortDirection } from '../DynamicTable-utils'
import { Condenser } from '../condenser/Condenser'

const defaultTestString = 'testString'

const getDefaultTestProps = (name = undefined, sortable = false) => {
  return {
    className: 'test-class',
    columns:  [{ name, sortable, key: defaultTestString }],
    sortDirection: 'asc' as sortDirection,
    sortHandler: test => test
  }
}

describe('TableHeaderRenderer generates cells object', () => {

  let wrapper
  beforeEach(() => {
    wrapper = shallow(<TableHeaderRenderer { ...getDefaultTestProps() } />)
  })
  const testName = 'testName'

  it('with proper structure', () => {
    const cells = wrapper.find(TableHead).props().cells

    expect(cells.length).toEqual(1)
    expect(cells[0].name).toEqual(defaultTestString)
    expect(cells[0].content).toBeDefined()
  })

  it('with default key name', () => {
    const cells = wrapper.find(TableHead).props().cells
    const label = (<Condenser>{ cells[0].name }</Condenser>)
    const content = shallow(cells[0].content(label) as React.ReactElement)

    expect(content.text()).toEqual('<Condenser />')
    expect(content.find(Condenser).props().children).toEqual(defaultTestString)
  })

  it('with custom name', () => {
    wrapper.setProps(getDefaultTestProps(testName))

    const cells = wrapper.find(TableHead).props().cells
    const label = (<Condenser>{ cells[0].name }</Condenser>)
    const content = shallow(cells[0].content(label) as React.ReactElement)

    expect(content.text()).toEqual('<Condenser />')
    expect(content.find(Condenser).props().children).toEqual(testName)
  })

  it('with sort icon', () => {
    wrapper.setProps(getDefaultTestProps(testName, true))

    const cells = wrapper.find(TableHead).props().cells
    const label = (<Condenser>{ cells[0].name }</Condenser>)
    const content = shallow(cells[0].content(label) as React.ReactElement)

    expect(content.text()).toEqual('<Condenser /><Icon />')
    expect(content.find(Condenser).props().children).toEqual(testName)
  })

  it('with select all cell', () => {
    wrapper.setProps({
      ...getDefaultTestProps(testName),
      selectable: true
    })

    const cells = wrapper.find(TableHead).props().cells

    expect(cells.length).toEqual(2)
    expect(cells[0].name).toEqual('select-all')
    expect(cells[0].content).toBeDefined()
    expect(cells[1].name).toEqual(testName)
    expect(cells[1].content).toBeDefined()
  })

  it('has empty select cell', () => {
    wrapper.setProps({
      ...getDefaultTestProps(testName),
      selectable: true
    })

    const cells = wrapper.find(TableHead).props().cells

    const emptySelect = shallow(cells[0].content('') as React.ReactElement)
    expect(emptySelect.text()).toEqual('')
    expect(emptySelect.find(FormInputElement).length).toEqual(0)
  })

  it('has select all input', () => {
    wrapper.setProps({
      ...getDefaultTestProps(testName),
      selectable: true,
      selectAll: true
    })

    const cells = wrapper.find(TableHead).props().cells

    const allSelect = shallow(cells[0].content('') as React.ReactElement)
    expect(allSelect.find(FormInputElement).length).toEqual(1)
  })
})
