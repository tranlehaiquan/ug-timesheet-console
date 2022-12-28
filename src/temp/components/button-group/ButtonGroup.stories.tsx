import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs/react'

import { ButtonGroup } from './ButtonGroup'
import { Button } from '../buttons/button/Button'

storiesOf('ButtonGroup', module)
  .add('Basic',
    () => (
      <ButtonGroup compact={ boolean('compact', false) }>
        <Button buttonType="secondary">task 1</Button>
        <Button buttonType="secondary">task 2</Button>
        <Button buttonType="secondary">task 3</Button>
      </ButtonGroup>
    ),
    { info: { propTablesExclude: [Button] } }
  )
