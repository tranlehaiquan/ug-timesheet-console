import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { object, select, number, boolean } from '@storybook/addon-knobs/react'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'

import { DynamicTable } from './DynamicTable'

import { Tooltip } from '../popups/tooltip/Tooltip'
import { Avatar } from '../avatar/Avatar'

import { TableConfig, TableConfigColumns } from './DynamicTable-utils'

interface DataTypes {
  description: string
  account: string
  contact: string
  jobType: string
  scheduled: string
  status: string
  resources: any[]
  id: number
}

export const data: DataTypes[] = [
  {
    description: 'Sucrose is rapidly lost during the roasting process, and may disappear entirely in darker roasts. During roasting, aromatic oils and acids weaken, changing the flavor; at 205 °C (401 °F), other oils start to develop.',
    account: 'Coffee Shop',
    contact: 'Maxwell House',
    jobType: 'Maintenance',
    scheduled: null,
    status: 'dispatched',
    resources: ['Douglas Quaid'],
    id: 1
  },
  {
    description: 'Ford has competed in rallycross with its Ford Fiesta and Ford Focus.',
    account: 'Auto Workshop',
    contact: 'Henry Ford',
    jobType: 'Maintenance',
    scheduled: 'Friday 10 Aug 9 - 11am',
    status: 'pending',
    resources: ['Snake Plissken'],
    id: 6
  },
  {
    description: 'Brewed coffee from typical grounds prepared with tap water contains 40 mg caffeine per 100 gram and no essential nutrients in significant content.',
    account: 'Coffee Shop',
    contact: null,
    jobType: 'Break Fix',
    scheduled: 'Friday 10 Aug 9 - 11am',
    status: 'pending',
    resources: ['Douglas Quaid'],
    id: 3
  },
  {
    description: 'The cavallino rampante is the visual symbol of Ferrari.',
    account: 'Auto Workshop',
    contact: 'Enzo Ferrari',
    jobType: 'Installation',
    scheduled: 'Friday 10 Aug 9 - 11am',
    status: 'dispatched',
    resources: ['Sarah Connor'],
    id: 4
  },
  {
    description: 'For a time, Ferrari built 2+2 versions of its mid-engined V8 cars. Although they looked quite different from their 2-seat counterparts, both the GT4 and Mondial were closely related to the 308 GTB.',
    account: 'Auto Workshop',
    contact: 'Enzo Ferrari',
    jobType: 'Maintenance',
    scheduled: 'Friday 10 Aug 9 - 11am',
    status: 'queued',
    resources: [],
    id: 7
  },
  {
    description: 'An F430 Spider that runs on ethanol was displayed at the 2008 Detroit Auto Show.',
    account: 'Auto Workshop',
    contact: null,
    jobType: 'Break Fix',
    scheduled: 'Friday 10 Aug 9 - 11am',
    status: 'dispatched',
    resources: ['Sarah Connor'],
    id: 8
  },
  {
    description: 'The first cafeteria in Vienna was founded in 1683 by a Ukrainian cossack and Polish diplomat of Ruthenian descent, Jerzy Franciszek Kulczycki, who was also the first to serve coffee with milk.',
    account: 'Coffee Shop',
    contact: 'Maxwell House',
    jobType: 'Installation',
    scheduled: null,
    status: 'dispatched',
    resources: ['Snake Plissken'],
    id: 5
  },
  {
    description: 'The espresso bar is a type of coffeehouse that specializes in coffee drinks made from espresso. Originating in Italy, the espresso bar has spread throughout the world in various forms.',
    account: 'Coffee Shop',
    contact: 'Johann Jacobs',
    jobType: 'Break Fix',
    scheduled: 'Friday 10 Aug 9 - 11am',
    status: 'pending',
    resources: ['Douglas Quaid'],
    id: 2
  }
]

