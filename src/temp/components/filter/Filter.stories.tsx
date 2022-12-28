import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text, select, number, boolean, array } from '@storybook/addon-knobs/react'

import { Filter } from './Filter'
import { FilterPill } from './filter-pill/FilterPill'
import { FilterDropdownPill } from './filter-pill/FilterDropdownPill'
import { DropdownList } from './filter-dropdown/DropdownList'
import { ListTypes } from './interfaces'

storiesOf('Filter', module)
  .add('Filter', () => {

    const filtersData: any = [
      {
        name: text('Name', 'Filter 1', 'Filter 1'),
        options: array('Options',[
          'Ben Jones',
          'Carry Jones',
          'Mary Jones',
          'Alan Jones',
          'John Smith',
          'Nellie Jones',
          'Jonathan Hodge',
          'Jonny Morris',
          'Pauline Jones'
        ], ',' ,'Filter 1'),
        listType: select('List type', { checkbox: 'checkbox', radio: 'radio' }, 'checkbox', 'Filter 1') as ListTypes,
        showSearchFor: number('Search for', 5, {}  ,'Filter 1'),
        searchPlaceholder: text('Search placeholder', undefined, 'Filter 1'),
        searchOnly: boolean('Search only', false, 'Filter 1'),
        fixed:  boolean('fixed', false, 'Filter 1')
      }
    ]

    const onFilter = () => {}

    return (
        <Filter
          filters={ filtersData }
          onFilter={ onFilter }
        />
    )
  })
  .add('Filter example', () => {

    const filtersData: any = [
      {
        name: 'Account',
        options:[
          'Ben Jones',
          'Carry Jones',
          'Mary Jones',
          'Alan Jones',
          'John Smith',
          'Nellie Jones',
          'Jonathan Hodge',
          'Jonny Morris',
          'Pauline Jones'
        ],
        listType: 'checkbox',
        showSearchFor: 5,
        searchPlaceholder: 'Search account...',
        searchOnly: false,
        fixed: false
      },
      {
        name: 'Search',
        options:[
          'Ben Jones',
          'Carry Jones',
          'Mary Jones',
          'Alan Jones',
          'John Smith',
          'Nellie Jones',
          'Jonathan Hodge',
          'Jonny Morris',
          'Pauline Jones'
        ],
        searchPlaceholder: 'Search account...',
        searchOnly: true
      },
      {
        name: 'Radio',
        options:[
          'Ben Jones',
          'Carry Jones',
          'Mary Jones',
          'Alan Jones',
          'John Smith',
          'Nellie Jones',
          'Jonathan Hodge',
          'Jonny Morris',
          'Pauline Jones'
        ],
        listType: 'radio',
        single: true
      },
      {
        name: 'Default',
        options:[
          'Ben Jones',
          'Carry Jones',
          'Mary Jones',
          'Alan Jones',
          'John Smith',
          'Nellie Jones',
          'Jonathan Hodge',
          'Jonny Morris',
          'Pauline Jones'
        ]
      },
      {
        name: 'Date',
        options:[
          'Today'
        ],
        fixed: true
      },
      {
        name: 'Fixed and single',
        options:[
          'Available'
        ],
        fixed: true,
        single: true
      }
    ]

    const onFilter = () => {}

    const alignmentMap = {
      start: 'sk-justify-start',
      center: 'sk-justify-center',
      end: 'sk-justify-end'
    }

    return (
        <Filter
          filters={ filtersData }
          onFilter={ onFilter }
          classNames={ alignmentMap[select('Alignment', {
            left: 'start',
            center: 'center',
            right: 'end'
          }, 'left')] }
          listShowSearchFor={ number('Add filter list showSearchFor', 2) }
        />
    )
  })
  .add('Filter Pill', () => {
    // storybook breaks with component with hooks in React.forwardRef
    const Wrapper = () => (
      <FilterPill
        name={ text('Name', 'FilterName') }
        selected={ array('selection', ['Option 1', 'Option 2']) }
        isActive={ boolean('active', false) }
        onRemove={ boolean('onRemove', false) ? action('remove') : null }
        onClick={ action('click') }
        fixed={ boolean('fixed', false) }
      />
    )
    return <Wrapper />
  })
  .add('Dropdown list', () => {

    const optionPrefix = text('Option prefix', 'Option ')
    const onlyList = boolean('Only list', true)

    const options = [...Array(number('Number of options', 5))]
    const list = onlyList
      ? options.reduce((opts, _, index) => [...opts, `${optionPrefix} ${index + 1}`], [])
      : options.reduce((opts, _, index) => ({ ...opts, [`${optionPrefix} ${index + 1}`]: false }) , {})

    const props = {...{
      options: list
    }}

    return (
      <DropdownList
        showSearchFor={ number('Search for', 5) }
        listType={ select('List type', { checkbox: 'checkbox', radio: 'radio' }, 'checkbox') as ListTypes }
        onApply={ boolean('onApply', true) ? opts => action('apply') : null }
        onOptionClick={ boolean('onOptionClick', true) ? label => () => {} : null }
        showList={ boolean('Show list', true) }
        selectedCount={ { [list[2]]: number('count badge num', 5) } }
        { ...props }
      />
    )
  })
  .add('Filter Pill with dropdown', () => {
    return (
      <FilterDropdownPill
        isActive={ boolean('isActive',false) }
        filter={ {
          name: 'Contact',
          options: {
            'Ben Jones': false,
            'Carry Jones': false,
            'Mary Jones': false,
            'Alan Jones': false,
            'John Smith': false,
            'Nellie Jones': false,
            'Jonathan Hodge': false,
            'Jonny Morris': false,
            'Pauline Jones': false
          }
        } }
        searchOnly={ boolean('Search only', false) }
        onRemove={ boolean('onRemove', true) ? action('remove') : null }
        onPillClick={ action('Pill click') }
        onApply={ boolean('onApply', true) ? options => () => {} : null }
        listType={ select('List type', { checkbox: 'checkbox', radio: 'radio' }, 'checkbox') as ListTypes }
        showSearchFor={ number('Search for', 5) }
        fixed={ boolean('fixed', false) }
        emptyState={ text('empty state', '') }
      />
    )
  })
