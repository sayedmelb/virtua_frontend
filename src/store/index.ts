import { configureStore } from "@reduxjs/toolkit"
import patientsReducer from "./patientsSlice"
import prescriptionsReducer from "./prescriptionsSlice"

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    prescriptions: prescriptionsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
