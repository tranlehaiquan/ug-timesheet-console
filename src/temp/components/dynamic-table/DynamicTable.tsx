import * as React from 'react'
import { orderBy, get, uniqBy } from 'lodash'

import { TableBody, Table } from '../table/Table'
import { TableHeaderRenderer } from './table-header/TableHeaderRenderer'
import { TableConfig, GroupedData, sortDirection } from './DynamicTable-utils'
import { TableGroups } from './table-row/TableGroups'
import { TableRows } from './table-row/TableRows'
import { TableRowRenderer } from './table-row/TableRowRenderer'

interface Props<T> {
  data: T[]
  config: TableConfig<T>
  totalConfig?: TableConfig<T>
  /**
   * classes applied directly to <table>
   */
  className?: string
  groupedData?: GroupedData<T>[]
  selection: Set<string>
  expandedRows?: Set<any>
  onRowExpand?: (key: any) => void
  onSortBy?: (key: string) => void
}

interface State {
  fixedColumnEnabled: boolean
  sortedBy?: string
  sortDirection?: sortDirection
  fixedColumn?: boolean
}

export class DynamicTable<T> extends React.PureComponent<
  Props<T>,
  State
> {
  constructor(props: Props<T>) {
    super(props)

    this.state = {
      sortDirection: get(this.props, 'config.options.sortable.initialSortDirection', 'asc') as sortDirection,
      sortedBy: get(this.props, 'config.options.sortable.sortKey') as string,
      fixedColumnEnabled: this.props.config.options && this.props.config.options.fixedFirstColumn || false
    }
  }

  private tableContainerRef: React.RefObject<HTMLDivElement> = React.createRef()

  handleSort = (
    key: string,
    sortingFunction: (data: T[], key: string, order: sortDirection) => T[] = orderBy,
    sortDirection: sortDirection
  ) => () => {
    const { config: { options: { sortable: { onSort } } } } = this.props
    let newSortDirection: sortDirection = 'desc'
    if (key === this.state.sortedBy) {
      newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    }

    const sortedData = sortingFunction([...this.props.data], key, newSortDirection)

    this.setState(
      {
        sortedBy: key,
        sortDirection: newSortDirection
      },
      () => onSort(sortedData, this.state.sortedBy, this.state.sortDirection)
    )
  }

  componentDidMount() {
    !!this.props.config.options && !!this.props.config.options.selectable && this.checkSelectionKey()
    this.state.fixedColumnEnabled && this.checkColumnFixed()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkColumnFixed)
  }

  checkSelectionKey = () => {
    const {
      data,
      config: {
        options: { selectable: { selectBy } }
      }
    } = this.props

    const rowsNum = data.length
    const uniqueKeysNum = uniqBy(data, selectBy).length // new Set(data.map(e => e[selectBy])).size

    if (rowsNum !== uniqueKeysNum) {
      // It still can be displayed, it won't work properly tho
      // Selecting row with duplicated value will select all rows with that value
      throw new Error(`Non unique values for { selectBy: "${selectBy}" }`)
    }
  }

  selectEachHandler = (key: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target as HTMLInputElement
    this.selectionUpdate(key, !checked)
  }

  selectAllHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target as HTMLInputElement
    let newSelection: any[] = []
    const {
      data,
      config: {
        options: { selectable: { selectBy, onSelect } }
      }
    } = this.props
    const selectAllStatus = this.selectAllStatus()

    if (checked && !selectAllStatus) {
      newSelection = data.map(e => e[selectBy])
    }

    onSelect(selectBy, new Set(newSelection), data)
  }

  selectionUpdate = (key: string, remove: boolean = false) => {
    const {
      data,
      config: {
        options: { selectable: { selectBy, onSelect } }
      }
    } = this.props


    const newSelection = new Set(this.props.selection)
    remove ? newSelection.delete(key) : newSelection.add(key)

    onSelect(selectBy, newSelection, data)
  }

  selectStatus = (row: T) => {
    const { selection } = this.props
    if (selection.size === 0) {
      return false
    }

    const {
      config: {
        options: { selectable: { selectBy } }
      }
    } = this.props
    return selection.has(String(row[selectBy])) // this one is fixed on grouping branch
  }

  selectAllStatus = () => this.props.selection.size === this.props.data.length

  checkColumnFixed = () => {
    window.addEventListener('resize', this.checkColumnFixed)
    if (this.tableContainerRef.current) {
      this.setState({
        fixedColumn: !(this.tableContainerRef.current.getBoundingClientRect().width > this.getInitialColsWidth())
      })
    }
  }

  getInitialColsWidth = () => this.props.config.columns.reduce((acc, curr) => curr.width ? acc + curr.width : acc + 140, 0)

  render() {
    const { className, children, config, totalConfig, groupedData, expandedRows, onRowExpand, ...otherProps } = this.props
    const { columns, headerClasses, options } = config
    const { sortedBy, sortDirection } = this.state

    const dataToDisplay = this.props.data
    const selectAll = get(config, 'options.selectable.selectAll', false)

    return (
      <div
        className="sk-overflow-x-scroll"
        data-sk-name={
          `sked-dynamic-table${this.state.fixedColumnEnabled ? '-fixed-first-col' : ''}${config.options && config.options.selectable ? '-selectable' : ''}`
        }
        ref={ this.tableContainerRef }
      >
        <Table
          className={ className }
          style={ {
            minWidth: `calc(0% + ${this.getInitialColsWidth()}px)`
          } }
          { ...otherProps }
        >
          <TableHeaderRenderer
            sortBy={ sortedBy }
            sortDirection={ sortDirection }
            sortHandler={ this.handleSort }
            columns={ columns }
            className={ headerClasses || '' }
            selectable={ !!options && !!options.selectable }
            expandable={ !!options && !!options.expandable }
            selectAll={ selectAll }
            selectChecked={ selectAll && this.selectAllStatus() }
            onSelect={ this.selectAllHandler }
            fixedColumn={ this.state.fixedColumn }
          />
          <TableBody>
            { groupedData && groupedData.length ? (
              <TableGroups
                groupedData={ groupedData }
                config={ config }
                selection={ this.props.selection }
                onSelect={ this.selectEachHandler }
                fixedColumn={ this.state.fixedColumn }
              />
            ) : (
              <TableRows
                data={ dataToDisplay }
                config={ config }
                selection={ this.props.selection }
                onSelect={ this.selectEachHandler }
                fixedColumn={ this.state.fixedColumn }
                onExpand={ onRowExpand }
                expandedRows={ expandedRows }
              />
            ) }
            {
              totalConfig && dataToDisplay && (dataToDisplay.length > 0) &&
              <TableRowRenderer
                key={ 'total'}
                rowData={ (totalConfig as any).getTotalData(dataToDisplay) }
                config={ totalConfig }
                rowIndex={ 0 }
                className={ config.rowClasses || '' }
                selectChecked
                selectPlaceholder
                expandPlaceholder
                onSelect={ this.selectEachHandler }
                fixedColumn={ this.state.fixedColumn }
              />
            }
          </ TableBody>
        </Table>
      </div>
    )
  }
}
