import { describe, it, expect } from "vitest"
import { configureStore } from "@reduxjs/toolkit"
import patientsReducer, { fetchPatients } from "../../store/patientsSlice"

describe("patientsSlice", () => {
  it("should return the initial state", () => {
    expect(patientsReducer(undefined, { type: "unknown" })).toEqual([])
  })

  it("should handle fetchPatients.fulfilled", () => {
    const mockPatients = [
      { id: 1, fullName: "Alice Smith", dateOfBirth: "1985-04-10" },
      { id: 2, fullName: "Bob Jones", dateOfBirth: "1978-09-22" },
    ]

    const action = {
      type: fetchPatients.fulfilled.type,
      payload: mockPatients,
    }

    const result = patientsReducer([], action)
    expect(result).toEqual(mockPatients)
  })

  it("should handle fetchPatients with store", async () => {
    const store = configureStore({
      reducer: {
        patients: patientsReducer,
      },
    })

    expect(store.getState().patients).toEqual([])

    await store.dispatch(fetchPatients())

    const state = store.getState().patients
    expect(state).toHaveLength(3)
    expect(state[0]).toHaveProperty("fullName", "Alice Smith")
  })
})
