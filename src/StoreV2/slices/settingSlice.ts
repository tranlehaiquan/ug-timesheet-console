import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ReduxDataTypes from "../DataTypes";
import { RootState } from "../store";

interface SettingState {
  distanceUnit: ReduxDataTypes.DistanceUnit;
  showErrorMessage: boolean;
  defaultTimezone: string;
}

const initialState: SettingState = {
  distanceUnit: "KM",
  showErrorMessage: true,
  defaultTimezone: "",
};

const SLICE_NAME = "TIME_SHEET_SETTING";

export const settingSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setTimeSheetSetting: (state, action: PayloadAction<SettingState>) => {
      return {
        ...state,
        distanceUnit: action.payload.distanceUnit,
        showErrorMessage: action.payload.showErrorMessage,
        defaultTimezone: action.payload.defaultTimezone,
      };
    },

    resetTimeSheetSetting: (state) => {
      return {
        ...state,
        ...initialState,
      };
    },
  },
});

export const { setTimeSheetSetting, resetTimeSheetSetting } =
  settingSlice.actions;

export const selectTimeSheetSetting = (state: RootState) => state.setting;

export default settingSlice.reducer;
