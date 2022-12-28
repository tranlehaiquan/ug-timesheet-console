import { get, isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TS_ENTRY_TYPE } from "src/common/constants/timeSheetEntry";
import { calculateDurationInMinutes } from "src/common/utils/dateTimeHelpers";
import { convertDistance } from "src/common/utils/distanceUnits";
import { VocabularyItem } from "src/Services/DataServices";
import ReduxDataTypes, {
  DefinedEntryTypes,
  EntryTypes,
} from "src/StoreV2/DataTypes";
import {
  fetchNewEntryDataByEntryType,
  resetNewEntryInForm,
} from "src/StoreV2/slices/timeSheetEntriesSlice";
import { RootState } from "src/StoreV2/store";
import { IRelatedTo } from "..";
import { TypedSelect } from "../../Controls/TypedSelect";
import { Label } from "../../Utils/Label";

interface IProps {
  resourceId: string;
  timeSheetEntryId: string;
  premiumOptions: Pick<VocabularyItem, "label" | "value">[];
  onChange: (relatedTo: IRelatedTo) => void;
}

// type NewEntryKey = 'newEntryJob' | 'newEntryShift' | 'newEntryActivity' | 'newEntryUnavailability'

// type ReduxNewEntries = {
//   [K in NewEntryKey]?: ReduxDataTypes.TimesheetEntryRelation[]
// }

const ENTRY_TYPES: DefinedEntryTypes[] = [
  "Job",
  "Shift",
  "Activity",
  "Unavailability",
  "Manual",
];

