import * as React from 'react'
import pickBy  from 'lodash/pickBy'
import { PopperProps } from 'react-popper'

import { PopOutBase } from '../../popout/PopOutBase'
import { DropdownList, SearchOnlyFilter } from '../filter-dropdown/DropdownList'
import { FilterPill } from './FilterPill'
import { ResponsiveDropdown } from './ResponsiveDropdown'
import { FilterPillProps, DropdownListProps } from '../interfaces'

interface Props {
  filter: {
    name: string,
    options: DropdownListProps['options']
  }
  /**
   * 'radio' | 'checkbox'
   * @default 'checkbox'
   */
  listType?: DropdownListProps['listType']
  /**
   * Apply click handler
   * If not provided apply button will not be displayed
   */
  onApply?: DropdownListProps['onApply']
  /**
   * Optional handler for option click
   * Required for options provided as array
   */
  onOptionClick?: DropdownListProps['onOptionClick']
  /**
   * Search placeholder
   * @default 'Search filters...'
   */
  searchPlaceholder?: DropdownListProps['searchPlaceholder']
  /**
   * Minimal number of options to display search bar for
   * @default 10
   */
  showSearchFor?: DropdownListProps['showSearchFor']
    /**
   * Empty search state text
   * @default 'No results found'
   */
  emptyState?: DropdownListProps['emptyState']

  /**
   * Readonly pill if sets to true
   */
  fixed?: FilterPillProps['fixed']
  /**
   * Remove button click handler
   * If not provided remove button ('X') will not be displayed
   */
  onRemove?: FilterPillProps['onRemove']
  /**
   * Filter pill click handler
   */
  onPillClick?: FilterPillProps['onClick']
  /**
   * Pill classes
   */
  pillClassnames?: FilterPillProps['classNames']

  /**
   * Display pill w/o name
   * @default false
   */
  single?: boolean
  /**
   * Display dropdown as search only component
   * @default false
   */
  searchOnly?: boolean
  /**
   * Activity indicator
   * @default false
   */
  isActive?: boolean
}

export const FilterDropdownPill: React.FC<Props> = ({
  filter,
  listType = 'checkbox',
  isActive = false,
  searchOnly = false,
  fixed = false,
  single = false,
  onPillClick,
  onApply,
  onRemove,
  onOptionClick,
  showSearchFor,
  searchPlaceholder,
  pillClassnames,
  emptyState
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const { name, options } = filter

  const selectedValues = Object.keys(pickBy(options)) as FilterPillProps['selected']
  const selected = selectedValues.length === Object.keys(options).length ? ['All'] : selectedValues
  const showName = selectedValues.length && single
  return (
    <>
      { fixed
        ? <FilterPill
          name={ single ? '' : name }
          isActive={ false }
          selected={ selectedValues }
          fixed={ fixed }
          classNames={ pillClassnames }
        />
        : <ResponsiveDropdown
            // tslint:disable-next-line: jsx-no-lambda
            children={ (modifiers: NonNullable<PopperProps['modifiers']>, placement: NonNullable<PopperProps['placement']>) => (
            <PopOutBase
              visible={ isActive }
              placement={ placement }
              modifiers={ modifiers }
              trigger={
                <FilterPill
                  name={ showName ? '' : name }
                  isActive={ !fixed && isActive }
                  ref={ ref }
                  selected={ selected }
                  onRemove={ onRemove }
                  onClick={ onPillClick }
                  fixed={ fixed }
                  classNames={ pillClassnames }
                />
              }
            >
            {
              !searchOnly
              ? <DropdownList
                  listType={ listType }
                  options={ options }
                  onApply={ onApply }
                  onOptionClick={ onOptionClick }
                  showSearchFor={ showSearchFor }
                  searchPlaceholder={ searchPlaceholder }
                  emptyState={ emptyState }
              />
              : <SearchOnlyFilter
                  options={ options }
                  onApply={ onApply }
                  onOptionClick={ onOptionClick }
                  searchPlaceholder={ searchPlaceholder }
                  emptyState={ emptyState }
              />
            }
            </PopOutBase>)
          }
        />
      }
    </>
  )
}
