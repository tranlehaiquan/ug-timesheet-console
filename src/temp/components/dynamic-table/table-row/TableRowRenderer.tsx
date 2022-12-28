import * as React from 'react'
import classnames from 'classnames'

import { Icon } from '../../icon/Icon'
import { TableRow, TableCell } from '../../table/Table'
import { TableConfig } from '../DynamicTable-utils'
import { FormInputElement } from '../../forms/FormElements'
import { Condenser } from '../condenser/Condenser'
import get from 'lodash/get'
interface Props<T> extends React.HTMLAttributes<HTMLTableRowElement> {
  rowData: T
  config: TableConfig<T>
  rowIndex: number
  className?: string
  selectable?: boolean
  onSelect?: (key: any) => (event: React.ChangeEvent<HTMLInputElement>) => void
  selectChecked?: boolean
  selectPlaceholder?: boolean
  expandPlaceholder?: boolean
  fixedColumn?: boolean
  isExpanded?: boolean
  onExpand?: (key: any) => void
}
// tslint:disable-next-line: function-name
function TableRowRendererComponent<T>(
  { rowData, config: { columns, options, condensed },
    className,
    rowIndex,
    onSelect,
    selectChecked,
    selectPlaceholder,
    expandPlaceholder,
    fixedColumn,
    isExpanded,
    onExpand,
    ...otherProps
  }: Props<T>) {

  // const [isExpanded, setIsExpanded] = React.useState(false)
  /*
  const expandedUID = useSelector(({ expandedUID }: { expandedUID: string }) => expandedUID)
  const dispatch = useDispatch()
  const setExpandedUID = UID => dispatch({
    UID,
    type: 'SET_EXPANDED_UID'
  })
  const { UID } = (rowData as any)
  const isExpanded = expandedUID === UID
  */
  const { UID } = (rowData as any)

  const selectRenderer = () => {
    const { selectable: { selectBy } } = options
    return (
      <TableCell className={ classnames({ 'sked-fixed-cell-row': fixedColumn }) }>
        <FormInputElement type="checkbox" id={ `select-row-${rowIndex}` } onChange={ onSelect(rowData[selectBy]) } checked={ selectChecked } />
      </TableCell>
    )
  }

  const selectPlaceholderRenderer = () => (
    <TableCell className={ classnames({ 'sked-fixed-cell-row': fixedColumn }) } />
  )

  const toggleExpanded = () => isExpanded ? onExpand(null) : onExpand(UID)

  const expandRenderer = () => {
    return (
      <TableCell className="sk-text-right sk-pl-0 sk-pr-6">
        <Icon
          className="sk-cursor-pointer"
          name={ isExpanded ? 'chevronUp' : 'chevronDown' }
          size={ 10 }
          onClick={ toggleExpanded }
        />
      </TableCell>
    )
  }

  const expandPlaceholderRenderer = () => {
    return (
      <TableCell className="sk-text-right sk-pl-0 sk-pr-6" />
    )
  }

  return (
    <>
      <TableRow
        className={ classnames('sked-table-row', { 'sked-table-row--selected': selectChecked }, className) }
        data-sk-name="sked-table-row-renderer"
        { ...otherProps }
      >
        { (options && options.selectable) && selectRenderer() }
        { (options && !options.selectable && selectPlaceholder) && selectPlaceholderRenderer() }
        { columns.map(({ key, cellRenderer, cellClasses, emptyPlaceholderText, width }, index) => (
          <TableCell
            key={ `${rowIndex}-${index}` }
            className={ classnames(
                cellClasses || '',
              {
                'sk-truncate': condensed,
                'sk-font-semibold': condensed && index === 0,
                'sked-fixed-cell-row': fixedColumn && index === 0,
                'sked-fixed-cell-row-selectable': fixedColumn && index === 0 && options && options.selectable
              }) }
            style={
              {
                width: `${width}px` || '120px',
                minWidth: `${width}px` || '120px',
                maxWidth:`${width}px` || '120px'
              }
            }
          >
            { get(rowData, key) !== null && get(rowData, key) !== undefined && cellRenderer
              ? cellRenderer(get(rowData, key), rowData, index, rowIndex)
              : defaultRenderer(get(rowData, key), String(key), emptyPlaceholderText, condensed) }
            { fixedColumn && index === 0 && (<div className="sked-table-fixed-column-shadow-br" />) }
          </TableCell>
        )) }
        { options && options.expandable && expandRenderer() }
        { (options && !options.expandable && expandPlaceholder) && expandPlaceholderRenderer() }
      </TableRow>
      { options && options.expandable && (
        <ExpandableRow
          isExpanded={ isExpanded }
          selectable={ !!options.selectable }
          columnsNumber={ columns.length }
          onExpand={ options.expandable.onExpand }
          rowData={ rowData as Object }
        />
      ) }
    </>
  )
}

const ExpandableRow: React.FC<{
  isExpanded: boolean,
  selectable: boolean,
  columnsNumber: number,
  onExpand: (rowData: any) => React.ReactElement,
  rowData: object
}> = ({
  isExpanded,
  selectable = false,
  columnsNumber,
  onExpand,
  rowData
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [transitionsEnabled, setTransitionsEnabled] = React.useState(false)

  React.useLayoutEffect(() => {
    ref.current!.style.height = isExpanded ? null : `${ 0 }px`
    setTransitionsEnabled(true)
  }, [])

  React.useLayoutEffect(() => {
    if (!transitionsEnabled) {
      return
    }
    const current = ref.current
    const maxHeight = current!.scrollHeight

    const expandedCleanup = () => {
      current!.style.height = null
    }

    if (isExpanded) {
      current!.style.height = `${ maxHeight }px`
      current!.addEventListener('transitionend', expandedCleanup)
    } else {
      const transition = current!.style.transition
      current!.style.transition = ''

      requestAnimationFrame(() => {
        current!.style.height = `${ maxHeight }px`
        current!.style.transition = transition

        requestAnimationFrame(() => {
          current!.style.height = `${ 0 }px`
        })
      })
    }

    return () => {
      if (isExpanded) {
        current!.removeEventListener('transitionend', expandedCleanup)
      }
    }

  }, [isExpanded])

  return (
    <TableRow style={ { borderBottomWidth: isExpanded ? 1 : 0 } }>
      { selectable ? <td className="sk-p-0" /> : <></> }
      <td colSpan={ columnsNumber } className="sk-p-0">
        <div
          ref={ ref }
          style={ {
            transition: 'all 0.2s ease-in',
            overflow : 'hidden'
          } }
        >
          <div className="sk-px-5 sk-pb-6">
            { onExpand && onExpand(rowData) }
          </div>
        </div>
      </td>
      <td className="sk-p-0" />
    </TableRow>
  )
}

export const TableRowRenderer: React.NamedExoticComponent<Props<any>> = React.memo(TableRowRendererComponent, differentNameProps)

function defaultRenderer<T extends React.ReactNode>(data: T, key: string, emptyText: string, condensed: boolean = false): React.ReactNode {
  const content: string | React.ReactNode = data || emptyText || <div className="sk-text-grey">{ `No ${key} data` }</div>
  return condensed ? <Condenser>{ content }</Condenser> : content
}

function differentNameProps<T>(prevProps: Props<T>, nextProps: Props<T>): boolean {
  const prevCols = prevProps.config.columns
  const nextCols = nextProps.config.columns

  for (const [i, col] of prevCols.entries()) {
    if (col.name !== nextCols[i].name) {
      return true
    }
  }
  return false
}
