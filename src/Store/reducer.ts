import { Reducer } from "redux";
import { makeReducer, DEF_RES_STATE } from "../common/utils/redux-helpers";

import ReduxDataTypes from "./DataTypes";

import { fetchReducers } from "./reducersFetch";
import { timesheetsReducers } from "./reducersTimesheets";
import filterReducers from "./reducersFilter";
import currentUserReducers from "./reducersCurrentUser";
import timeRangeReducers, { getDefaultTimeRange } from "./reducersTimeRange";
import settingsReducers, { getDefaultSettings } from "./reducersSettings";
import { entriesReducers } from "./reducersEntries";
import { inputReducers } from "../Mutations/input";
import { subscriptionReducers } from "./reducersSubscriptions";

const DEF_STATE: ReduxDataTypes.State = {
  ...DEF_RES_STATE,
  filters: [],
  timeRange: getDefaultTimeRange(),
  settings: getDefaultSettings(),
  expandedUID: null,
  timesheetData: [],
};

const reducer = makeReducer(
  {
    ...subscriptionReducers,
    ...inputReducers,
    ...fetchReducers,
    ...timesheetsReducers,
    ...filterReducers,
    ...currentUserReducers,
    ...timeRangeReducers,
    ...settingsReducers,
    ...entriesReducers,
    SET_EXPANDED_UID: (
      state: ReduxDataTypes.State,
      { UID }: { UID: string }
    ) => {
      return {
        ...state,
        expandedUID: UID,
      };
    },
  },
  DEF_STATE
) as Reducer;

export default reducer;
