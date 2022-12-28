import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface UserState {
  id: string
  name: string
  email: string
}

// Define the initial state using that type
const initialState: UserState = {
  id: '',
  name: '',
  email: ''
}

const SLICE_NAME = 'TIME_SHEET_USER'

export const userSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{id: string, name: string, email: string}>) => {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email
      }
    }
  }
})

export const { setUserData } = userSlice.actions

export const selectUserId = (state: RootState) => state.user.id

export default userSlice.reducer
