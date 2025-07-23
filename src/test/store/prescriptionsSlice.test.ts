import { describe, it, expect } from "vitest"
import { configureStore } from "@reduxjs/toolkit"
import prescriptionsReducer, {
  fetchPrescriptions,
  addPrescription,
  type Prescription,
} from "../../store/prescriptionsSlice"

describe("prescriptionsSlice", () => {
  it("should return the initial state", () => {
    expect(prescriptionsReducer(undefined, { type: "unknown" })).toEqual([])
  })

  it("should handle fetchPrescriptions.fulfilled", () => {
    const mockPrescriptions: Prescription[] = [
      {
        id: 1001,
        patientId: 1,
        drugName: "Amoxicillin",
        dosage: "500mg",
        datePrescribed: "2024-12-01",
      },
    ]

    const action = {
      type: fetchPrescriptions.fulfilled.type,
      payload: mockPrescriptions,
    }

    const result = prescriptionsReducer([], action)
    expect(result).toEqual(mockPrescriptions)
  })

  it("should handle addPrescription.fulfilled", () => {
    const initialState: Prescription[] = [
      {
        id: 1001,
        patientId: 1,
        drugName: "Amoxicillin",
        dosage: "500mg",
        datePrescribed: "2024-12-01",
      },
    ]

    const newPrescription: Prescription = {
      id: 1002,
      patientId: 2,
      drugName: "Ibuprofen",
      dosage: "200mg",
      datePrescribed: "2024-12-02",
    }

    const action = {
      type: addPrescription.fulfilled.type,
      payload: newPrescription,
    }

    const result = prescriptionsReducer(initialState, action)
    expect(result).toHaveLength(2)
    expect(result[1]).toEqual(newPrescription)
  })

  it("should handle prescriptions with store", async () => {
    const store = configureStore({
      reducer: {
        prescriptions: prescriptionsReducer,
      },
    })

    expect(store.getState().prescriptions).toEqual([])

    await store.dispatch(fetchPrescriptions())

    const state = store.getState().prescriptions
    expect(state).toHaveLength(2)
    expect(state[0]).toHaveProperty("drugName", "Amoxicillin")
  })

  it("should add new prescription via store", async () => {
    const store = configureStore({
      reducer: {
        prescriptions: prescriptionsReducer,
      },
    })

    const newPrescription = {
      patientId: 1,
      drugName: "Aspirin",
      dosage: "100mg",
      datePrescribed: "2024-12-05",
    }

    await store.dispatch(addPrescription(newPrescription))

    const state = store.getState().prescriptions
    expect(state).toHaveLength(1)
    expect(state[0]).toMatchObject(newPrescription)
    expect(state[0]).toHaveProperty("id")
  })
})
