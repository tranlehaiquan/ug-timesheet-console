export type ListTypes = 'checkbox' | 'radio'
export interface Options { [key: string]: boolean }

export interface IFilter<T, K = Extract<T[keyof T], string>> {
  /**
   * filter name displayed in dropdown and filter button
   */
  name: string,
  /**
   * filter options array displayed in dropdown
   */
  options: K[]
  preselected: K[]

  searchOnly?: boolean
  single?: boolean

  listType?: DropdownListProps['listType']
  showSearchFor?: DropdownListProps['showSearchFor']
  searchPlaceholder?: DropdownListProps['searchPlaceholder']
  fixed?: FilterPillProps['fixed']
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export interface IActiveFilter<T> extends Omit<IFilter<T>, 'options'> {
  /**
   * Active filter name
   */
  name: string
  /**
   * Active filter options
   * {[key:string]: boolean }
   */
  options: Options
}

export interface FilterProps<T> {
  /**
   * filters data
   */
  filters: IFilter<T>[]
  onFilter: (activeFilters: IActiveFilter<T>[]) => void
  /**
   * Minimal number of options to display search bar for
   * in '+ Add filter' list
   * 0 - to always hidden
   * <0 - to always visible
   * @default 10
   */
  listShowSearchFor?: number
  classNames?: string
}

export interface DropdownListProps {
  /**
   * 'radio' | 'checkbox'
   * @default 'checkbox'
   */
  listType?: ListTypes
  /**
   * Search placeholder
   * @default 'Search filters...'
   */
  searchPlaceholder?: string
  /**
   * Empty search state text
   * @default 'No results found'
   */
  emptyState?: string
  /**
   * Dropdown list visibility indicator
   * @default true
   */
  showList?: boolean
  /**
   * Minimal number of options to display search bar for
   * 0 - to always hidden
   * <0 - to always visible
   * @default 10
   */
  showSearchFor?: number
  /**
   * Apply button visibility indicator
   */
  visibleApplyButton?: boolean
  /**
   * Filter options
   * {[key:string]: boolean } for 'radio' | 'checkbox'
   * string[] for simple list
   * string[] requires onOptionClick handler
   */
  options?: Options | string[]
  /**
   *
   */
  selectedCount?: { [key: string]: number }
  /**
   * Classes applied to dropdown list container
   */
  classNames?: string
  /**
   * Apply click handler
   * If not provided apply button will not be displayed
   */
  onApply?: (options: Options) => (ev: React.MouseEvent) => void
  /**
   * Optional handler for option click
   * Required for options provided as array
   */
  onOptionClick?: (option: string) => (ev: React.MouseEvent) => void
  /**
   * Optional onSearch handler
   *
   */
  onSearch?: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

export interface FilterPillProps {
  /**
   * Filter name
   */
  name?: string
  /**
   * Array of selected options
   */
  selected?: string[]
  /**
   * Activity indicator
   * @default false
   */
  isActive?: boolean
  /**
   * Readonly pill if sets to true
   */
  fixed?: boolean
  /**
   * Classes applied to pill container
   */
  classNames?: string
  /**
   * Remove button click handler
   * If not provided remove button ('X') will not be displayed
   */
  onRemove?: (ev: React.MouseEvent) => void
  /**
   * Pill click handler
   */
  onClick?: (ev: React.MouseEvent) => void
}

export interface ArrayOptionRendererProps {
  onSearch: DropdownListProps['onSearch'],
  onOptionClick: DropdownListProps['onOptionClick'],
  searchPlaceholder: DropdownListProps['searchPlaceholder'],
  showSearchFor: DropdownListProps['showSearchFor'],
  emptyState: DropdownListProps['emptyState'],
  selectedCount?: DropdownListProps['selectedCount']
  options: string[]
}
