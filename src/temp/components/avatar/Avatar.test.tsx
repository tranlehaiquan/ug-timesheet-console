import * as React from 'react'
import { Avatar } from './Avatar'
import { shallow, render } from 'enzyme'

describe('Avatar', () => {
  it('renders correctly', () => {
    const avatar = render(<Avatar name="Elliot Alderson" />)

    expect(avatar).toMatchSnapshot()
  })

  it('should use first initials of passed in name', () => {
    const avatar = shallow(<Avatar name="Angela moss" data-sk-name="test" />)

    expect(avatar.find('[data-sk-name="test"]').text()).toEqual('AM')
  })

  it('should use the first 2 letters of a name if there is no last name', () => {
    const avatar = shallow(<Avatar name=" Angela" data-sk-name="test" />)

    expect(avatar.find('[data-sk-name="test"]').text()).toEqual('AN')
  })

  it('should not apply a tooltip unless required', () => {
    const avatar = shallow(<Avatar name="Mr Robot" />)

    expect(avatar.find('Tooltip').length).toEqual(0)
  })

  it('should apply a tooltip if required', () => {
    const avatar = shallow(<Avatar name="Darlene" showTooltip />)

    expect(avatar.find('Tooltip').length).toEqual(1)
    expect(avatar.find('Tooltip').prop('content')).toEqual('Darlene')
  })

  it('should use supplied tooltip text', () => {
    const avatar = shallow(<Avatar name="Darlene" showTooltip tooltipText="Hello" />)

    expect(avatar.find('Tooltip').prop('content')).toEqual('Hello')
  })

  it('displays an image if url is supplied', () => {
    const avatar = shallow(<Avatar name="Darlene" imageUrl="./test.png" />)

    expect(avatar.find('img').prop('src')).toEqual('./test.png')
  })

  it('applies image class if using image', () => {
    const avatar = shallow(<Avatar name="Darlene" imageUrl="./test.png" />)

    expect(avatar.find('img').hasClass('sked-avatar__image')).toBe(true)
  })

  it('applies correct sizing classes', () => {
    const avatar = shallow(<Avatar name="Darlene" data-sk-name="test" />)

    expect(avatar.find('[data-sk-name="test"]').hasClass('sked-avatar')).toBe(true)

    avatar.setProps({ size: 'tiny' })
    expect(avatar.find('[data-sk-name="test"]').hasClass('sked-avatar--tiny')).toBe(true)

    avatar.setProps({ size: 'small' })
    expect(avatar.find('[data-sk-name="test"]').hasClass('sked-avatar--small')).toBe(true)

    avatar.setProps({ size: 'large' })
    expect(avatar.find('[data-sk-name="test"]').hasClass('sked-avatar--large')).toBe(true)
  })
})
