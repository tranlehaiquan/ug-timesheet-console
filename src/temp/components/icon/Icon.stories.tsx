import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { select, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { Icon, IconNames } from './Icon'
import icons from './iconPaths'

const iconNames = Object.keys(icons) as IconNames[]

storiesOf('Icons', module)
  .add('Overview', () => (
    <div className="sk-p-4">
      <h3 className="sk-my-4 sk-ml-2 sk-text-blue">{ iconNames.length } icons</h3>
      <div className="sk-flex sk-flex-wrap sk-items-center">
        { iconNames.map((icon, index) => {
          return (
            <div className="sk-w-32 sk-h-32 sk-m-1 sk-p-4 sk-border-3 sk-border-grey-lighter sk-flex sk-flex-col sk-justify-center sk-items-center sk-text-grey" key={ `${name}-${index}` }>
              <Icon name={ icon } size={ 40 } />
              <span className="sk-pt-4 sk-text-sm sk-text-grey">{ icon }</span>
            </div>
          )
        }) }
      </div>
    </div>
  ))
  .add(
    'Icon',
    () => <Icon name={ select('Icon name', iconNames, iconNames[0]) } size={ number('Size', 18) } onClick={ action() } />
  )