storiesOf('Dynamic table', module)
  .addParameters({ options: { panelPosition: 'right' } })
  .add('Column options', () => {
    const defaultValue = {
      name: '',
      width: 0,
      headerCellClasses: '',
      cellClasses: '',
      emptyPlaceholderText: ''
    }
    const groupId = 'Config'

    const keys = Object.keys(data[0])
    const selectOpts = keys.reduce((acc, opt) => ({ ...acc,  [opt]: opt }), {})

    const columnNumber = number('columnNumber', 1, {
      range: true,
      min: 1,
      max: 5,
      step: 1
    }, groupId)

    const optionsConfig: TableConfig<DataTypes> = {
      options: {
        fixedFirstColumn: false
      },
      columns: [
        ...Array.from(Array(columnNumber)).map((_,num) => ({
          key: select(`${num + 1}. key:`, { ...selectOpts }, keys[0], `column-${num + 1}`) as keyof DataTypes,
          ...object(`${num + 1}. options?:`, defaultValue, `column-${num + 1}`),
          sortable: false
        }))
      ]
    }
    return (
      <DynamicTable data={ data } config={ optionsConfig } />
    )
  })
  .add('With cell renderer', () => {
    const rendererConfig: TableConfig<DataTypes> = {
      options: {
        fixedFirstColumn: false
      },
      columns:[
        {
          key: 'status',
          sortable: true,
          name: 'Simple text renderer',
          cellRenderer: data => `It's ${data}!!!`
        } as TableConfigColumns<DataTypes, 'status'>,
        {
          key: 'resources',
          name: 'Component Renderer',
          cellRenderer: data => data.map((r, index) => (
            <Avatar key={ index } name={ r } />
          ))
        } as TableConfigColumns<DataTypes, 'resources'>,
        {
          key: 'description',
          name: 'with tooltip',
          cellRenderer: (data, row, index, rowIndex) => (
            <Tooltip content={ data } position="left">
              <div>{ rowIndex } - { index }</div>
            </Tooltip>
          )
        },
        {
          key: 'jobType',
          name: 'renderer args',
          cellRenderer: (data, row, index, rowIndex) => (
            <div>
              <div>Data: { data }; CellIndex: { index }; RowIndex: { rowIndex };</div>
              <div>
                { Object.keys(row).slice(0,3).map((e, keyIndex) => (
                    <div key={ keyIndex }> <b>{ e } : </b> { row[e] } </div>
                  )) }
              </div>
            </div>
          )
        }
      ]
    }

    return (
      <DynamicTable data={ data } config={ rendererConfig } />
    )
  })
  .add('With default sorting', () => {
    const condensedRows = boolean('condensedRows', true)
    const rendererConfig: any = onSort => ({
      condensed: condensedRows,
      options: {
        sortable: {
          onSort,
          sortKey: 'id',
          initialSortDirection: 'asc'
        }
      },
      columns:[
        {
          key: 'description',
          sortable: false,
          name: 'sort disabled'
        } as TableConfigColumns<DataTypes, 'description'>,
        {
          key: 'contact',
          sortable: true,
          sortType: 'numerical',
          name: 'default sort',
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'contact'>,
        {
          key: 'id',
          sortable: true,
          resizable: true,
          sortType: 'numerical',
          name: 'numerical sort',
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'id'>,
        {
          key: 'jobType',
          sortable: true,
          name: 'custom sort (reverse data)',
          sortingFunction: (data, key, order) => {
            return data.reverse()
          },
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'jobType'>
      ]
    })

    return(
      <SortingWrapper
        data={ data }
        config={ rendererConfig }
        render={
          // tslint:disable-next-line: jsx-no-lambda
          (sortedData, configWithHandler) => <DynamicTable data={ sortedData } config={ configWithHandler } />
        }
      />
    )

  })
  .add('With select', () => {
    const keys = Object.keys(data[0])
    const validKeys = keys.filter(key => {
      const allKeys = data.map(row => row[key])
      return allKeys.length === new Set(allKeys).size
    })
    const selectOpts = validKeys.reduce((acc, opt) => ({ ...acc,  [opt]: opt }), {})

    const rendererConfig: TableConfig<DataTypes> = {
      options: {
        selectable: {
          selectBy: select('selectBy:', selectOpts, 'id'),
          selectAll: boolean('selectAll:', true),
          onSelect: (key, selection) => {}
        }
      },
      columns:[
        {
          key: 'id'
        },
        {
          key: 'description'
        },
        {
          key: 'jobType'
        },
        {
          key: 'contact'
        }
      ]
    }

    return (
      <DynamicTable data={ data } config={ rendererConfig } />
    )
  })
  .add('Resizable columns', () => {
    const config: TableConfig<DataTypes> = {
      columns: [
        {
          key: 'account',
          resizable: boolean('Column 1: resizable', true)
        },
        {
          key: 'description',
          resizable: boolean('Column 2: resizable', true)
        },
        {
          key: 'jobType',
          resizable: boolean('Column 3: resizable', true)
        }
      ]
    }

    return (
      <DynamicTable data={ data } config={ config } />
    )
  })
  .add('With fixed column', () => {

    const condensedRows = boolean('condensedRows', false)
    const rendererConfig: any = (onSort: void) => ({
      condensed: condensedRows,
      options: {
        sortable: {
          onSort,
          sortKey: 'id',
          initialSortDirection: 'asc'
        },
        fixedFirstColumn: true
      },
      columns:[
        {
          key: 'description',
          width: 260,
          sortable: true,
          resizable: boolean('fixedColumnResizable', false),
          name: 'description (fixed)'
        } as TableConfigColumns<DataTypes, 'description'>,
        {
          key: 'account',
          sortable: true,
          name: 'account',
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'account'>,
        {
          key: 'contact',
          sortable: true,
          name: 'contact',
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'contact'>,
        {
          key: 'jobType',
          sortable: true,
          name: 'job type',
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'jobType'>,
        {
          key: 'scheduled',
          sortable: true,
          name: 'scheduled',
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'scheduled'>,
        {
          key: 'status',
          sortable: true,
          name: 'status',
          cellRenderer: data => data
        } as TableConfigColumns<DataTypes, 'status'>
      ]
    })

    return(
      <SortingWrapper
        data={ data }
        config={ rendererConfig }
        render={
          // tslint:disable-next-line: jsx-no-lambda
          (sortedData, configWithHandler) => <DynamicTable data={ sortedData } config={ configWithHandler } />
        }
      />
    )
  })
  .add('With grouping', () => {
    const config: TableConfig<DataTypes> = {
      options: {
        selectable: {
          selectBy: 'id',
          selectAll: boolean('selectAll:', true),
          onSelect: (key, selection) => { }
        }
      },
      columns: [
        { key: 'resources' },
        { key: 'jobType' },
        { key: 'account' },
        { key: 'contact' }
      ]
    }
    const groupKey = select('groupBy', ['jobType', 'account', 'contact', 'resources'], 'jobType')
    let groupedData = []
    map(groupBy(data, groupKey), (value, key) => {
      if (key !== 'null') {
        groupedData.push({
          name: key,
          data: value
        })
      } else {
        groupedData.push({
          name: `no ${groupKey} data`,
          data: value
        })
      }
    })
    groupedData = groupedData.sort((a, b) => {
      if (a.name === b.name) return 0
      if (b.name === `no ${groupKey} data`) return -1
    })

    return (
      <DynamicTable
        data={ data }
        config={ config }
        groupedData={ groupedData }
      />
    )
  })

class SortingWrapper extends React.PureComponent<{
  data: any[]
  render: (data: any[], config: TableConfig<any>) => React.ReactElement
  config: (sortFunction: (data: any[]) => void) => TableConfig<any>
}, {data: any[]}> {
  constructor(props){
    super(props)

    this.state = {
      data: this.props.data
    }
  }

  onSort = (data: any[]) => {
    this.setState(() => ({
      data
    }))
  }

  render(){
    return this.props.render(this.state.data, this.props.config(this.onSort))
  }
}
