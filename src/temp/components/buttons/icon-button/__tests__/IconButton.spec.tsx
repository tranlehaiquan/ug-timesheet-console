import * as React from 'react'
import { render, shallow, mount } from 'enzyme'

import { Tooltip } from '../../../popups/tooltip/Tooltip'
import { Icon } from '../../../icon/Icon'
import { Button } from '../../button/Button'
import { IconButton } from '../IconButton'

describe('IconButton', () => {
  test('default render', () => {
    // Arrange
    const component = render(<IconButton icon="ellipsisVertical" tooltipContent="Icon tooltip content" />)

    // Assert
    expect(component).toMatchSnapshot()
  })

  test('has tooltip', () => {
    // Arrange
    const component = shallow(<IconButton icon="ellipsisVertical" tooltipContent="Icon tooltip content" />)

    // Assert
    expect(component.find(Tooltip).length).toBe(1)
  })

  test('adds correct class', () => {
    // Arrange
    const component = shallow(<IconButton icon="ellipsisVertical" tooltipContent="Icon tooltip content" />)

    // Assert
    expect(component.find(Button).hasClass('sked-button--icon-only')).toBe(true)
  })

  test('defaults to transparent button', () => {
    // Arrange
    const component = shallow(<IconButton icon="ellipsisVertical" tooltipContent="Icon tooltip content" />)

    // Assert
    expect(component.find(Button).prop('buttonType')).toBe('transparent')
  })

  test('uses correct icon', () => {
    // Arrange
    const component = mount(<IconButton icon="ellipsisVertical" tooltipContent="Icon tooltip content" />)

    // Assert
    expect(component.find(Icon).length).toBe(1)
    expect(component.find(Icon).prop('name')).toEqual('ellipsisVertical')
  })
})
