import * as React from 'react'
import { render, mount } from 'enzyme'

import { PopOut } from '../../../popout/PopOut'
import { IconButtonDropdown } from '../IconButtonDropdown'

describe('IconButtonDropdown', () => {
  test('default render', () => {
    // Arrange
    const component = render(<IconButtonDropdown icon="ellipsisVertical" tooltipContent="Icon tooltip content" />)

    // Assert
    expect(component).toMatchSnapshot()
  })

  test('renders dropdown', () => {
    // Arrange
    const component = mount(
      <IconButtonDropdown icon="ellipsisVertical" tooltipContent="Icon tooltip content" data-sk-name="trigger">
        <div data-sk-name="test">Child content</div>
      </IconButtonDropdown>
    )

    // Assert
    expect(component.find(PopOut).length).toBe(1)
    component
      .find('[data-sk-name="trigger"]')
      .hostNodes()
      .simulate('click')
    expect(component.find('[data-sk-name="test"]').length).toBe(1)
  })

  test('renders adds correct class for open/close states', () => {
    // Arrange
    const component = mount(
      <IconButtonDropdown icon="ellipsisVertical" tooltipContent="Icon tooltip content" data-sk-name="trigger">
        <div data-sk-name="test">Child content</div>
      </IconButtonDropdown>
    )
    // Assert
    expect(component.find(PopOut).length).toBe(1)
    expect(
      component
        .find('[data-sk-name="trigger"]')
        .hostNodes()
        .hasClass('sked-button--active')
    ).toBe(false)
    component
      .find('[data-sk-name="trigger"]')
      .hostNodes()
      .simulate('click')
    expect(
      component
        .find('[data-sk-name="trigger"]')
        .hostNodes()
        .hasClass('sked-button--active')
    ).toBe(true)
  })
})
