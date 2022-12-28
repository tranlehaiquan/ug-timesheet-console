import * as React from 'react'
import { storiesOf } from '@storybook/react'

import { TestComponent } from './TestComponent'

if (process.env.NODE_ENV === 'development') {
  storiesOf('Test', module).add('Overview', () => <TestComponent />)
}
