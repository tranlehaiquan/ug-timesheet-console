import * as React from 'react'

import { PopOutBase, IPopOutBase } from './PopOutBase'

interface IPopOutProps {
  /**
   * The element you are rendering the content from
   */
  trigger: IPopOutBase['trigger'],
  /**
   * The position where the content will try to fit
   */
  placement?: IPopOutBase['placement']
}

export interface IPopOutState {
  openPopout: boolean
}

/**
 * The PopOut component displays/hides it's children when it's supplied trigger is clicked.
 * Default placement is bottom-start
 *
 * @requires PopOutBase
 */
export class PopOut extends React.PureComponent<IPopOutProps, IPopOutState> {
  constructor(props: IPopOutProps) {
    super(props)

    this.state = {
      openPopout: false
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
    if (this.state.openPopout) {
      this.hideDropdown()
      document.removeEventListener('click', this.closeDropdown)
    }
  }

  listenerClick = (e: React.MouseEvent) => {
    this.showDropdown()
    document.addEventListener('click', this.closeDropdown)
  }

  showDropdown = () => {
    this.setState({ openPopout: true })
  }

  hideDropdown = () => {
    this.setState({ openPopout: false })
  }

  render() {
    const { trigger, placement, children } = this.props
    const { openPopout } = this.state

    return openPopout
      ? (
        <PopOutBase
          placement={ placement || 'bottom-start' }
          trigger={ trigger }
        >
          { children }
        </PopOutBase>
      )
      : <div onClick={ this.listenerClick }>{ trigger }</div>
  }
}
