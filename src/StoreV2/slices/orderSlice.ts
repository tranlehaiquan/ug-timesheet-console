// order slice redux toolkit

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// init type
interface OrderState {
  orderBy?: {
    field: string
    direction: 'acs' | 'desc'
  }
}

const initialState: OrderState = {
  orderBy: undefined
}

const getOrderByField = (name: string) => {
  switch (name) {
    case 'Timesheet.Resource': {
      return 'Timesheet.Resource.Name'
    }
    case 'EntryType': {
      return 'EntryType'
    }
    case 'Job.Account': {
      return 'Job.Account.Name'
    }
    case 'StartDate': {
      return 'StartDate'
    }
    case 'ActualDuration': {
      return 'Duration'
    }
    case 'Timesheet.Status': {
      return 'Timesheet.Status'
    }
    default: {
      return name
    }
  }
}

// create slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<OrderState['orderBy']>) => {
      state.orderBy = {
        field: getOrderByField(action.payload.field),
        direction: action.payload.direction
      }
    },
    resetOrder: state => {
      state.orderBy = undefined
    }
  }
})

export const { setOrder, resetOrder } = orderSlice.actions

export default orderSlice.reducer
