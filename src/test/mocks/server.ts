import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"

const mockPatients = [
  { id: 1, fullName: "Alice Smith", dateOfBirth: "1985-04-10" },
  { id: 2, fullName: "Bob Jones", dateOfBirth: "1978-09-22" },
  { id: 3, fullName: "Carlos Mendes", dateOfBirth: "1990-01-15" },
]

const mockPrescriptions = [
  {
    id: 1001,
    patientId: 1,
    drugName: "Amoxicillin",
    dosage: "500mg",
    datePrescribed: "2024-12-01",
  },
  {
    id: 1002,
    patientId: 2,
    drugName: "Ibuprofen",
    dosage: "200mg",
    datePrescribed: "2024-12-03",
  },
]

export const handlers = [
  // Patients API
  http.get("http://localhost:5000/patients", () => {
    return HttpResponse.json(mockPatients)
  }),

  // Prescriptions API
  http.get("http://localhost:5000/prescriptions", () => {
    return HttpResponse.json(mockPrescriptions)
  }),

  http.post("http://localhost:5000/prescriptions", async ({ request }) => {
    const newPrescription = (await request.json()) as any
    const prescription = {
      id: Date.now(),
      ...newPrescription,
    }
    return HttpResponse.json(prescription)
  }),
]

export const server = setupServer(...handlers)
