import * as React from 'react'
import { render, shallow, mount } from 'enzyme'

import { PopOut } from '../PopOut'

describe('PopOut', () => {
  test('renders with correct initial state', () => {
    // Arrange
    const component = shallow<PopOut>(<PopOut trigger={ <div>Popping out!</div> }>Hi</PopOut>)

    // Assert
    expect(component.state().openPopout).toBe(false)
  })

  test('display popout when trigger clicked', () => {
    // Arrange
    const component = mount<PopOut>(<PopOut trigger={ <div data-sk-name="popout-trigger">Popping out!</div> }><div data-sk-name="popout-child">child popout content</div></PopOut>)

    // Act
    expect(component.find('[data-sk-name="popout-child"]')).toHaveLength(0)
    component.find('[data-sk-name="popout-trigger"]').simulate('click')
    expect(component.find('[data-sk-name="popout-child"]')).toHaveLength(1)
  })
})
