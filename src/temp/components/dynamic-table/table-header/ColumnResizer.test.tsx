import * as React from 'react'
import { shallow, mount } from 'enzyme'

import { ColumnResizer } from './ColumnResizer'

const selectors = {
  container: '[data-sk-name="sk-resize-container"]',
  indicator: '[data-sk-name="sk-resize-indicator"]',
  handle: '[data-sk-name="sk-resize-handle"]'
}

const sampleOnResizeHandler = (width: number) => { }

const getTableWithResizer = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <p>sample_cell_content</p>
            <ColumnResizer
              onResize={ sampleOnResizeHandler }
              min={ 120 }
            />
          </th>
        </tr>
      </thead>
    </table>
  )
}

describe('ColumnResizer', () => {

  test('Renders properly', () => {
    const table = mount(getTableWithResizer())
    expect(table).toMatchSnapshot()
    expect(table.find(selectors.container).length).toEqual(1)
    expect(table.find(selectors.indicator).length).toEqual(1)
    expect(table.find(selectors.handle).length).toEqual(1)
  })

  test('Is hidden by default', () => {
    const table = mount(getTableWithResizer())
    const indicator = table.find(selectors.indicator)
    expect(indicator.hasClass('sk-visible')).toEqual(false)
    expect(indicator.hasClass('sk-hidden')).toEqual(true)
    const handle = table.find(selectors.handle)
    expect(handle.hasClass('sk-visible')).toEqual(false)
    expect(handle.hasClass('sk-hidden')).toEqual(true)
  })

  test('Shows handle and indicator on mouseenter event', () => {
    const table = mount(getTableWithResizer())
    const container = table.find(selectors.container)

    let indicator = table.find(selectors.indicator)
    let handle = table.find(selectors.handle)
    expect(indicator.hasClass('sk-visible')).toEqual(false)
    expect(indicator.hasClass('sk-hidden')).toEqual(true)
    expect(handle.hasClass('sk-visible')).toEqual(false)
    expect(handle.hasClass('sk-hidden')).toEqual(true)

    container.simulate('mouseenter')
    indicator = table.find(selectors.indicator)
    handle = table.find(selectors.handle)
    expect(indicator.hasClass('sk-visible')).toEqual(true)
    expect(indicator.hasClass('sk-hidden')).toEqual(false)
    expect(handle.hasClass('sk-visible')).toEqual(true)
    expect(handle.hasClass('sk-hidden')).toEqual(false)
  })

  test('Hides handle and indicator on mouseleave event', () => {
    const table = mount(getTableWithResizer())
    const container = table.find(selectors.container)

    let indicator = table.find(selectors.indicator)
    let handle = table.find(selectors.handle)
    expect(indicator.hasClass('sk-visible')).toEqual(false)
    expect(indicator.hasClass('sk-hidden')).toEqual(true)
    expect(handle.hasClass('sk-visible')).toEqual(false)
    expect(handle.hasClass('sk-hidden')).toEqual(true)

    container.simulate('mouseenter')
    container.simulate('mouseleave')

    indicator = table.find(selectors.indicator)
    handle = table.find(selectors.handle)
    expect(indicator.hasClass('sk-visible')).toEqual(false)
    expect(indicator.hasClass('sk-hidden')).toEqual(true)
    expect(handle.hasClass('sk-visible')).toEqual(false)
    expect(handle.hasClass('sk-hidden')).toEqual(true)
  })

})
