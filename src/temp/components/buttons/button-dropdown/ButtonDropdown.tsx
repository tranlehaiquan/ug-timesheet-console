import * as React from 'react'

import { Button, ButtonTypes } from '../button/Button'
import { Icon } from '../../icon/Icon'
import { Dropdown } from '../../dropdown/Dropdown'

interface IButtonDropdownProps extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * Text to display on the button
   */
  label: string
  /**
   * Pass additional class names
   */
  className?: string
  /**
   * Compact sized button—used when space is tight - allowing more room for content
   */
  compact?: boolean
  /**
   * Disable the button
   */
  disabled?: boolean
  /**
   * Button type styles
  */
  buttonType?: ButtonTypes
}

export interface IButtonDropdownState {
  activeDropdown: boolean
}

/**
 * The DropdownButton component displays/hides children as a dropdown when clicked. The Menu and MenuItem
 components are strongly recommended to be used in conjuction with this component to enforce correct styling of the dropdown menu.
 */
export class ButtonDropdown extends React.PureComponent<IButtonDropdownProps, IButtonDropdownState> {
  constructor(props: IButtonDropdownProps) {
    super(props)

    this.state = {
      activeDropdown: false
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.hideDropdown)
  }

  componentWillUnmount() {
    this.closeDropdown()
    window.removeEventListener('resize', this.hideDropdown)
  }

  closeDropdown = () => {
    if (this.state.activeDropdown) {
      this.hideDropdown()
      document.removeEventListener('click', this.closeDropdown)
    }
  }

  listenerClick = (e: any) => {
    this.showDropdown()
    document.addEventListener('click', this.closeDropdown)
  }

  showDropdown = () => {
    this.setState({ activeDropdown: true })
  }

  hideDropdown = () => {
    this.setState({ activeDropdown: false })
  }

  render() {
    const { compact, label, onClick, children, className, ...otherProps } = this.props
    const { activeDropdown } = this.state

    return (
      <Dropdown
        visible={ activeDropdown }
        placement="bottom-start"
        trigger={
          <Button
            className={ className }
            buttonType={ this.props.buttonType || 'secondary' }
            compact={ compact }
            onClick={ this.listenerClick }
            { ...otherProps }
          >
            { label }
            <Icon name="chevronDown" className="sk-ml-2" size={ 8 } />
          </Button>
        }
      >
        { children }
      </Dropdown>
    )
  }
}
