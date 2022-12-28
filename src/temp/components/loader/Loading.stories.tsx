import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { number, text, select } from '@storybook/addon-knobs/react'

import { Loading } from './Loading'
import { LoadingSpinner } from './spinner/LoadingSpinner'

storiesOf('Loading', module)
  .add('Loading', () => (<Loading align={ select('Align', ['center', 'left', 'right'], 'center') } />))
  .add('LoadingSpinner', () => (<LoadingSpinner size={ number('Size', 24) || undefined } color={ text('Color', 'currentColor') || undefined } />))
