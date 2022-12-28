import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { number, select } from '@storybook/addon-knobs/react'

import { Badge } from './Badge'

storiesOf('Badge', module)
  .add('Badge', () => {
    return (
      <Badge
        count={ number('count value', 1) }
        countLimiter={ number('countLimiter value', 10) }
        badgeType={ select('Badge type', ['default', 'primary', 'important', 'neutral'], 'default') }
      />
    )
  })
