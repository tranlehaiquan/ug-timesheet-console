import React from "react";
import { connect } from "react-redux";
import { Filter, IFilter, IActiveFilter } from "skedulo-ui";
import ReduxDataTypes from "src/StoreV2/DataTypes";
import { RootState } from "src/StoreV2/store";
import { initFilters, setFilters } from "../../StoreV2/slices/filterSlice";
import SaveFilterPopOut from "./SaveFilterPopOut";
import SavedViews from "./SavedViews";

type ReduxProps = Pick<
  ReduxDataTypes.State,
  "resources" | "filters" | "selectedSavedFilter"
>;

interface Props extends ReduxProps {
  initFilters: typeof initFilters;
  setFilters: typeof setFilters;
}

class Filters extends React.PureComponent<Props, {}> {
  // componentDidMount() {
  //   if (this.props.resources) {
  //     this.props.initFilters(this.props.resources)
  //   }
  // }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resources !== this.props.resources) {
      this.props.initFilters(this.props.resources);
    }
  }

  filterDescriptionToName(description: string) {
    return this.props.filters.find(
      (filter) => filter.description === description
    )!.name;
  }

  onChange = (filterValues: IActiveFilter<string>[]) => {
    const value = filterValues.map((filterValue) => {
      const selectedOptions = Object.keys(filterValue.options).filter(
        (o) => filterValue.options[o]
      );
      return {
        name: this.filterDescriptionToName(filterValue.name),
        value: selectedOptions,
      };
    });

    this.props.setFilters(value);
  };

  getFilterProps(selectedSavedFilter: ReduxDataTypes.SavedFilter) {
    return {
      onFilter: this.onChange,
      filters: this.props.filters.map((filter) => {
        if (selectedSavedFilter) {
          const filterSet = selectedSavedFilter.filterSet.find(
            ({ name }) => filter.name === name
          );
          return {
            name: filter.description,
            options: filter.options,
            preselected: filterSet.filterValues,
          };
        }

        return {
          name: filter.description,
          options: filter.options,
        };
      }) as IFilter<string>[],
    };
  }

  render() {
    const { selectedSavedFilter } = this.props;

    return (
      <div>
        <div className="sk-flex sk-items-center sk-ml-4">
          <SavedViews />
          <SaveFilterPopOut />
        </div>
        {this.props.filters && this.props.filters.length > 0 && (
          <Filter {...this.getFilterProps(selectedSavedFilter)} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  resources: state.resource.values,
  filters: state.filter.filterValues,
  selectedSavedFilter: state.filter.selectedSavedFilter,
});

const mapDispatchToProps = { initFilters, setFilters };

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
