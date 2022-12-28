import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { first } from "lodash";
import { Loading } from "skedulo-ui";
import AllTimeSheetEntryPage from "./Pages/AllTimesheetsPage";
import ErrorBoundary from "./Components/ErrorBoundary";
import { dataService } from "./Services/DataServices";
import { setTimeSheetSetting } from "./StoreV2/slices/settingSlice";
import { setUserData } from "./StoreV2/slices/userSlice";
import { toastMessage } from "./common/utils/notificationUtils";
import GlobalLoading from "./StoreV2/slices/globalLoading/GlobalLoading";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const fetchOrgPreference = useCallback(async () => {
    try {
      setLoading(true);
      const [preference, userMetaData, settings] = await Promise.all([
        dataService.fetchPreference(),
        dataService.fetchUserMetaData(),
        dataService.fetchSkeduloSetting(),
      ]);
      const defaultDistanceUnit =
        get(preference, '["phoenix.app-preferences"].measureSystem') ===
        "imperial"
          ? "MI"
          : "KM";
      const showErrorMessage = get(
        first(settings.skeduloAdminSetting),
        "ShowTimeSheetError",
        false
      );

      dispatch(
        setTimeSheetSetting({
          distanceUnit: defaultDistanceUnit,
          defaultTimezone: get(userMetaData, "resource.timezone"),
          showErrorMessage,
        })
      );
      dispatch(
        setUserData({
          id: get(userMetaData, "id"),
          name: get(userMetaData, "fullName"),
          email: get(userMetaData, "email"),
        })
      );
    } catch ({ message }) {
      toastMessage.error(message as string);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgPreference();
  }, []);

  return (
    <ErrorBoundary>
      <GlobalLoading />
      {isLoading ? (
        <Loading align="center" />
      ) : (
        <>
          <AllTimeSheetEntryPage />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            pauseOnHover
            hideProgressBar
            className="cx-z-9999"
          />
        </>
      )}
    </ErrorBoundary>
  );
}

export default App;
