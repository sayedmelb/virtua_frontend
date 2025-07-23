import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { patientService } from "../services/patientService"
import type { Patient } from "../types"

export const fetchPatients = createAsyncThunk("patients/fetch", async () => {
  return await patientService.getAll()
})

export const createPatient = createAsyncThunk("patients/create", async (patient: Omit<Patient, "id">) => {
  return await patientService.create(patient)
})

const patientsSlice = createSlice({
  name: "patients",
  initialState: [] as Patient[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.fulfilled, (_, action) => action.payload)
      .addCase(createPatient.fulfilled, (state, action) => {
        state.push(action.payload)
      })
  },
})

export default patientsSlice.reducer
