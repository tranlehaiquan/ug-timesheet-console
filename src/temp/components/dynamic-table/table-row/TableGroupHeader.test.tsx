import * as React from 'react'
import { shallow } from 'enzyme'

import { TableGroupHeader } from './TableGroupHeader'
import { Badge } from '../../badge/Badge'

describe('TableGroupHeader', () => {

  const props = {
    name: 'label1',
    config: {
      columns: [
        { key: 'field1' }
      ]
    },
    groupSize: 5
  }
  const wrapper = shallow(<TableGroupHeader { ...props } />)

  it('renders correct structure', () => {
    expect(wrapper.find('td').length).toBe(1)
    expect(wrapper.find('td').find('span').length).toBe(1)
    expect(wrapper.find('td').find(Badge).length).toBe(1)
  })

  it('group name is correct', () => {
    expect(wrapper.find('td').find('span').at(0).text()).toBe(props.name)
  })

  it('text is uppercased', () => {
    expect(wrapper.find('td').hasClass('sk-uppercase')).toBe(true)
  })

  it('correct group size label', () => {
    expect(wrapper.find('td').find(Badge).props().count.toString()).toBe(JSON.stringify(props.groupSize))
  })

  it('colspan is correct', () => {
    expect(wrapper.find('td').prop('colSpan')).toEqual(props.config.columns.length + 1)
  })

})