const RelatedToInput = ({
  resourceId,
  onChange,
  timeSheetEntryId = "",
  premiumOptions,
}: IProps) => {
  const newEntryInForm = useSelector(
    (state: RootState) => state.timeSheetEntries.newEntryInForm
  );
  const setting = useSelector((state: RootState) => state.setting);
  const dispatch = useDispatch();
  const timeSheetEntries = useSelector(
    (state: RootState) => state.timeSheetEntries.values
  );
  const timeSheetEntry = timeSheetEntries.find(
    (tsEntry) => tsEntry.UID === timeSheetEntryId
  );
  const [entryType, setEntryType] = useState<DefinedEntryTypes>(ENTRY_TYPES[0]);
  const [newEntryId, setNewEntryId] = useState<string>("");
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [visibleDropdown, setVisibleDropdown] = useState(false);

  const getRelatedToName = () => {
    if (entryType === TS_ENTRY_TYPE.SHIFT && newEntryId) {
      const shiftName =
        name && name !== "-" && name !== newEntryId ? name : displayName;
      // return shiftName || `Shift ${format(new Date(this.state.Start), 'h:mm a')} - ${format(new Date(this.state.End), 'h:mm a')}`
      return shiftName;
    }
    if (
      entryType === TS_ENTRY_TYPE.UNAVAILABILITY &&
      !isEmpty(newEntryInForm.newEntryUnavailability) &&
      newEntryId
    ) {
      return (
        newEntryInForm.newEntryUnavailability.find(
          ({ UID }) => UID === newEntryId
        ) as ReduxDataTypes.Availability
      ).Type;
    }
    return name || undefined;
  };

  const documentClickHandler = useCallback((ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    if (
      !target.matches(`[data-sk-name="sked-dropdownlist"] ${target.tagName}`)
    ) {
      hideDropdown();
    }
  }, []);

  const hideDropdown = () => {
    document.removeEventListener("click", documentClickHandler);
    setVisibleDropdown(false);
  };

  const showDropdown = () => {
    document.addEventListener("click", documentClickHandler);
    setVisibleDropdown(true);
  };

  const getPrefilledDescription = (
    entryType: EntryTypes,
    data: ReduxDataTypes.TimesheetEntryRelation
  ) => {
    let description;
    switch (entryType) {
      case TS_ENTRY_TYPE.JOB:
        description = (data as ReduxDataTypes.Job).Description;
        break;
      case TS_ENTRY_TYPE.SHIFT:
        description = (data as ReduxDataTypes.Shift).Location
          ? `${(data as ReduxDataTypes.Shift).Location.Name}`
          : null;
        break;
      case TS_ENTRY_TYPE.ACTIVITY:
      case TS_ENTRY_TYPE.UNAVAILABILITY:
        description = (
          data as ReduxDataTypes.Activity | ReduxDataTypes.Availability
        ).Type;
        break;
    }

    return description || "";
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

  const handleNameChange =
    (data: ReduxDataTypes.TimesheetEntryRelation) => () => {
      resetState();
      const { Start, Name, UID } = data;
      const { Breaks, isFinished, DisplayName } = data as ReduxDataTypes.Shift;
      const { LunchBreakDuration, Premiums, JobAllocationId, TravelDistance } =
        data as ReduxDataTypes.Job;
      const endDate =
        (data as ReduxDataTypes.Job).End ||
        (data as ReduxDataTypes.Availability).Finish;
      const description = getPrefilledDescription(entryType!, data);
      let extraState = {};
      const newState: IRelatedTo = {
        description,
        entryType,
        start: Start,
        end: endDate,
        duration: calculateDurationInMinutes(Start, endDate),
        name: Name || "-",
        id: UID,
        lunchBreak: 0,
        premiums: null,
        distance: 0,
        jobAllocationId: "",
        breaks: [],
        selectedBreaksIds: null,
        isFinished: false,
      };

      switch (entryType) {
        case TS_ENTRY_TYPE.JOB:
          extraState = {
            jobAllocationId: JobAllocationId || null,
            distance: TravelDistance
              ? convertDistance(TravelDistance, setting.distanceUnit)
                  .toFixed(2)
                  .toString()
              : 0,
            lunchBreak: LunchBreakDuration || 0,
            premiums: convertPremiumDataToSelectOptions(
              premiumOptions,
              Premiums
            ),
          };
          break;
        case TS_ENTRY_TYPE.SHIFT:
          extraState = {
            breaks:
              Breaks &&
              Breaks.slice().sort(
                (Break1: ReduxDataTypes.Break, Break2: ReduxDataTypes.Break) =>
                  Break1.Start < Break2.Start ? -1 : 1
              ),
            selectedBreaksIds: new Set(Breaks!.map((Break) => Break.UID)),
            name: DisplayName || "",
            isFinished,
          };
          setDisplayName(DisplayName || "");
          break;
      }
      onChange({ ...newState, ...extraState });
      setName(newState.name);
      setNewEntryId(UID);
      hideDropdown();
    };

  const resetState = (object: Partial<IRelatedTo> = {}) => {
    onChange({
      description: "",
      duration: 0,
      end: "",
      entryType: object.entryType || null,
      id: "",
      name: object.name || "",
      start: "",
      distance: 0,
      lunchBreak: 0,
      premiums: [],
      jobAllocationId: "",
      breaks: [],
      selectedBreaksIds: null,
      isFinished: false,
    });
  };

  const handleTypeChange = (value: EntryTypes) => () => {
    setEntryType(value);
    if (
      value !== TS_ENTRY_TYPE.MANUAL &&
      isEmpty(get(newEntryInForm, `newEntry${value}`))
    ) {
      dispatch(fetchNewEntryDataByEntryType({ entryType: value, resourceId }));
    }

    if (value === TS_ENTRY_TYPE.MANUAL) {
      hideDropdown();
      resetState({
        entryType: TS_ENTRY_TYPE.MANUAL,
        name: TS_ENTRY_TYPE.MANUAL,
      });
      setName(TS_ENTRY_TYPE.MANUAL);
    }
  };

  const getNameOfRelatedActivity = () => {
    if (entryType === TS_ENTRY_TYPE.MANUAL) {
      return TS_ENTRY_TYPE.MANUAL;
    }

    const newEntries = get(
      newEntryInForm,
      `newEntry${entryType}`,
      []
    ) as ReduxDataTypes.TimesheetEntryRelation[];

    if (isEmpty(newEntries)) {
      return "";
    }

    const relatedEntry = newEntries.find(
      ({ UID: entryUID }) => entryUID === timeSheetEntryId
    );

    return relatedEntry
      ? relatedEntry.Name ||
          (relatedEntry as ReduxDataTypes.Shift).DisplayName ||
          relatedEntry.UID
      : undefined;
  };

  useEffect(() => {
    const initState = () => {
      if (timeSheetEntry) {
        const name = timeSheetEntryId ? getNameOfRelatedActivity() : "";
        setEntryType(timeSheetEntry.EntryType);
        setName(name);
      } else {
        setEntryType(TS_ENTRY_TYPE.JOB as EntryTypes);
        setName("");
      }
    };
    const fetchNewEntryData = async (
      resourceId: string,
      entryType: EntryTypes
    ) => {
      setLoading(true);
      await dispatch(fetchNewEntryDataByEntryType({ entryType, resourceId }));
      setLoading(false);
    };

    if (resourceId) {
      initState();
      fetchNewEntryData(resourceId, entryType);
    }

    return () => {
      dispatch(resetNewEntryInForm());
    };
  }, [resourceId]);

  return (
    <div className="sk-mb-6 tse-element sk-w-full">
      <Label text="Related To" />
      <TypedSelect
        label={getRelatedToName()}
        onButtonClick={showDropdown}
        visibleDropdown={visibleDropdown}
        onOptionClick={handleNameChange}
        types={ENTRY_TYPES}
        selectedType={entryType}
        onTypeSelect={handleTypeChange}
        loading={isLoading}
        timezone={
          (timeSheetEntry && timeSheetEntry.Timezone) || setting.defaultTimezone
        }
      />
    </div>
  );
};

export default React.memo(RelatedToInput);
