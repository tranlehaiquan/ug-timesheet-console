import { makeActionCreator } from "../common/utils/redux-helpers";
import ReduxDataTypes from "./DataTypes";

const SETTINGS_APPLY = "SETTINGS_APPLY";

export const applySettings = makeActionCreator(
  SETTINGS_APPLY,
  null,
  "settings"
);

export const getDefaultSettings = () => ({
  distance: "KM" as ReduxDataTypes.DistanceUnit,
  showErrorMessage: false,
});

export default {
  [SETTINGS_APPLY]: (
    state: ReduxDataTypes.State,
    { settings }: { settings: ReduxDataTypes.Settings }
  ) => ({
    ...state,
    settings,
  }),
};
