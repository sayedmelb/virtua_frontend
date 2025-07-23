import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { prescriptionService } from "../services/prescriptionService"
import type { Prescription } from "../types"

export const fetchPrescriptions = createAsyncThunk("prescriptions/fetch", async () => {
  return await prescriptionService.getAll()
})

export const addPrescription = createAsyncThunk("prescriptions/add", async (newItem: Omit<Prescription, "id">) => {
  return await prescriptionService.create(newItem)
})

const slice = createSlice({
  name: "prescriptions",
  initialState: [] as Prescription[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.fulfilled, (_, action) => action.payload)
      .addCase(addPrescription.fulfilled, (state, action) => {
        state.push(action.payload)
      })
  },
})

export default slice.reducer
