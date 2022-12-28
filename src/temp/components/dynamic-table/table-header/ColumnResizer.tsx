import * as React from 'react'
import classnames from 'classnames'

interface IResizerProps {
  onResize: React.Dispatch<React.SetStateAction<number|string>>
  min: number
}

export const ColumnResizer: React.FC<IResizerProps> = React.memo(({ onResize, min }) => {

  const ref = React.useRef(null)
  const indicatorRef = React.useRef(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isResizing, setIsResizing] = React.useState(false)
  const indicatorHeight = calcInitialIndicatorHeight(ref)

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    window.addEventListener('mousemove', onResizeHandler)
    window.addEventListener('mouseup', onResizeEnd)
  }

  const onResizeEnd = (e: MouseEvent) => {
    e.preventDefault()
    setIsResizing(false)
    setIsVisible(false)
    window.removeEventListener('mousemove', onResizeHandler)
    window.removeEventListener('mouseup', onResizeEnd)
  }

  const onResizeHandler = (e: MouseEvent) => {
    e.preventDefault()
    const thElement = ref.current.parentElement
    const currentWidth = thElement.offsetWidth
    const newWidth = Math.max(min, currentWidth + e.movementX)

    if (newWidth !== currentWidth) {
      const tab = ref.current.closest('table')
      tab.style.width = `${tab.offsetWidth + e.movementX}px`
      onResize(newWidth)
      indicatorRef.current.style.height = `${tab.clientHeight - 1}px`
    }
  }

  const onShowHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsVisible(true)
  }

  const onHideHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isResizing) {
      setIsVisible(false)
    }
  }

  const visibilityClass = isVisible ? 'sk-visible' : 'sk-hidden'

  return (
    <span
      data-sk-name="sk-resize-container"
      ref={ ref }
      onMouseDown={ onResizeStart }
      onMouseEnter={ onShowHandler }
      onMouseLeave={ onHideHandler }
      className="sked-column-resizer-container"
    >
      <span
        data-sk-name="sk-resize-indicator"
        ref={ indicatorRef }
        className={ classnames('sked-column-resizer-indicator', visibilityClass) }
        style={ { height: indicatorHeight } }
      />
      <span
        data-sk-name="sk-resize-handle"
        className={ classnames('sked-column-resizer-handle', visibilityClass) }
      />
    </span>
  )
})

const calcInitialIndicatorHeight = (containerRef: React.RefObject<HTMLSpanElement>) => {
  return containerRef.current && containerRef.current.closest('table')
    ? containerRef.current.closest('table').clientHeight - 1
    : 0
}
