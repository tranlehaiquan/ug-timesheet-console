import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/StoreV2/store";
import { setLoading } from "./globalLoadingSlice";

export const useGlobalLoading = () => {
  const selfCounter = React.useRef(0);
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: RootState) => state.globalLoading.isLoading
  );

  const actions = React.useMemo(
    () => ({
      startGlobalLoading: () => {
        if (!selfCounter.current) {
          dispatch(setLoading(true));
        }
        selfCounter.current += 1;
      },
      endGlobalLoading: () => {
        if (selfCounter.current > 0) {
          selfCounter.current -= 1;
          if (!selfCounter.current) {
            dispatch(setLoading(false));
          }
        } else {
          console.warn(
            "Should not call endGlobalLoading more time than startGlobalLoading"
          );
        }
      },
    }),
    [selfCounter, isLoading]
  );

  return {
    ...actions,
    isLoading,
  };
};
