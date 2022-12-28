import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FAILED_FETCH_RESOURCE } from "../../common/constants/errorMessage";
import { toastMessage } from "../../common/utils/notificationUtils";
import { autoPaginationGraphqlRequest } from "../../Services/GraphQLServices";
// import { Services } from '../../Services/Services'
import ReduxDataTypes from "../DataTypes";
// import { RootState } from '../store'
import * as Queries from "../queries";

interface ResourceState {
  values: ReduxDataTypes.Resource[];
  loading: boolean;
}

// Define the initial state using that type
const initialState: ResourceState = {
  values: [],
  loading: false,
};

const SLICE_NAME = "TIME_SHEET_RESOURCE";

export const fetchResources = createAsyncThunk(
  `${SLICE_NAME}/fetchAll`,
  async () => {
    const resources =
      await autoPaginationGraphqlRequest<ReduxDataTypes.Resource>(
        Queries.AllResourcesQuery,
        "resources",
        {},
        ["Name", "UID"]
      );
    return resources || [];
  }
);

export const resourceSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchResources.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(fetchResources.fulfilled, (state, action) => {
      return {
        ...state,
        values: action.payload,
        loading: false,
      };
    });
    builder.addCase(fetchResources.rejected, (state) => {
      toastMessage.error(FAILED_FETCH_RESOURCE);
      return {
        ...state,
        values: [],
        loading: false,
      };
    });
  },
});

export default resourceSlice.reducer;
