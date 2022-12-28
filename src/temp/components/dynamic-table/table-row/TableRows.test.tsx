import * as React from 'react'
import { shallow } from 'enzyme'
import { TableRows } from './TableRows'
import { TableConfig } from '../DynamicTable-utils'
import { TableRowRenderer } from './TableRowRenderer'
import set from 'lodash/set'

interface TestData {
  field1: string,
  field2: string,
  field3: string
}

const getDefaultTestProps = (additionalProps = {}) => ({
  data: [
    { field1: 'value11', field2: 'value12', field3: 'value' },
    { field1: 'value21', field2: 'value22', field3: 'value' },
    { field1: 'value31', field2: 'value32', field3: 'value' }
  ],
  config: {
    columns: [
      { key: 'field1' },
      { key: 'field2', sortable: true }
    ]
  } as TableConfig<TestData>,
  selectChecked: () => {},
  selectHandler: () => () => {},
  ...additionalProps
})

describe('TableRows', () => {

  it('renders proper number of rows', () => {
    const props = getDefaultTestProps()
    const wrapper = shallow(<TableRows { ...props } />)

    expect(wrapper.find(TableRowRenderer).length).toEqual(props.data.length)
  })

  it('properly assign row className based on config', () => {
    const props = getDefaultTestProps()
    const wrapper = shallow(<TableRows { ...props } />)

    expect(wrapper.find(TableRowRenderer).first().prop('className')).toEqual('')

    set(props, 'config.rowClasses', 'class1')
    wrapper.setProps({ config: props.config })
    expect(wrapper.find(TableRowRenderer).first().prop('className')).toEqual('class1')
  })

  it('empty array case', () => {
    const props = getDefaultTestProps({ data: [] })
    const wrapper = shallow(<TableRows { ...props } />)
    expect(wrapper.find(TableRowRenderer).length).toEqual(0)
  })

})
