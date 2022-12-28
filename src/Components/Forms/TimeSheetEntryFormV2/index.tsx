import React, { useEffect, useState } from "react";
import ReduxDataTypes, {
  DefinedEntryTypes,
  EntryTypes,
  TimesheetStatus,
} from "src/StoreV2/DataTypes";
import RelatedToInput from "./RelatedToInput";
import ResourceInput from "./ResourceInput";
import StartEndDateInput from "./StartEndDateInput";
import "../TimesheetEntryForm/TimesheetEntryForm.scss";
import StartEndTimeInput from "./StartEndTimeInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/StoreV2/store";
import DurationInput from "./DurationInput";
import DistanceInput from "./DistanceInput";
import {
  DEFAULT_TS_ENTRY_PAGINATION,
  TS_ENTRY_TYPE,
} from "../../../common/constants/timeSheetEntry";
import LunchBreakInput from "./LunchBreakInput";
import { dataService, VocabularyItem } from "src/Services/DataServices";
import PremiumInput from "./PremiumInput";
import DescriptionInput from "./DescriptionInput";
import { toDistanceFormatWithTSEntryType } from "src/common/utils/distanceUnits";
import { calculateDurationInMinutes } from "src/common/utils/dateTimeHelpers";
import { Button } from "skedulo-ui";
import { ValidationError, ValidationWarning } from "../ValidationError";
import {
  parseLocalDateToZonedDate,
  parseZonedDateToLocalDate,
} from "../Utils/date";
import moment from "moment";
import momentTz from "moment-timezone";
import { isEmpty } from "lodash";
import { TIME_SHEET_STATUS } from "src/common/constants/timesheet";
import { getJobAllocationByTimeSheetEntry } from "src/common/utils/timesheetEntry";
import delay from "src/common/utils/delayPromise";
import { toastMessage } from "src/common/utils/notificationUtils";
import { setLoading } from "src/StoreV2/slices/globalLoading/globalLoadingSlice";
import {
  createTimeSheetEntry,
  fetchTimeSheetEntries,
  updateTimeSheetEntry,
} from "src/StoreV2/slices/timeSheetEntriesSlice";

interface IProps {
  timeSheetEntryId: string;
  setModalVisible: (value: boolean) => void;
}

export interface IRelatedTo {
  description: string;
  entryType: DefinedEntryTypes;
  start: string;
  end: string;
  duration: number;
  name: string;
  id: string;
  distance: number;
  lunchBreak: number;
  premiums: Pick<VocabularyItem, "label" | "value">[];
  jobAllocationId: string;
  breaks: ReduxDataTypes.Break[];
  selectedBreaksIds: Set<string>;
  isFinished: boolean;
}

export interface IDate {
  start: string;
  end: string;
}

interface IComparedTSEntry {
  jobId: string;
  resourceId: string;
}
export interface ITime {
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
}

export interface IDistance {
  value: number;
  unit: string;
}

interface IForm {
  resourceId: string;
  relatedTo: IRelatedTo;
  date: IDate;
  time: ITime;
  distance: IDistance;
  lunchBreak: number;
  premiums: Pick<VocabularyItem, "label" | "value">[];
  description: string;
}

const initialFormValue: IForm = {
  resourceId: null,
  relatedTo: {
    description: "",
    duration: 0,
    end: "",
    entryType: null,
    id: "",
    name: "",
    start: "",
    distance: 0,
    lunchBreak: 0,
    premiums: [],
    jobAllocationId: "",
    breaks: [],
    selectedBreaksIds: null,
    isFinished: false,
  },
  date: {
    start: null,
    end: null,
  },
  time: {
    start: {
      hour: 0,
      minute: 0,
    },
    end: {
      hour: 0,
      minute: 0,
    },
  },
  distance: {
    value: 0,
    unit: null,
  },
  lunchBreak: 0,
  premiums: null,
  description: null,
};

type FieldName =
  | "resourceId"
  | "relatedTo"
  | "date"
  | "time"
  | "distance"
  | "lunchBreak"
  | "premiums"
  | "description";

