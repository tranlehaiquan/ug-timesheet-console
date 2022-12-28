import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean, select } from '@storybook/addon-knobs/react'

const image = require('../../../assets/avatar.png')

import { Avatar } from './Avatar'
storiesOf('Images', module).add(
  'Avatar',
  () => {
    const withImage = boolean('With image', false)
    return (
      <Avatar
        name={ text('Name', 'Mr Robot') }
        showTooltip={ boolean('Show tooltip', false) }
        size={ select('Size', { Tiny: 'tiny', Small: 'small', Medium: 'medium', Large: 'large' }, 'medium') }
        imageUrl={ withImage &&  image }
      />
    )
  }
)
