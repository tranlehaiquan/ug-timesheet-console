import * as React from "react";
import { connect } from "react-redux";
import { get, toNumber } from "lodash";
import { format } from "date-fns";
import moment from "moment-timezone";
import { Button, FormInputElement, LoadingSpinner } from "skedulo-ui";
import { LUNCH_BREAK_OPTIONS } from "../../../common/constants/lunchBreak";

import { MultiSelect } from "../Controls/MultiSelect/MultiSelect";
import { dataService, VocabularyItem } from "../../../Services/DataServices";

import {
  kilometersToMeters,
  metersToKilometers,
  metersToMiles,
  milesToMeters,
} from "../../../common/utils/distanceUnits";
import {
  getNewEntryData,
  clearNewEntrState,
} from "../../../Store/reducersFetch";
import { getEntryById } from "../../../Store/reducersEntries";
import { getTimesheets } from "../../../Store/reducersTimesheets";
import {
  ReduxDataTypes,
  EntryTypes,
  DistanceUnit,
  UID,
} from "../../../Store/DataTypes";
import {
  createTimesheetEntry,
  updateTimesheetEntry,
} from "../../../Mutations/input";

import { ValidationError, ValidationWarning } from "../ValidationError";
import { Label } from "../Utils/Label";
import { TypedSelect } from "../Controls/TypedSelect";
import { TimePicker } from "../Controls/TimePicker";
import { DatePicker } from "../Controls/DatePicker";
import { Select } from "../Controls/Select";
import BreaksSelect from "./BreaksSelect";

import {
  minutesToDuration,
  calculateDurationInMinutes,
} from "../../../common/utils/dateTimeHelpers";
import "./TimesheetEntryForm.scss";
import {
  parseLocalDateToZonedDate,
  parseZonedDateToLocalDate,
} from "../Utils/date";
import delay from "../../../common/utils/delayPromise";

const ENTRY_TYPES: EntryTypes[] = [
  "Job",
  "Shift",
  "Activity",
  "Unavailability",
  "Manual",
];

type NewEntryKey =
  | "newEntryJob"
  | "newEntryShift"
  | "newEntryActivity"
  | "newEntryUnavailability";

type ReduxNewEntries = {
  [K in NewEntryKey]?: ReduxDataTypes.TimesheetEntryRelation[];
};

interface ReduxProps extends ReduxNewEntries {
  timesheetEntry?: ReduxDataTypes.TimesheetEntry;
  timesheetData?: ReduxDataTypes.TimesheetData[];
  settings?: ReduxDataTypes.Settings;
}

interface Props extends ReduxProps {
  TimesheetUID: string;
  TimesheetEntryUID?: string;
  close: () => void;

  createTimesheetEntry: typeof createTimesheetEntry;
  updateTimesheetEntry: typeof updateTimesheetEntry;
  getNewEntryData: typeof getNewEntryData;
  getEntryById: typeof getEntryById;
  getTimesheets: typeof getTimesheets;
  clearNewEntrState: typeof clearNewEntrState;
}

interface StateEntries {
  JobId?: UID | null;
  ShiftId?: UID | null;
  ActivityId?: UID | null;
  UnavailabilityId?: UID | null;
}

interface IComparedTSEntry {
  jobId: string;
  resourceId: string;
}

type ValidationField = "Start" | "End";

interface State extends StateEntries {
  ResourceUID: UID;
  TimesheetId: string;
  UID?: string;
  EntryType: EntryTypes;
  jobsSelected?: string;
  Name?: string;
  Start?: string;
  End?: string;
  Duration?: number;
  isFinished?: boolean;
  Breaks?: ReduxDataTypes.Break[];
  DistanceUnit: DistanceUnit;
  Distance?: string;
  DisplayName?: string;
  visibleDropdown: boolean;
  Description?: string | null;
  dataFetched: boolean;
  validationError?: string;
  invalidFields?: ValidationField[];
  selectedBreaksIds?: Set<UID>;
  timezone: string;
  LunchBreakFormValue?: number;
  PremiumsFormValue?: Pick<VocabularyItem, "label" | "value">[];
  PremiumOptions?: Pick<VocabularyItem, "label" | "value">[];
  loading: boolean;
  JobAllocationId?: string;
}

