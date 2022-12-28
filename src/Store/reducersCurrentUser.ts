import {
  makeActionsSet,
  makeReducers,
  makeAsyncActionCreatorSimp,
} from "../common/utils/redux-helpers";

import ReduxDataTypes from "./DataTypes";

import { Services } from "../Services/Services";

const CURRENT_USER_GET = makeActionsSet("CURRENT_USER_GET");

export const getCurrentUser = makeAsyncActionCreatorSimp(
  CURRENT_USER_GET,
  () => async () => {
    const resp2 = await Services.metadata.fetchCurrentUserMetadata();
    return resp2;
  }
);

export default {
  ...makeReducers(CURRENT_USER_GET, {
    transform: (currentUser: ReduxDataTypes.User) => {
      return {
        currentUser: {
          id: currentUser.id,
        },
      };
    },
  }),
};
