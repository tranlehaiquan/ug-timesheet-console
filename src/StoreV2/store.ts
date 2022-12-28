import { configureStore } from '@reduxjs/toolkit'
import filterSlice from './slices/filterSlice'
import resourceSlice from './slices/resourceSlice'
import settingSlice from './slices/settingSlice'
import summarySlice from './slices/summarySlice'
import timeSheetEntriesSlice from './slices/timeSheetEntriesSlice'
import userSlice from './slices/userSlice'
import orderSlice from './slices/orderSlice'
import globalLoadingSlice from './slices/globalLoading/globalLoadingSlice'

export const store = configureStore({
  reducer: {
    timeSheetEntries: timeSheetEntriesSlice,
    setting: settingSlice,
    filter: filterSlice,
    resource: resourceSlice,
    summary: summarySlice,
    user: userSlice,
    order: orderSlice,
    globalLoading: globalLoadingSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, sers: UsersState}
export type AppDispatch = typeof store.dispatch