const RESET_STATE: Partial<State> = {
  Name: undefined,
  Start: undefined,
  End: undefined,
  Duration: undefined,
  Distance: undefined,
  JobId: undefined,
  ShiftId: undefined,
  ActivityId: undefined,
  UnavailabilityId: undefined,
  Description: undefined,
  Breaks: undefined,
  isFinished: undefined,
  DisplayName: undefined,
  selectedBreaksIds: undefined,
};

const getEntryType: (
  timesheetEntry: ReduxDataTypes.TimesheetEntry
) => EntryTypes = (timesheetEntry) => {
  const { JobId, ShiftId, ActivityId, UnavailabilityId } = timesheetEntry;
  if (JobId) {
    return "Job";
  }
  if (ShiftId) {
    return "Shift";
  }
  if (ActivityId) {
    return "Activity";
  }
  if (UnavailabilityId) {
    return "Unavailability";
  }
  return "Manual";
};

const convertDistance = (distance: number, distanceUnit: string) => {
  return distanceUnit === "KM"
    ? metersToKilometers(distance)
    : metersToMiles(distance);
};

const timesheetEntryToState = (
  timesheetEntry: ReduxDataTypes.TimesheetEntry,
  settings: ReduxDataTypes.Settings
) => {
  if (!timesheetEntry) {
    return {};
  }

  const {
    UID,
    Description,
    StartDate,
    StartTime,
    EndDate,
    EndTime,
    Distance,
    JobId,
    ShiftId,
    ActivityId,
    UnavailabilityId,
  } = timesheetEntry;
  const Start =
    StartDate && StartTime
      ? moment
          .utc(`${StartDate} ${StartTime}`, "YYYY-MM-DD HH:mm")
          .toISOString()
      : undefined;
  const End =
    EndDate && EndTime
      ? moment.utc(`${EndDate} ${EndTime}`, "YYYY-MM-DD HH:mm").toISOString()
      : undefined;

  const distanceUnitSettings = settings.distance;

  const entryType = getEntryType(timesheetEntry);

  const distance = convertDistance(Distance, distanceUnitSettings);

  return {
    UID,
    Start,
    End,
    JobId,
    ShiftId,
    ActivityId,
    UnavailabilityId,
    Description,
    Distance: Distance
      ? distance! % 1
        ? distance!.toFixed(2).toString()
        : distance.toString()
      : undefined,
    DistanceUnit: "KM" as DistanceUnit,
    EntryType: entryType,
    Name: entryType === "Manual" ? entryType : undefined,
    Duration: calculateDurationInMinutes(Start, End),
    selectedBreaksIds:
      entryType === "Shift" ? (new Set() as Set<string>) : undefined,
  };
};

const convertPremiumDataToSelectOptions = (
  options: Pick<VocabularyItem, "label" | "value">[],
  premiums: string[]
): Pick<VocabularyItem, "label" | "value">[] => {
  if (!premiums) {
    return [];
  }

  return options.filter(
    (option) => premiums.findIndex((premium) => premium === option.value) > -1
  );
};

