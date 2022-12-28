import React from 'react'
import { connect } from 'react-redux'
import { Filter, IFilter, IActiveFilter } from 'skedulo-ui'
import ReduxDataTypes from 'src/StoreV2/DataTypes'
import { RootState } from 'src/StoreV2/store'
import { initFilters, setFilters } from '../../StoreV2/slices/filterSlice'

type ReduxProps = Pick<ReduxDataTypes.State,
  'resources' | 'filters'
>

interface Props extends ReduxProps {
  initFilters: typeof initFilters
  setFilters: typeof setFilters
}

class Filters extends React.PureComponent<Props, {}> {
  // componentDidMount() {
  //   if (this.props.resources) {
  //     this.props.initFilters(this.props.resources)
  //   }
  // }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resources !== this.props.resources) {
      this.props.initFilters(this.props.resources)
    }
  }

  filterDescriptionToName(description: string) {
    return this.props.filters.find(filter => filter.description === description)!.name
  }

  onChange = (filterValues: IActiveFilter<string>[]) => {
    const value = filterValues.map(filterValue => {
      const selectedOptions = Object.keys(filterValue.options).filter(o => filterValue.options[o])
      return {
        name: this.filterDescriptionToName(filterValue.name),
        value: selectedOptions
      }
    })

    this.props.setFilters(value)
  }

  getFilterProps() {
    return {
      onFilter: this.onChange,
      filters: this.props.filters.map(filter => ({
        name: filter.description,
        options: filter.options
      })) as IFilter<string>[]
    }
  }

  render() {
    return (
      <div>
        {
          this.props.filters && this.props.filters.length > 0 && <Filter { ...this.getFilterProps() } />
        }
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  resources: state.resource.values,
  filters: state.filter.filterValues
})

const mapDispatchToProps = { initFilters, setFilters }

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
