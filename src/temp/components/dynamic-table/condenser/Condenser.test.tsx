import * as React from 'react'
import { Condenser } from './Condenser'
import { mount, render } from 'enzyme'
import { Tooltip } from '../../popups/tooltip/Tooltip'

const selectors = {
  childrenContainer: '[data-sk-name="children-container"]'
}

const getSampleCondenser: (children?: string | React.ReactNode) => React.ReactElement = (children = '') => (
  <Condenser>
    { children }
  </Condenser>
)

describe('Condenser', () => {

  test('with string label', () => {
    const label = 'sample-label'
    const condenser = mount(getSampleCondenser(label))
    const childrenContainer = condenser.find(selectors.childrenContainer)
    expect(childrenContainer.text()).toEqual(label)
  })

  test('with child component', () => {
    const condenser = render(getSampleCondenser((
      <>
        <p>child1</p>
        <p>child2</p>
      </>
    )))
    expect(condenser).toMatchSnapshot()
  })

  test('correct tooltip settings', () => {
    const condenser = mount(getSampleCondenser())
    const tooltip = condenser.find(Tooltip)
    expect(tooltip.length).toEqual(1)
    expect(tooltip.props().position).toEqual('top')
    expect(tooltip.props().className).toEqual('sk-truncate')
    expect(tooltip.props().delayShow).toEqual(250)
    expect(tooltip.props().preventShow).toEqual(true)
  })

})
