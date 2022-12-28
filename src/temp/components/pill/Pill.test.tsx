import * as React from 'react'
import { shallow, render } from 'enzyme'

import { Pill } from './Pill'

describe('Pill', () => {
  test('render', () => {
    const wrapper = shallow(<Pill iconName="urgent" text="Urgent" onClose={ jest.fn() } />)
    expect(wrapper).toMatchSnapshot()
  })

  test('shows specified icon', () => {
    const wrapper = shallow(<Pill iconName="urgent" text="Urgent" />)
    const Icon = wrapper.find('Icon')
    expect(Icon.length).toEqual(1)
    expect(Icon.prop('name')).toEqual('urgent')
  })

  test('adds close icon when required', () => {
    const closeSpy = jest.fn()
    const wrapper = shallow(<Pill onClose={ closeSpy } text="Option" />)
    const CloseIcon = wrapper.find('[data-sk-name="pill-close"]')
    expect(CloseIcon.length).toEqual(1)
    CloseIcon.simulate('click')
    expect(closeSpy).toBeCalled()
  })

  test('restricts text after 190px', () => {
    const wrapper = shallow(<Pill text="Blah blah blaaaaaaaaaaaaaahhhhhhhhhhhhhhhhh" />)
    expect(wrapper.find('OverflowTooltip').prop('maxWidth')).toEqual(190)
  })

  test('sets tooltip position', () => {
    const wrapper = shallow(<Pill text="Blah blah blaaaaaaaaaaaaaahhhhhhhhhhhhhhhhh" tooltipPosition="top" />)
    expect(wrapper.find('OverflowTooltip').prop('position')).toEqual('top')
  })
})