const TimeSheetEntryForm = ({ timeSheetEntryId, setModalVisible }: IProps) => {
  const setting = useSelector((state: RootState) => state.setting);
  const timeSheetEntries = useSelector(
    (state: RootState) => state.timeSheetEntries
  );
  const tsEntry = timeSheetEntries.values.find(
    (entry) => entry.UID === timeSheetEntryId
  );
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState<IForm>(initialFormValue);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [premiumOptions, setPremiumOptions] = useState<
    Pick<VocabularyItem, "label" | "value">[]
  >([]);
  const resources = useSelector((state: RootState) => state.resource.values);
  const entryType = formValue.relatedTo.entryType || "Job";
  const onFormChange =
    <FieldName, K>(fieldName: FieldName) =>
    (value: K) => {
      setFormValue((prevState) => {
        return {
          ...prevState,
          [String(fieldName)]: value,
        };
      });
    };

  const convertDateAndTimeToISO = (
    date: IDate,
    time: ITime,
    timeZone: string
  ): { startISO: string; endISO: string } => {
    if (isEmpty(date) && isEmpty(time)) {
      return {
        startISO: "",
        endISO: "",
      };
    }
    const startDateYYYYMMDD = momentTz
      .tz(moment(date.start), timeZone)
      .format("YYYY-MM-DD");
    const endDateYYYYMMDD = momentTz
      .tz(moment(date.end), timeZone)
      .format("YYYY-MM-DD");
    const startISO = moment(
      `${startDateYYYYMMDD} ${time.start.hour}:${time.start.minute}`
    ).toISOString();
    const endISO = moment(
      `${endDateYYYYMMDD} ${time.end.hour}:${time.end.minute}`
    ).toISOString();

    return {
      startISO: parseZonedDateToLocalDate(startISO, timeZone).toISOString(),
      endISO: parseZonedDateToLocalDate(endISO, timeZone).toISOString(),
    };
  };
  const isValid = (formData: IForm): boolean => {
    const { date, relatedTo, time } = formData;
    const { startISO, endISO } = convertDateAndTimeToISO(
      date,
      time,
      setting.defaultTimezone
    );
    const durationTime = calculateDurationInMinutes(startISO, endISO) || 0;
    if (
      relatedTo.entryType === TS_ENTRY_TYPE.MANUAL &&
      (!date.start || !date.end)
    ) {
      setErrorMessage("Date is required");
      return false;
    }

    if (durationTime < 0) {
      setErrorMessage("End time cannot be before start time");
      return false;
    }
    if (durationTime === 0) {
      setErrorMessage("End time cannot be the same as start time");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const getNewEntryInput = (
    formData: IForm
  ): Partial<ReduxDataTypes.TimesheetEntry> => {
    const {
      date,
      relatedTo,
      description,
      lunchBreak,
      premiums,
      distance,
      time,
    } = formData || {};
    const { startISO, endISO } = convertDateAndTimeToISO(
      date,
      time,
      setting.defaultTimezone
    );
    const [startDate, startTime] = startISO.split("T");
    const [endDate, endTime] = endISO.split("T");
    return {
      UID: timeSheetEntryId || undefined,
      TimesheetId: tsEntry ? tsEntry.TimesheetId : null,
      StartDate: startDate,
      EndDate: endDate,
      EntryType: relatedTo ? relatedTo.entryType : null,
      [`${relatedTo.entryType}Id`]: relatedTo.id,
      Description: description ? description.trim() : null,
      StartTime: startTime.slice(0, -1),
      EndTime: endTime.slice(0, -1),
      Distance:
        toDistanceFormatWithTSEntryType(
          distance.value,
          distance.unit,
          relatedTo.entryType
        ) || 0,
      Duration: calculateDurationInMinutes(startISO, endISO) - lunchBreak,
      LunchBreakDuration: lunchBreak,
      Premiums:
        premiums && premiums.length
          ? JSON.stringify(premiums.map((premium) => premium.value))
          : null,
    };
  };

  const getNewShiftBreakEntryInput = (
    Break: ReduxDataTypes.Break
  ): Partial<ReduxDataTypes.TimesheetEntry> => {
    const [StartDate, StartTime] = new Date(Break.Start!)
      .toISOString()
      .split("T");
    const [EndDate, EndTime] = new Date(Break.End!).toISOString().split("T");
    return {
      StartDate,
      EndDate,
      EntryType: TS_ENTRY_TYPE.MANUAL as EntryTypes,
      Description: "Break",
      StartTime: StartTime.slice(0, -1),
      EndTime: EndTime.slice(0, -1),
    };
  };

  const getSplitShiftEntryInput = (formData: IForm) => {
    const { relatedTo, date } = formData;
    const selectedBreaks =
      relatedTo.breaks ||
      []
        .filter((Break) => relatedTo.selectedBreaksIds!.has(Break.UID))
        .sort((Break1, Break2) => (Break1.Start < Break2.Start ? -1 : 1));

    const inputs = [];

    let start = date.start;
    selectedBreaks.forEach((Break) => {
      if (start !== Break.Start) {
        inputs.push(
          getNewEntryInput({
            ...formData,
            ...{
              date: {
                start,
                end: Break.Start,
              },
            },
          })
        );
      }
      if (Break.Start !== Break.End) {
        inputs.push(getNewShiftBreakEntryInput(Break));
      }
      start = Break.End;
    });

    if (start !== date.end) {
      inputs.push(
        getNewEntryInput({ ...formData, ...{ date: { start, end: date.end } } })
      );
    }

    return inputs;
  };

  const mapComparedTSEntry = (
    entry: Partial<ReduxDataTypes.TimesheetEntry>,
    resourceId: string
  ): IComparedTSEntry => {
    return {
      jobId:
        entry.JobId ||
        entry.ActivityId ||
        entry.UnavailabilityId ||
        entry.ShiftId ||
        "",
      resourceId: resourceId || "",
    };
  };

  const checkDuplicatedTSEntry = async (
    entryToCompare: Partial<ReduxDataTypes.TimesheetEntry>,
    resourceId: string
  ): Promise<boolean> => {
    const { timesheetEntry: tsEntries } =
      await dataService.fetchTimeSheetEntriesByTypeID(
        [formValue.relatedTo.id],
        entryType
      );
    const entry = tsEntries.find((entry) => {
      const currResourceId =
        entry.Timesheet && entry.Timesheet.ResourceId
          ? entry.Timesheet.ResourceId
          : "";
      const currInput = mapComparedTSEntry(entry, currResourceId);
      return (
        JSON.stringify(currInput) ===
        JSON.stringify(mapComparedTSEntry(entryToCompare, resourceId))
      );
    });
    return entry && !!entry.UID;
  };

  const handleSave = async (formData: IForm) => {
    if (!isValid(formData)) {
      return;
    }
    let isUpdatedAction = false;
    let isDuplicatedEntry = false;
    try {
      const {
        relatedTo: { entryType },
      } = formData;
      const newTSEntry =
        entryType === TS_ENTRY_TYPE.SHIFT
          ? getSplitShiftEntryInput(formData)
          : getNewEntryInput(formData);
      dispatch(setLoading(true));
      if (timeSheetEntryId) {
        const isJobAndApprovedTS =
          entryType === TS_ENTRY_TYPE.JOB &&
          tsEntry.Timesheet &&
          tsEntry.Timesheet.Status === TIME_SHEET_STATUS.APPROVED;
        const payload = {
          ...newTSEntry,
          IsNew: !isJobAndApprovedTS,
        };
        await dispatch(
          updateTimeSheetEntry(payload as ReduxDataTypes.TimesheetEntry)
        );
        isUpdatedAction = true;
        if (isJobAndApprovedTS) {
          const jobAllocation = getJobAllocationByTimeSheetEntry(tsEntry);
          if (jobAllocation && jobAllocation.UID) {
            // Because we use webhook to update JA
            // workaround to make sure generate latest JA
            await delay(5000);
            await dataService.triggerGeneratePdf(true, [jobAllocation.UID]);
          }
        }
      } else {
        isDuplicatedEntry = await checkDuplicatedTSEntry(
          getNewEntryInput(formData),
          formData.resourceId
        );
        if (isDuplicatedEntry) {
          setErrorMessage("Timesheet entry is duplicated.");
        } else {
          const [startDate] = formData.date.start.split("T");
          const [endDate] = formData.date.end.split("T");
          const resp = await dataService.createTimeSheet({
            ResourceId: formData.resourceId,
            Status: TIME_SHEET_STATUS.DRAFT as TimesheetStatus,
            StartDate: startDate,
            EndDate: endDate,
          });
          const timeSheetId = resp.schema.insertTimesheet;
          const newTSEntryWithTimeSheetId = {
            ...newTSEntry,
            TimesheetId: timeSheetId,
          };
          await dispatch(
            createTimeSheetEntry({
              payload: Array.isArray(newTSEntryWithTimeSheetId)
                ? newTSEntryWithTimeSheetId
                : [newTSEntryWithTimeSheetId],
            })
          );
        }
      }
    } catch (ex) {
      toastMessage.error(
        `Failed to ${isUpdatedAction ? "updated" : "created"} timesheet entry`
      );
    } finally {
      if (!isDuplicatedEntry) {
        await delay(3000);
        await dispatch(fetchTimeSheetEntries(DEFAULT_TS_ENTRY_PAGINATION));
        setModalVisible(false);
        toastMessage.success(
          `${
            isUpdatedAction ? "Updated" : "Created"
          } timesheet entry successfully`
        );
      }
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const fetchPremiumOptions = async (resourceId: string) => {
      const { result } = await dataService.fetchPremiumOptions();
      const resource = resources.find(
        (resource) => resource.UID === resourceId
      );
      const premiumOptions = result
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
      setPremiumOptions(premiumOptions);
    };
    if (formValue.resourceId) {
      const { resourceId } = formValue;
      setFormValue({ ...initialFormValue, ...{ resourceId } });
      setErrorMessage("");
      fetchPremiumOptions(resourceId);
    }
  }, [formValue.resourceId]);

  useEffect(() => {
    const resetFormValue = ({ relatedTo }: Pick<IForm, "relatedTo">): void => {
      const { start, end, distance, lunchBreak, premiums, description } =
        relatedTo;
      const timeZone = setting.defaultTimezone;
      const newFormValue: Omit<IForm, "relatedTo" | "resourceId"> = {
        date: {
          start,
          end,
        },
        time: {
          start: {
            hour: parseLocalDateToZonedDate(start, timeZone).getHours(),
            minute: parseLocalDateToZonedDate(start, timeZone).getMinutes(),
          },
          end: {
            hour: parseLocalDateToZonedDate(end, timeZone).getHours(),
            minute: parseLocalDateToZonedDate(end, timeZone).getMinutes(),
          },
        },
        distance: {
          value: distance,
          unit: setting.distanceUnit,
        },
        lunchBreak,
        premiums,
        description,
      };

      setFormValue((preState) => ({
        ...preState,
        ...newFormValue,
      }));
    };
    resetFormValue(formValue);
  }, [JSON.stringify(formValue.relatedTo)]);

  return (
    <div style={{ width: "24rem" }}>
      {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
      {entryType === "Shift" && formValue.relatedTo.isFinished === false && (
        <ValidationWarning>
          You are adding this shift before the resource has started or completed
          the shift - please note that shift breaks will not be deducted from
          the duration of this timesheet entry if you continue
        </ValidationWarning>
      )}
      <ResourceInput
        resourceId={formValue.resourceId}
        onChange={onFormChange<FieldName, string>("resourceId")}
      />
      <RelatedToInput
        resourceId={formValue.resourceId}
        timeSheetEntryId={timeSheetEntryId}
        onChange={onFormChange<FieldName, IRelatedTo>("relatedTo")}
        premiumOptions={premiumOptions}
      />
      <StartEndDateInput
        defaultValue={{
          start: formValue.relatedTo.start,
          end: formValue.relatedTo.end,
        }}
        timeZone={setting.defaultTimezone}
        onChange={onFormChange<FieldName, IDate>("date")}
      />
      <StartEndTimeInput
        start={formValue.relatedTo.start}
        end={formValue.relatedTo.end}
        timeZone={setting.defaultTimezone}
        onChange={onFormChange<FieldName, ITime>("time")}
      />
      <div className="sk-mb-6 sk-flex">
        <DurationInput
          date={formValue.date}
          time={formValue.time}
          timeZone={setting.defaultTimezone}
        />
        {(entryType === TS_ENTRY_TYPE.JOB ||
          entryType === TS_ENTRY_TYPE.MANUAL) && (
          <DistanceInput
            defaultValue={{
              distance: formValue.relatedTo.distance || 0,
              distanceUnit: setting.distanceUnit,
            }}
            onChange={onFormChange<FieldName, IDistance>("distance")}
          />
        )}
      </div>
      {entryType === TS_ENTRY_TYPE.JOB && (
        <>
          <LunchBreakInput
            defaultValue={formValue.relatedTo.lunchBreak || 0}
            onChange={onFormChange<FieldName, number>("lunchBreak")}
          />
          <PremiumInput
            premiumOptions={premiumOptions}
            defaultValue={formValue.relatedTo.premiums}
            onChange={onFormChange<
              FieldName,
              Pick<VocabularyItem, "label" | "value">[]
            >("premiums")}
          />
        </>
      )}
      <DescriptionInput
        defaultValue={formValue.relatedTo.description}
        onChange={onFormChange<FieldName, string>("description")}
      />
      <div className="sk-text-right">
        <Button
          buttonType="transparent"
          onClick={() => setModalVisible(false)}
          className="sk-mr-3"
        >
          Cancel
        </Button>
        <Button
          disabled={false}
          buttonType="primary"
          onClick={() => {
            handleSave(formValue);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TimeSheetEntryForm;
