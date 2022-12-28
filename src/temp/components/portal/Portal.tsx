import * as React from 'react'
import isEqual from 'react-fast-compare'
import { createPortal } from 'react-dom'

interface IProps {
  portalContentRef?: (element: HTMLDivElement) => void
  position?: Partial<{
    left: number
    top: number
    minWidth: number
    bottom: number
    right: number
    maxWidth: number
  }>
}

export class Portal extends React.PureComponent<IProps, {}> {
  private _root = document.createElement('div')
  private _portalId = 'sked-portal-dropdown'

  componentDidMount() {
    document.body.appendChild(this._root)
    this._root.setAttribute('id', this._portalId)
    this.setRootContainerPosition()

    if (this.props.portalContentRef){
      this.props.portalContentRef(this._root)
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this._root)
  }

  componentDidUpdate(prevProps: IProps) {
    if (!isEqual(prevProps.position, this.props.position)) {
      this.setRootContainerPosition()
    }
  }

  setRootContainerPosition = () => {
    const { position } = this.props

    this._root.style.zIndex = '9999'
    this._root.style.position = 'fixed'

    if (position) {
      this._root.style.minWidth = `${position.minWidth}px`
      this._root.style.maxWidth = `${position.maxWidth}px`
      this._root.style.top = `${position.top}px`
      this._root.style.bottom = `${position.bottom}px`
      this._root.style.right = `${position.right}px`
      this._root.style.left = `${position.left}px`
    }
  }

  render() {
    return <>{ createPortal(this.props.children, this._root) } </>
  }
}
