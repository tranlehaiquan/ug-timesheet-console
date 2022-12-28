import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { text, select } from '@storybook/addon-knobs/react'

import { Button } from '../../buttons/button/Button'
import { InfoWindow } from './InfoWindow'

storiesOf('InfoWindow', module)
  .addParameters({
    info: {
      propTablesExclude: [Button]
    }
  })
  .add(
    'Basic',
    () => {
      const { buttonText, content } = generateContentKnobs()
      return (
        <InfoWindow event={ 'click' } position={ 'top' } content={ content } displayInline>
          <Button buttonType="primary">{ buttonText }</Button>
        </InfoWindow>
      )
    }
  )
  .add(
    'Toggling',
    () => {
      const { event } = generateTriggerKnobs()
      const { buttonText, content } = generateContentKnobs()

      return (
        <InfoWindow key={ event } event={ event } position={ 'top' } content={ content }>
          <Button buttonType="primary">{ buttonText }</Button>
        </InfoWindow>
      )
    },
    {
    info: `
    ### Notes
    Info windows can be opened in a number of ways using the 'event' property.  The available options are:
    - 'click' - This will open the info window when the trigger (child element) is clicked.  We use this mainly for infow windows that are toggled open and close.
    - 'hover' - This will open the info window when the child element is moused over and then closes when the mouse leaves.  We use this mainly for tooltip displays.
    - 'mount' - This will open the info window as soon as the component is mounted.  This is a special case trigger event, be aware that it will be entirely up to the parent component to show or hide the info window.`
    }
  )
  .add(
    'Positioning',
    () => {
      const { position, triggerStyles, buttonPosition } = generatePosistioningKnobs()
      const { event } = generateTriggerKnobs()
      const { buttonText, content } = generateContentKnobs()

      return (
        <InfoWindow key={ event + position + buttonPosition } event={ event } position={ position } content={ content } style={ triggerStyles }>
          <Button buttonType="primary">{ buttonText }</Button>
        </InfoWindow>
      )
    },
    {
    info: `
    ### Notes
    The InfoWindow will try to render the content being displayed within its parent window.  So when the info window is triggered it will do an initial render of the content to determine its dimensions.

    With those dimensions it will try to find the best fit for the content around the trigger without having it overflow the viewing window.  It will "prefer" to use the position you have provided in the property set,
    but it may move to other points around the trigger to fit the content.

    If all options are exhausted and no point will allow rendering the full content then it will render the content in the position that will show the most area of the content.`,
    }
  )

const generatePosistioningKnobs = () => {
  const buttonPosition = select('Trigger Button Position', ['center', 'top-left', 'top', 'top-right', 'left', 'right', 'bottom-left', 'bottom', 'bottom-right'], 'center')
  const triggerStyles = calculateButtonStyles(buttonPosition)
  const position = select('InfoWindow Position', ['top', 'right', 'bottom', 'left'], 'top')

  return {
    position,
    triggerStyles,
    buttonPosition
  }
}

const generateTriggerKnobs = () => {
  const event = select('InfoWindow Trigger Event', ['click', 'hover', 'mount'], 'click')

  return {
    event
  }
}

const generateContentKnobs = () => {
  const buttonText = text('Trigger Button Text', 'Click Me')
  const contentText = text('InfoWindow Content', 'Simple info window content')
  const content = <div style={ { padding: '16px', maxWidth: '200px' } }>{ contentText }</div>

  return {
    buttonText,
    content
  }
}

const calculateButtonStyles = (buttonPosition: string) => {
  if (buttonPosition === 'center') {
    return {}
  }

  const positionKeys = buttonPosition.split('-')
  return positionKeys.reduce(
    (acc, current) => {
      return {
        ...acc,
        [current]: '10px'
      }
    },
    {
      position: 'absolute'
    }
  )
}
