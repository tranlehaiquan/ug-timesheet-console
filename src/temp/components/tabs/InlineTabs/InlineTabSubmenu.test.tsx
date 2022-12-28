import * as React from 'react'
import { InlineTabSubmenu, MenuNotification } from './InlineTabSubmenu'
import { render, shallow } from 'enzyme'

import { MenuItem } from '../../menu/Menu'

describe('InlineTabSubmenu', () => {
  const items = [{ id: 'hello', name: 'Hello' }, { id: 'world', name: 'World', icon: '2' }]
  const itemClickSpy = jest.fn()

  afterEach(() => {
    itemClickSpy.mockRestore()
  })

  test('renders', () => {
    // Arrange
    const component = render(<InlineTabSubmenu items={ items } onMouseLeave={ jest.fn() } activeItem={ items[0].id } onItemClick={ itemClickSpy } />)

    // Assert
    expect(component).toMatchSnapshot()
  })

  test('renders icon', () => {
    // Arrange
    const component = shallow(<InlineTabSubmenu items={ items } onMouseLeave={ jest.fn() } activeItem={ items[0].id } onItemClick={ itemClickSpy } />)

    // Assert
    expect(component.find(MenuNotification)).toHaveLength(1)
    expect(
      component
        .find(MenuNotification)
        .dive()
        .find('p')
        .first()
        .text()
    ).toBe('2')
  })

  test('click item returns correct payload', () => {
    // Arrange
    const component = shallow(<InlineTabSubmenu items={ items } onMouseLeave={ jest.fn() } activeItem={ items[0].id } onItemClick={ itemClickSpy } />)
    const firstItem = component.find(MenuItem).first()
    const secondItem = component.find(MenuItem).at(1)

    // Act
    firstItem.simulate('click')
    expect(itemClickSpy).toBeCalledWith(items[0].id)

    secondItem.simulate('click')
    expect(itemClickSpy).toBeCalledWith(items[1].id)
  })
})
