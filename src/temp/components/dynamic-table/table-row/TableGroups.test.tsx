import * as React from 'react'
import { shallow } from 'enzyme'
import { TableGroups } from './TableGroups'
import { TableConfig } from '../DynamicTable-utils'
import { TableGroupHeader } from './TableGroupHeader'
import { TableRows } from './TableRows'

interface TestData {
  field1: string,
  field2: string
}

const createSampleProps = (customProps?: any) => ({
  groupedData: [
    {
      name: 'label1',
      data: [
        { field1: 'value111', field2: 'value112' },
        { field1: 'value121', field2: 'value122' },
        { field1: 'value131', field2: 'value132' }
      ]
    },
    {
      name: 'label2',
      data: [
        { field1: 'value211', field2: 'value212' },
        { field1: 'value221', field2: 'value222' }
      ]
    }
  ],
  config: {
    columns: [
      { key: 'field1' }
    ]
  } as TableConfig<TestData>,
  selectChecked: () => {},
  selectHandler: () => () => {},
  ...customProps
})

describe('TableGroups', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<TableGroups { ...createSampleProps() } />)
    expect(wrapper.find(TableGroupHeader).length).toBe(2)
    expect(wrapper.find(TableRows).length).toBe(2)
  })

  it('correctly passes props to header component', () => {
    const props = createSampleProps()
    const wrapper = shallow(<TableGroups { ...props } />)
    props.groupedData.forEach((group, index) => {
      const header = wrapper.find(TableGroupHeader).at(index)
      expect(header.prop('config')).toEqual(props.config)
      expect(header.prop('label')).toEqual(group.label)
      expect(header.prop('groupSize')).toEqual(group.data.length)
    })
  })

  it('correctly passes props to rows component', () => {
    const props = createSampleProps()
    const wrapper = shallow(<TableGroups { ...props } />)
    const rows = wrapper.find(TableRows).first()
    expect(rows.prop('config')).toEqual(props.config)
    expect(rows.prop('data')).toEqual(props.groupedData[0].data)
  })

  it('no groups', () => {
    const props = {
      groupedData: []
    }
    const wrapper = shallow(<TableGroups { ...createSampleProps(props) } />)
    expect(wrapper.find(TableGroupHeader).length).toBe(0)
    expect(wrapper.find(TableRows).length).toBe(0)
  })

})
