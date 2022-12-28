import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text, boolean, select } from '@storybook/addon-knobs/react'

import { Button } from './button/Button'
import { ButtonDropdown } from './button-dropdown/ButtonDropdown'
import { Menu, MenuItem } from '../menu/Menu'

storiesOf('Button', module)
  .add('Button',
    () => {
      return (
      <Button
        buttonType={ select('Button type', ['primary', 'secondary', 'transparent'], 'primary') }
        compact={ boolean('Compact', false) }
        disabled={ boolean('Disabled', false) }
        loading={ boolean('Loading', false) }
        onClick={ action('clicked') }
      >
        { text('Button Text', 'Basic button') }
      </Button>)
    })
  .add('ButtonDropdown',
    () => (
      <ButtonDropdown
        label={ text('Label', 'Button dropdown') }
        compact={ boolean('Compact', false) }
        disabled={ boolean('Disabled', false) }
        onClick={ action('clicked') }
        buttonType={ select('Button type', ['primary', 'secondary', 'transparent'], 'secondary') }
      >
        <Menu>
          <MenuItem onClick={ action('clicked') }>Button dropdown children 1</MenuItem>
          <MenuItem>Button dropdown children 2</MenuItem>
          <MenuItem>This is a long list item that extends past the maxWidth of the dropdown</MenuItem>
        </Menu>
      </ButtonDropdown>
    )
  )
