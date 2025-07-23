import api from "./api"
import type { Patient } from "../types"
import { API_ENDPOINTS } from "../constants"

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const response = await api.get(API_ENDPOINTS.PATIENTS)
    return response.data
  },

  async getById(id: number): Promise<Patient> {
    const response = await api.get(`${API_ENDPOINTS.PATIENTS}/${id}`)
    return response.data
  },

  async create(patient: Omit<Patient, "id">): Promise<Patient> {
    const response = await api.post(API_ENDPOINTS.PATIENTS, patient)
    return response.data
  },

  async update(id: number, patient: Partial<Patient>): Promise<Patient> {
    const response = await api.put(`${API_ENDPOINTS.PATIENTS}/${id}`, patient)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.PATIENTS}/${id}`)
  },
}
