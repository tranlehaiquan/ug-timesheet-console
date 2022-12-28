// global loading slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// type
interface GlobalLoadingState {
  isLoading: boolean
}

// init state
const initialState: GlobalLoadingState = {
  isLoading: false
}

// create slice
const globalLoadingSlice = createSlice({
  name: 'globalLoading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const { setLoading } = globalLoadingSlice.actions

export default globalLoadingSlice.reducer