export class TimesheetEntryForm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    // TODO: option mby?
    const timesheetEntry =
      this.props
        .timesheetData!.find(({ UID: tsUID }) => tsUID === props.TimesheetUID)!
        .Entries.find(
          ({ UID: entryUID }) => entryUID === props.TimesheetEntryUID
        ) || undefined;
    const stateValues = timesheetEntry
      ? timesheetEntryToState(timesheetEntry!, props.settings)
      : {};

    this.state = {
      ...RESET_STATE,
      ResourceUID: props.timesheetData!.find(
        ({ UID }) => UID === props.TimesheetUID
      )!.Resource.UID,
      TimesheetId: props.TimesheetUID,
      UID: props.TimesheetEntryUID,
      EntryType: ENTRY_TYPES[0] as EntryTypes,
      visibleDropdown: false,
      dataFetched: false,
      ...stateValues,
      DistanceUnit: props.settings.distance,
      timezone:
        timesheetEntry && timesheetEntry.Timezone
          ? timesheetEntry.Timezone
          : props.settings.defaultTimezone,
      LunchBreakFormValue:
        (timesheetEntry && timesheetEntry.LunchBreakDuration) || 0,
      PremiumOptions: [],
      PremiumsFormValue:
        (timesheetEntry &&
          timesheetEntry.Premiums &&
          (JSON.parse(timesheetEntry.Premiums) as string[]).map((premium) => ({
            label: premium,
            value: premium,
          }))) ||
        [],
      loading: false,
    };
  }

  async componentWillMount() {
    let premiumOptions;
    const entryType = this.state.EntryType;
    if (entryType !== "Manual") {
      await this.props.getNewEntryData!(entryType, this.state.ResourceUID);
    }

    if (entryType === "Job") {
      const { result } = await dataService.fetchPremiumOptions();
      const resource = this.props.timesheetData!.find(
        ({ UID }) => UID === this.props.TimesheetUID
      )!.Resource;
      premiumOptions = result
        .filter((item) => {
          return (
            item.active &&
            item.validFor &&
            (item.validFor.length === 0 ||
              item.validFor.includes(resource.Category))
          );
        })
        .map((rawOption) => ({
          value: rawOption.value,
          label: rawOption.label,
        }));
    }
    const name = this.state.UID ? this.getNameOfRelatedActivity() : undefined;

    this.setState({
      Name: name,
      dataFetched: true,
      PremiumOptions: premiumOptions,
    });
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (
      !!this.state.validationError &&
      this.validatedFieldChanged(prevState, this.state)
    ) {
      this.setState({
        validationError: undefined,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.documentClickHandler);
    this.props.clearNewEntrState();
  }

  validatedFieldChanged(prevState: State, nextState: State) {
    const validatedField = ["Start", "End"];
    for (const field of validatedField) {
      if (prevState[field as keyof State] !== nextState[field as keyof State]) {
        return true;
      }
    }
    return false;
  }

  getNameOfRelatedActivity() {
    const { EntryType: entryType } = this.state;
    if (entryType === "Manual") {
      return "Manual";
    }

    const newEntries =
      this.props[`newEntry${entryType}` as keyof ReduxNewEntries];
    if (!newEntries) {
      return undefined;
    }

    const relatedEntryId = this.state[`${entryType}Id` as keyof StateEntries];
    const relatedEntry = newEntries.find(
      ({ UID: entryUID }) => entryUID === relatedEntryId!
    );

    return relatedEntry
      ? relatedEntry.Name ||
          (relatedEntry as ReduxDataTypes.Shift).DisplayName ||
          relatedEntry.UID
      : undefined;
  }

  documentClickHandler = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    if (!target.matches(`[data-sk-name="sk-dropdownlist"] ${target.tagName}`)) {
      this.hideDropdown();
    }
  };

  hideDropdown = () => {
    document.removeEventListener("click", this.documentClickHandler);
    this.setState({
      visibleDropdown: false,
    });
  };

  showDropdown = () => {
    document.addEventListener("click", this.documentClickHandler);
    this.setState({
      visibleDropdown: true,
    });
  };

  handleSimpleChange =
    (key: "Description" | "DistanceUnit", path = "target.value") =>
    (e: React.SyntheticEvent) => {
      this.setState({
        ...this.state,
        [key]: get(e, path, ""),
      });
    };

  getPrefilledDescription = (
    entryType: EntryTypes,
    data: ReduxDataTypes.TimesheetEntryRelation
  ) => {
    let description;
    switch (entryType) {
      case "Job":
        description = (data as ReduxDataTypes.Job).Description;
        break;
      case "Shift":
        description = (data as ReduxDataTypes.Shift).Location
          ? `${(data as ReduxDataTypes.Shift).Location.Name}`
          : null;
        break;
      case "Activity":
      case "Unavailability":
        description = (
          data as ReduxDataTypes.Activity | ReduxDataTypes.Availability
        ).Type;
        break;
    }

    return description || "";
  };

  handleDateChange = (type: "Start" | "End") => (value: Date) => {
    const valueISO = value
      ? parseZonedDateToLocalDate(value, this.state.timezone).toISOString()
      : null;
    const startDateTime = type === "Start" ? valueISO : this.state.Start;
    const endDateTime = type === "End" ? valueISO : this.state.End;
    this.setState({
      ...this.state,
      [type]: valueISO,
      Duration: calculateDurationInMinutes(startDateTime, endDateTime),
    });
  };

  handleTimeChange = (type: "Start" | "End") => (value: Date) => {
    const valueISO = value
      ? parseZonedDateToLocalDate(value, this.state.timezone).toISOString()
      : null;
    const startDateTime = type === "Start" ? valueISO : this.state.Start;
    const endDateTime = type === "End" ? valueISO : this.state.End;
    this.setState({
      ...this.state,
      [type]: valueISO,
      Duration: calculateDurationInMinutes(startDateTime, endDateTime),
    });
  };

  handleDistanceChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    if (toNumber(value) < 1000) {
      this.setState({ Distance: value });
    }
  };

  limitEntryToTimesheetPeriod = (item: State) => {
    const newItem = { ...item };
    const { timesheetData, TimesheetUID } = this.props;
    const { StartDate, EndDate } = timesheetData!.find(
      ({ UID }) => UID === TimesheetUID
    )!;

    const timesheetStartDate = moment.tz(StartDate, this.state.timezone);
    const timesheetEndDate = moment.tz(EndDate, this.state.timezone);
    const itemStartDate = moment.tz(newItem.Start, this.state.timezone);
    const itemEndDate = moment.tz(newItem.End, this.state.timezone);

    if (
      itemStartDate.isBefore(timesheetStartDate, "days") ||
      itemStartDate.isAfter(timesheetEndDate, "days")
    ) {
      const newStart = timesheetStartDate;
      newStart.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      newItem.Start = newStart.toISOString();
    }

    if (
      itemEndDate.isAfter(timesheetEndDate, "days") ||
      itemEndDate.isBefore(timesheetStartDate, "days")
    ) {
      const newEnd = timesheetEndDate;
      newEnd.set({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 0,
      });
      newItem.End = newEnd.toISOString();
    }
    return newItem;
  };

  handleNameChange = (data: ReduxDataTypes.TimesheetEntryRelation) => () => {
    const { EntryType, PremiumOptions } = this.state;
    const { Start, Name, UID } = data;
    const { Breaks, isFinished, DisplayName } = data as ReduxDataTypes.Shift;
    const { LunchBreakDuration, Premiums, JobAllocationId } =
      data as ReduxDataTypes.Job;
    const endDate =
      (data as ReduxDataTypes.Job).End ||
      (data as ReduxDataTypes.Availability).Finish;
    const Description = this.getPrefilledDescription(EntryType!, data);
    const newState = this.limitEntryToTimesheetPeriod({
      ...this.state,
      isFinished,
      Description,
      EntryType,
      Start,
      DisplayName,
      Breaks:
        Breaks &&
        Breaks.slice().sort(
          (Break1: ReduxDataTypes.Break, Break2: ReduxDataTypes.Break) =>
            Break1.Start < Break2.Start ? -1 : 1
        ),
      [`${EntryType}Id`]: UID,
      End: endDate,
      Name: Name || (data as ReduxDataTypes.Shift).DisplayName || "-",
      Distance:
        EntryType === "Job" && (data as ReduxDataTypes.Job).TravelDistance
          ? convertDistance(
              (data as ReduxDataTypes.Job).TravelDistance,
              this.state.DistanceUnit
            )
              .toFixed(2)
              .toString()
          : undefined,
      selectedBreaksIds:
        EntryType === "Shift"
          ? new Set(Breaks!.map((Break) => Break.UID))
          : undefined,
      LunchBreakFormValue: LunchBreakDuration || 0,
      PremiumsFormValue: convertPremiumDataToSelectOptions(
        PremiumOptions,
        Premiums
      ),
    });

    if (JobAllocationId) {
      newState.JobAllocationId = JobAllocationId;
    }
    newState.Duration = calculateDurationInMinutes(
      newState.Start,
      newState.End
    );

    this.setState(newState);
    this.hideDropdown();
  };

  handleTypeChange = (value: EntryTypes) => () => {
    this.setState({
      ...this.state,
      ...RESET_STATE,
      EntryType: value,
      Name: value === "Manual" ? "Manual" : undefined,
      Start:
        value === "Manual"
          ? this.getMinMaxDates().minDate.toISOString()
          : undefined,
      End:
        value === "Manual"
          ? this.getMinMaxDates().minDate.toISOString()
          : undefined,
      PremiumsFormValue: [],
      LunchBreakFormValue: 0,
    });

    if (
      value !== "Manual" &&
      this.props[`newEntry${value}` as keyof ReduxProps] === undefined
    ) {
      this.props.getNewEntryData!(value, this.state.ResourceUID);
    }

    if (value === "Manual") {
      this.hideDropdown();
    }
  };

  handlePremiumChange = (value: Pick<VocabularyItem, "label" | "value">[]) => {
    this.setState({
      ...this.state,
      PremiumsFormValue: value,
    });
  };

  setValidationError = (
    invalidFields: ValidationField[],
    errorMessage: string
  ) => {
    this.setState({
      invalidFields,
      validationError: errorMessage,
    });
  };

  isValid = () => {
    const { Start, End, EntryType, Duration } = this.state;

    if (EntryType === "Manual" && (!Start || !End)) {
      this.setState({ validationError: "Date is required" });
      return false;
    }

    const entryDuration = Duration || 0;
    if (entryDuration < 0) {
      this.setState({
        validationError: "End time cannot be before start time",
      });
      return false;
    }
    if (entryDuration === 0) {
      this.setState({
        validationError: "End time cannot be the same as start time",
      });
      return false;
    }

    return true;
  };

  toDistanceFormat = (
    distance: string | undefined,
    distanceUnit: string,
    entryType?: EntryTypes
  ) => {
    const numericDistance = parseInt(distance!, 10);
    if ((entryType !== "Job" && entryType !== "Manual") || !numericDistance)
      return null;
    return distanceUnit === "KM"
      ? kilometersToMeters(numericDistance)
      : milesToMeters(numericDistance);
  };

  getNewEntryInput(
    {
      UID,
      TimesheetId,
      EntryType,
      Description,
      Start,
      End,
      Distance,
      ShiftId,
      JobId,
      ActivityId,
      UnavailabilityId,
      PremiumsFormValue,
      LunchBreakFormValue,
    }: Partial<State>,
    distanceUnit: string
  ): Partial<ReduxDataTypes.TimesheetEntry> {
    const [StartDate, StartTime] = new Date(Start!).toISOString().split("T");
    const [EndDate, EndTime] = new Date(End!).toISOString().split("T");
    return {
      UID,
      StartDate,
      EndDate,
      TimesheetId,
      EntryType,
      ShiftId: ShiftId || null,
      JobId: JobId || null,
      ActivityId: ActivityId || null,
      UnavailabilityId: UnavailabilityId || null,
      Description: Description ? Description.trim() || null : null,
      StartTime: StartTime.slice(0, -1),
      EndTime: EndTime.slice(0, -1),
      Distance: this.toDistanceFormat(Distance, distanceUnit, EntryType),
      Duration:
        calculateDurationInMinutes(
          `${StartDate}T${StartTime}Z`,
          `${EndDate}T${EndTime}Z`
        ) - (LunchBreakFormValue || 0),
      LunchBreakDuration: LunchBreakFormValue || 0,
      Premiums:
        PremiumsFormValue && PremiumsFormValue.length
          ? JSON.stringify(PremiumsFormValue.map((premium) => premium.value))
          : null,
    };
  }

  getNewShiftBreakEntryInput: (
    Break: ReduxDataTypes.Break
  ) => Partial<ReduxDataTypes.TimesheetEntry> = (Break) => {
    const [StartDate, StartTime] = new Date(Break.Start!)
      .toISOString()
      .split("T");
    const [EndDate, EndTime] = new Date(Break.End!).toISOString().split("T");

    return {
      StartDate,
      EndDate,
      TimesheetId: this.state.TimesheetId,
      EntryType: "Manual",
      ShiftId: null,
      JobId: null,
      ActivityId: null,
      UnavailabilityId: null,
      Description: "Break",
      StartTime: StartTime.slice(0, -1),
      EndTime: EndTime.slice(0, -1),
      Distance: null,
    };
  };

  getSplitShiftEntryInput() {
    const selectedBreaks = this.state
      .Breaks!.filter((Break) => this.state.selectedBreaksIds!.has(Break.UID))
      .sort((Break1, Break2) => (Break1.Start < Break2.Start ? -1 : 1));

    const inputs = [];

    let start = this.state.Start;
    selectedBreaks.forEach((Break) => {
      if (start !== Break.Start) {
        inputs.push(
          this.getNewEntryInput(
            {
              ...this.state,
              Start: start,
              End: Break.Start,
            },
            this.state.DistanceUnit
          )
        );
      }
      if (Break.Start !== Break.End) {
        inputs.push(this.getNewShiftBreakEntryInput(Break));
      }
      start = Break.End;
    });

    if (start !== this.state.End) {
      inputs.push(
        this.getNewEntryInput(
          { ...this.state, Start: start },
          this.state.DistanceUnit
        )
      );
    }

    return inputs;
  }

  handleLunchBreakChange = (data: { label: string; value: number }) => {
    this.setState({ ...this.state, LunchBreakFormValue: data.value });
  };

  getJobAllocationIds = (timesheetId: string) => {
    const timesheet = this.props.timesheetData.find((timesheet) => {
      return timesheet.UID === timesheetId;
    });
    return timesheet.JobAllocationIds;
  };

  getTimesheet = (timesheetId: string) => {
    const timesheet = this.props.timesheetData.find((timesheet) => {
      return timesheet.UID === timesheetId;
    });
    return timesheet;
  };

  getTimesheetEntry = (timesheetEntryId: string) => {
    const timesheet = this.getTimesheet(this.state.TimesheetId);
    const timesheetEntry = timesheet.Entries.find((entry) => {
      return entry.UID === timesheetEntryId;
    });

    return timesheetEntry;
  };

  mapComparedTSEntry = (
    entry: Partial<ReduxDataTypes.TimesheetEntry>
  ): IComparedTSEntry => {
    const timeSheet = this.getTimesheet(entry.TimesheetId);
    return {
      jobId: entry.JobId || "",
      resourceId: timeSheet.ResourceId || "",
    };
  };

  checkDuplicatedTSEntry = (
    timesheet: ReduxDataTypes.TimesheetData,
    entryToCompare: Partial<ReduxDataTypes.TimesheetEntry>
  ): boolean => {
    const entry = timesheet.Entries.find((entry) => {
      const currInput = this.mapComparedTSEntry(entry);
      return (
        JSON.stringify(currInput) ===
        JSON.stringify(this.mapComparedTSEntry(entryToCompare))
      );
    });
    return entry && !!entry.UID;
  };

  validateDuplicateTimesheetEntry = (
    newInput: Partial<ReduxDataTypes.TimesheetEntry>
  ): boolean => {
    const duplicatedTSEntry = this.props.timesheetData.find((timesheet) => {
      return this.checkDuplicatedTSEntry(timesheet, newInput);
    });
    return duplicatedTSEntry && !!duplicatedTSEntry.UID;
  };

  handleSave = async () => {
    if (!this.isValid()) {
      return;
    }
    const { UID, EntryType, selectedBreaksIds, DistanceUnit } = this.state;
    const newTSEntry = this.getNewEntryInput(this.state, DistanceUnit);
    const input =
      EntryType === "Shift" && selectedBreaksIds!.size > 0
        ? this.getSplitShiftEntryInput()
        : newTSEntry;
    let isDuplicatedEntry = false;
    try {
      this.setState({ loading: true });
      if (UID) {
        const { timesheetData, TimesheetUID } = this.props;
        const { Status } = timesheetData!.find(
          ({ UID }) => UID === TimesheetUID
        )!;
        const isJobAndApprovedTS =
          this.state.EntryType === "Job" && Status === "Approved";
        const payload = {
          ...input,
          IsNew: !isJobAndApprovedTS,
        };
        await this.props.updateTimesheetEntry(
          payload as ReduxDataTypes.TimesheetEntry
        );
        if (isJobAndApprovedTS) {
          const timesheetEntry = this.getTimesheetEntry(
            (input as ReduxDataTypes.TimesheetEntry).UID
          );
          if (timesheetEntry.JobAllocationId) {
            // Because we use webhook to update JA
            // workaround to make sure generate latest JA
            await delay(5000);
            await dataService.triggerGeneratePdf(true, [
              timesheetEntry.JobAllocationId,
            ]);
          }
        }
      } else {
        isDuplicatedEntry = this.validateDuplicateTimesheetEntry(newTSEntry);
        if (isDuplicatedEntry) {
          this.setState({ validationError: "Timesheet entry is duplicated." });
        } else {
          await this.props.createTimesheetEntry(
            Array.isArray(input) ? input : [input]
          );
        }
      }
    } catch (ex) {
      // TODO: Fix: actions must be plain objects
      // tslint:disable-next-line: no-console
      console.error(ex);
    } finally {
      if (!isDuplicatedEntry) {
        await this.syncTSAfterUpdatingEntry();
        this.props.close();
      }
      this.setState({ loading: false });
    }
  };

  syncTSAfterUpdatingEntry = async () => {
    await delay(3000);
    await this.props.getTimesheets();
  };

  getMinMaxDates = () => {
    const { timesheetData, TimesheetUID } = this.props;
    const selectedTimesheetEntry = timesheetData!.find(
      ({ UID }) => UID === TimesheetUID
    )!;

    if (
      !get(selectedTimesheetEntry, "StartDate") ||
      !get(selectedTimesheetEntry, "EndDate")
    ) {
      return {
        minDate: new Date(),
        maxDate: new Date(),
      };
    }

    return {
      minDate: new Date(`${selectedTimesheetEntry.StartDate}T00:00:00.000`),
      maxDate: new Date(`${selectedTimesheetEntry.EndDate}T00:00:00.000`),
    };
  };

  getRelatedToName = () => {
    if (this.state.EntryType === "Shift" && this.state.ShiftId) {
      const name =
        this.state.Name &&
        this.state.Name !== "-" &&
        this.state.Name !== this.state.ShiftId
          ? this.state.Name
          : this.state.DisplayName;
      return (
        name ||
        `Shift ${format(new Date(this.state.Start), "h:mm a")} - ${format(
          new Date(this.state.End),
          "h:mm a"
        )}`
      );
    }
    if (
      this.state.EntryType === "Unavailability" &&
      this.props.newEntryUnavailability &&
      this.state.UnavailabilityId
    ) {
      return (
        this.props.newEntryUnavailability.find(
          ({ UID }) => UID === this.state.UnavailabilityId
        ) as ReduxDataTypes.Availability
      ).Type;
    }
    return this.state.Name || undefined;
  };

  renderDescriptionField() {
    return (
      <div className="sk-mb-8">
        <Label text="Description" />
        <textarea
          className="tse-form__description-field"
          rows={3}
          onChange={this.handleSimpleChange("Description")}
          value={this.state.Description || ""}
        />
      </div>
    );
  }

  renderFields() {
    return (
      <>
        <div className="sk-mb-8">
          <Label text="Start Date" />
          <DatePicker
            selected={
              this.state.Start
                ? parseLocalDateToZonedDate(
                    this.state.Start,
                    this.state.timezone
                  )
                : null
            }
            onChange={this.handleDateChange("Start")}
            {...this.getMinMaxDates()}
          />
        </div>
        <div className="sk-mb-8">
          <Label text="End Date" />
          <DatePicker
            selected={
              this.state.End
                ? parseLocalDateToZonedDate(this.state.End, this.state.timezone)
                : null
            }
            onChange={this.handleDateChange("End")}
            {...this.getMinMaxDates()}
          />
        </div>
        <div className="sk-mb-8 sk-flex">
          <div className="sk-w-1/2 sk-mr-3">
            <Label text="Start Time" />
            <TimePicker
              selected={
                this.state.Start
                  ? parseLocalDateToZonedDate(
                      this.state.Start,
                      this.state.timezone
                    )
                  : undefined
              }
              onChange={this.handleTimeChange("Start")}
              disabled={!this.state.Start}
            />
          </div>
          <div className="sk-w-1/2 sk-ml-3">
            <Label text="End Time" />
            <TimePicker
              selected={
                this.state.End
                  ? parseLocalDateToZonedDate(
                      this.state.End,
                      this.state.timezone
                    )
                  : undefined
              }
              onChange={this.handleTimeChange("End")}
              disabled={!this.state.End}
            />
          </div>
        </div>

        <div className="sk-mb-8 sk-flex">
          <div className="sk-w-1/2 sk-mr-3">
            <Label text="Duration" />
            <FormInputElement
              disabled
              value={minutesToDuration(this.state.Duration) || ""}
            />
          </div>
          {(this.state.EntryType === "Job" ||
            this.state.EntryType === "Manual") && (
            <div className="sk-w-1/2">
              <Label text="Distance" />
              <div className="sk-flex">
                <div className="sk-w-2/3">
                  <FormInputElement
                    inputMode="numeric"
                    value={this.state.Distance || ""}
                    onChange={this.handleDistanceChange}
                  />
                </div>
                <div className="sk-w-1/3 sk-ml-3">
                  <Select
                    label={this.state.DistanceUnit}
                    data={[{ label: "KM" }, { label: "MI" }]}
                    optionLabel="label"
                    disabled
                    onOptionClick={
                      this.handleSimpleChange("DistanceUnit", "label") as (
                        data: object
                      ) => void
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {this.state.EntryType === "Job" && (
          <>
            <div className="sk-mb-8">
              <Label text="Lunch Break" />
              <Select
                label={
                  LUNCH_BREAK_OPTIONS.find(
                    (option) => option.value === this.state.LunchBreakFormValue
                  ).label
                }
                optionLabel="label"
                disabled={this.state.EntryType !== "Job"}
                data={LUNCH_BREAK_OPTIONS}
                onOptionClick={(data: object) => {
                  this.handleLunchBreakChange(
                    data as { label: string; value: number }
                  );
                }}
              />
            </div>
            <div className="sk-mb-8">
              <Label text="Premiums" />
              <MultiSelect
                isDisabled={this.state.EntryType !== "Job"}
                name="premiums"
                options={this.state.PremiumOptions}
                value={this.state.PremiumsFormValue}
                onChange={this.handlePremiumChange}
              />
            </div>
          </>
        )}

        {this.renderDescriptionField()}
      </>
    );
  }

  renderShiftFields() {
    return (
      <>
        <div className="sk-mb-8">
          <Label text="Start Date" />
          <DatePicker
            selected={
              this.state.Start
                ? moment.utc(this.state.Start).tz(this.state.timezone).toDate()
                : null
            }
            onChange={this.handleDateChange("Start")}
            {...this.getMinMaxDates()}
          />
        </div>
        <div className="sk-mb-8">
          <Label text="End Date" />
          <DatePicker
            selected={this.state.End ? moment(this.state.End).toDate() : null}
            onChange={this.handleDateChange("End")}
            {...this.getMinMaxDates()}
          />
        </div>
        <div className="sk-mb-8 sk-flex">
          <div className="sk-w-1/3 sk-mr-3">
            <Label text="Start Time" />
            <TimePicker
              selected={
                this.state.Start ? moment(this.state.Start).toDate() : undefined
              }
              onChange={this.handleTimeChange("Start")}
              disabled={!this.state.Start}
            />
          </div>
          <div className="sk-w-1/3 sk-mr-3">
            <Label text="End Time" />
            <TimePicker
              selected={this.state.End ? new Date(this.state.End) : undefined}
              onChange={this.handleTimeChange("End")}
              disabled={!this.state.End}
            />
          </div>
          <div className="sk-w-1/3">
            <Label text="Duration" />
            <FormInputElement
              disabled
              value={minutesToDuration(this.state.Duration) || ""}
            />
          </div>
        </div>
        {this.renderDescriptionField()}
        {this.state.Breaks && this.state.isFinished && (
          <BreaksSelect
            Breaks={this.state.Breaks}
            onChange={(selections) =>
              this.setState({ selectedBreaksIds: selections })
            }
            selections={this.state.selectedBreaksIds || new Set()}
          />
        )}
      </>
    );
  }

  render() {
    const { EntryType, visibleDropdown, validationError, isFinished } =
      this.state;

    return (
      <div style={{ width: "24rem" }}>
        {validationError && (
          <ValidationError>{validationError}</ValidationError>
        )}
        {EntryType === "Shift" && isFinished === false && (
          <ValidationWarning>
            You are adding this shift before the resource has started or
            completed the shift - please note that shift breaks will not be
            deducted from the duration of this timesheet entry if you continue
          </ValidationWarning>
        )}
        <div className="sk-mb-8 tse-element sk-w-full">
          <Label text="Related To" />
          <TypedSelect
            label={this.getRelatedToName()}
            onButtonClick={this.showDropdown}
            visibleDropdown={visibleDropdown}
            onOptionClick={this.handleNameChange}
            types={ENTRY_TYPES}
            selectedType={this.state.EntryType || ENTRY_TYPES[0]}
            onTypeSelect={this.handleTypeChange}
            loading={!this.state.dataFetched}
            timezone={this.state.timezone}
          />
        </div>

        {EntryType === "Shift" ? this.renderShiftFields() : this.renderFields()}

        <div className="sk-text-right sk-mt-8">
          <Button
            buttonType="transparent"
            onClick={() => this.props.close()}
            className="sk-mr-3"
          >
            Cancel
          </Button>
          <Button buttonType="primary" onClick={this.handleSave}>
            Save
          </Button>
        </div>

        {this.props.timesheetData && this.state.loading && (
          <div className="sk-flex sk-fixed sk-w-full sk-h-full sk-justify-center sk-pin-t sk-pin-l sk-bg-black/5">
            <LoadingSpinner size={84} color="#0b86ff" />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxDataTypes.State) => ({
  newEntryJob: state.newEntryJob,
  newEntryShift: state.newEntryShift,
  newEntryActivity: state.newEntryActivity,
  newEntryUnavailability: state.newEntryUnavailability,
  timesheetEntry: state.timesheetEntry,
  timesheetData: state.timesheetData,
  settings: state.settings,
});

const mapDispatchToProps = {
  getNewEntryData,
  createTimesheetEntry,
  updateTimesheetEntry,
  clearNewEntrState,
  getEntryById,
  getTimesheets,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetEntryForm);
