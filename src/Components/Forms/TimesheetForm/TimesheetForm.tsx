import * as React from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { format } from "date-fns";
import { Button } from "skedulo-ui";
import { ReduxDataTypes, TimesheetStatus } from "../../../Store/DataTypes";

import { getTimesheets } from "../../../Store/reducersTimesheets";
import { createTimesheet } from "../../../Mutations/input";
import { Label } from "../Utils/Label";
import { DatePicker } from "../Controls/DatePicker";
import { Select } from "../Controls/Select";
import { ValidationError } from "../ValidationError";
import { dataService } from "../../../Services/DataServices";

const validationQuery = `
query getTimesheets($filters: EQLQueryFilterTimesheet!){
  timesheet(filter: $filters) {
    edges {
      node {
        StartDate
        EndDate
        ResourceId
      }
    }
  }
}
`;

interface ValidationQueryResponse {
  timesheet: {
    StartDate: string;
    EndDate: string;
    ResourceId: string;
  }[];
}

type ReduxProps = Pick<ReduxDataTypes.State, "resources" | "timesheet">;

interface Props extends ReduxProps {
  getTimesheets: typeof getTimesheets;
  createTimesheet: typeof createTimesheet;
  onCancel?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface TimesheetFormState {
  ResourceId: string;
  StartDate: Date;
  EndDate: Date;
  Status: TimesheetStatus;
  validationError?: string;
}

export class TimesheetForm extends React.PureComponent<
  Props,
  TimesheetFormState
> {
  constructor(props: Props) {
    super(props);

    // props.getTimesheets()

    this.state = {
      ResourceId: null,
      StartDate: new Date(),
      EndDate: addDays(new Date(), 6),
      Status: "Draft",
    };
  }

  componentDidUpdate(
    prevProps: Props,
    { StartDate: prevStart, ResourceId: prevId }: Partial<TimesheetFormState>
  ) {
    const { StartDate, ResourceId, validationError } = this.state;
    if (
      !!validationError &&
      (StartDate !== prevStart || prevId !== ResourceId)
    ) {
      this.setState({
        validationError: undefined,
      });
    }
  }

  simpleChange =
    (fieldName: "ResourceId", valuePath: string) => (dataObject: object) => {
      this.setState({
        [fieldName]: get(dataObject, valuePath, undefined),
      });
    };

  getTimesheetNew = () => ({
    ResourceId: this.state.ResourceId,
    Status: this.state.Status,
    StartDate: format(this.state.StartDate, "yyyy-MM-dd"),
    EndDate: format(this.state.EndDate, "yyyy-MM-dd"),
  });

  createTimesheet = async () => {
    try {
      const timesheet = this.getTimesheetNew();
      const valid = await this.validate(timesheet);
      if (valid) {
        this.props.createTimesheet(timesheet);
        if (this.props.onSuccess) {
          this.props.onSuccess();
        }
      } else {
        this.setState({
          validationError: `A Timesheet has already been created within this date range for ${
            this.props.resources.find(
              (resource) => resource.UID === this.state.ResourceId
            ).Name
          }`,
        });
      }
    } catch (error) {
      // TODO: FIX - error occurs even after successfull operation
      // `Actions must be plain objects. Use custom middleware for async actions.`
      // tslint:disable-next-line: no-console
      console.error("ERROR: TimesheetForm.createTimesheet", error);
      if (this.props.onError) {
        this.props.onError(error);
      }
    }
  };

  validate = async ({
    StartDate,
    EndDate,
    ResourceId,
  }: {
    StartDate: string;
    EndDate: string;
    ResourceId: string;
  }) => {
    const resp = await dataService.fetchGraphQl<ValidationQueryResponse>({
      query: validationQuery,
      variables: {
        filters: `StartDate == ${StartDate} AND EndDate == ${EndDate} AND ResourceId == '${ResourceId}'`,
      },
    });
    const isNotDuplicate = resp.timesheet.length === 0;
    return isNotDuplicate;
  };

  dateChange: (key: "StartDate" | "EndDate") => (date: Date) => void =
    (key) => (date) => {
      const newState = { ...this.state };

      if (key === "StartDate") {
        newState.StartDate = date;
        newState.EndDate = addDays(date, 6);
      }

      if (key === "EndDate") {
        newState.EndDate = date;
      }

      this.setState(newState);
    };

  render() {
    const resource = this.props.resources.find(
      ({ UID }) => UID === this.state.ResourceId
    );
    const { validationError } = this.state;

    return (
      <div style={{ width: 380 }}>
        {validationError && (
          <ValidationError>{validationError}</ValidationError>
        )}
        <div className="sk-mb-8">
          <Label text="Resource" />
          <Select
            optionLabel="Name"
            searchFields={["Name"]}
            label={(resource && resource.Name) || "Select resource"}
            data={this.props.resources}
            onOptionClick={this.simpleChange("ResourceId", "UID")}
          />
        </div>

        <div className="sk-flex sk-mb-16">
          <div className="sk-w-1/2 sk-mr-3">
            <Label text="Start Date" />
            <DatePicker
              selected={this.state.StartDate}
              onChange={this.dateChange("StartDate")}
              disabled={!this.state.ResourceId}
            />
          </div>
          <div className="sk-w-1/2 sk-ml-3">
            <Label text="End Date" />
            <DatePicker
              selected={this.state.EndDate}
              onChange={this.dateChange("EndDate")}
              disabled={!this.state.ResourceId}
              minDate={addDays(this.state.StartDate, 0)}
            />
          </div>
        </div>

        <div className="sk-text-right">
          <Button
            buttonType="transparent"
            onClick={this.props.onCancel}
            className="sk-mr-3"
          >
            Cancel
          </Button>
          <Button
            disabled={!this.state.ResourceId} // TODO: do we want to display error message instead of that?
            buttonType="primary"
            onClick={this.createTimesheet}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxDataTypes.State) => ({
  resources: state.resources,
  timesheet: state.timesheet,
});

const mapDispatchToProps = {
  getTimesheets,
  createTimesheet,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetForm);

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
