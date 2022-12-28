import * as React from 'react'
import { shallow, mount } from 'enzyme'

import { TableRowRenderer } from './TableRowRenderer'
import { TableConfigColumns } from '../DynamicTable-utils'
import { TableCell } from '../../table/Table'
import { Tooltip } from '../../popups/tooltip/Tooltip'

const getDefaultTestProps = (additionalProps = {}) => {
  return {
    rowData: { test: 'any' },
    config: { columns: [
      { key:'test' } as TableConfigColumns<{test: string}, 'test'>
    ] } ,
    rowIndex: 0,
    ...additionalProps
  }
}
const defaultColumns = (num = 1, options = {}) => ({ columns: Array.from(Array(num)).map(() => ({ key: 'test', ...options })) })

const getWrapper = props => mount(
  <table>
    <tbody>
      <TableRowRenderer { ...props } />
    </tbody>
  </table>
)

describe('TableRowRenderer', () => {

  it('renders proper number of cells', () => {
    const wrapper = shallow(<TableRowRenderer { ...getDefaultTestProps() } />)

    expect(wrapper.find(TableCell).length).toEqual(1)

    wrapper.setProps({ config: { ...defaultColumns(2) } })
    expect(wrapper.find(TableCell).length).toEqual(2)

    wrapper.setProps({ config: { ...defaultColumns(5) } })
    expect(wrapper.find(TableCell).length).toEqual(5)

    wrapper.setProps({ onSelect: () => {}, config: { ...defaultColumns(5), options: { selectable: { selectBy: 'test' } } } })
    expect(wrapper.find(TableCell).length).toEqual(6)

  })

  it('cellRenderer renders custom HTML', () => {
    const cellRenderer = (data, row, index, rowIndex) => (
      <div className="test-class-wrapper">
        <div className="test-class">{ data } { index } { rowIndex } { row.test }</div>
      </div>
    )
    const props = getDefaultTestProps({ config: { ...defaultColumns(1, { cellRenderer }) } })

    const wrapper = getWrapper(props)

    const contentWrapper = wrapper.find('.test-class-wrapper')
    const cell = contentWrapper.first()
    expect(contentWrapper.length).toEqual(1)
    expect(cell.length).toEqual(1)
    expect(cell.text()).toEqual('any 0 0 any')

  })

  it('cellRenderer renders custom component', () => {
    const cellRenderer = data => (
      <Tooltip content={ data } position="left">
        <div>{ data } test</div>
      </Tooltip>
    )
    const props = getDefaultTestProps({ config: { ...defaultColumns(1, { cellRenderer }) } })
    const wrapper = getWrapper(props)

    const tooltip = wrapper.find(Tooltip)
    expect(tooltip.length).toEqual(1)
    expect(tooltip.prop('content')).toEqual('any')
    expect(tooltip.text()).toEqual('any test')
  })

  it('renders proper empty state', () => {
    const rowData = { test: null }
    const emptyPlaceholderText = 'no value'
    const config = {
      columns:[
        { key: 'no-key' },
        { emptyPlaceholderText, key: 'no-key2' },
        { key: 'test' }
      ]
    }

    const props = getDefaultTestProps({ config, rowData })
    const wrapper = getWrapper(props)

    const cells = wrapper.find(TableCell)
    expect(cells.at(0).length).toEqual(1)
    expect(cells.at(0).text()).toEqual('No no-key data')

    expect(cells.at(1).length).toEqual(1)
    expect(cells.at(1).text()).toEqual(emptyPlaceholderText)

    expect(cells.at(2).length).toEqual(1)
    expect(cells.at(2).text()).toEqual('No test data')

  })

  it('renders select', () => {
    const onSelect = jest.fn()
    const props = { onSelect, config: { ...defaultColumns(1), options: { selectable: { selectBy: 'test' } } } }
    const wrapper = getWrapper(getDefaultTestProps(props))

    const cells = wrapper.find(TableCell)
    const selectCell = cells.at(0)

    expect(selectCell.find('input').length).toEqual(1)
    selectCell.simulate('change')

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

})
