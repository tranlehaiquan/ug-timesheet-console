import * as React from 'react'
import classnames from 'classnames'
import { ColumnResizer } from '../dynamic-table/table-header/ColumnResizer'
import { Condenser } from '../dynamic-table/condenser/Condenser'

export interface IHeaderCell {
  name: string
  width?: number
  minWidth?: number
  maxWidth?: number
  className?: string
  content?: (content: string | React.ReactNode) => React.ReactNode
  resizable?: boolean
}

export const Table: React.SFC<React.HTMLAttributes<HTMLTableElement>> = props => {
  const { className, children, ...otherProps } = props

  return (
    <table className={ classnames('sk-w-full sk-border-collapse sk-table-fixed', className) } { ...otherProps }>
      { children }
    </table>
  )
}

export interface ITableHeadProps {
  cells: IHeaderCell[],
  className?: string,
}

export const TableHead: React.SFC<ITableHeadProps> = props => {
  return (
    <thead className={ classnames('sk-bt-2 sk-bb-2 sk-border-t sk-border-b sk-border-grey-light sk-bg-grey-lightest sk-text-navy-lighter sk-text-xxs sk-uppercase', props.className) }>
      <tr className="sk-h-10 sk-text-left">
        { props.cells.map((cell, index) => {
          return <TableHeaderCell key={ index } cell={ cell } index={ index } />
        }) }
      </tr>
    </thead>
  )
}

export interface ITableHeaderCellProps {
  cell: IHeaderCell,
  index: number
}

export const TableHeaderCell: React.SFC<ITableHeaderCellProps> = ({ cell, index }) => {
  const ref = React.useRef(null)
  const [widthToUse, setWidth] = React.useState<string | number>(cell.width || '')
  const min = cell.minWidth ? cell.minWidth : 120

  const rend = (
    <Condenser>{ cell.name }</Condenser>
  )

  return (
    <th
      ref={ ref }
      data-sk-name={ `th-${cell.name.toLowerCase().split(' ').join('-')}` }
      key={ `${cell.name}-${index}` }
      className={ classnames('sk-px-5 sk-font-medium', cell.className) }
      style={ { width: widthToUse || `${cell.width}px`, minWidth: `${min}px`, position: 'sticky' } }
    >
      { cell.content ? cell.content(rend) : rend }
      { cell.resizable && <ColumnResizer onResize={ setWidth } min={ min } /> }
    </th>
  )
}

export const TableBody: React.SFC = props => {
  return (
    <tbody>{ props.children }</tbody>
  )
}

export const TableRow: React.SFC<React.HtmlHTMLAttributes<HTMLTableRowElement>> = props => {
  const { className, children, ...otherProps } = props

  return (
    <tr className={ classnames('sk-border-b sk-border-grey-lighter', className) } { ...otherProps }>
      { children }
    </tr>
  )
}

export const TableCell: React.SFC<React.HTMLAttributes<HTMLTableCellElement>> = props => {
  const { className, children, ...otherProps } = props

  return (
    <td className={ classnames('sk-py-3 sk-px-5 sk-text-xs', className) } { ...otherProps }>
      { children }
    </td>
  )
}
