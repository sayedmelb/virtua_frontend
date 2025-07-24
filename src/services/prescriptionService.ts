import api from "./api"
import type { Prescription } from "../types"
import { API_ENDPOINTS } from "../constants"

export const prescriptionService = {
  async getAll(): Promise<Prescription[]> {
    const response = await api.get(API_ENDPOINTS.PRESCRIPTIONS)
    //console.log('COUNT ',response?.data?.length);
    return response.data
  },

  async getCount(): Promise<Prescription[]> {
    const response = await api.get(API_ENDPOINTS.PRESCRIPTIONS)
    return response?.data?.length
  },

  async getById(id: number): Promise<Prescription> {
    const response = await api.get(`${API_ENDPOINTS.PRESCRIPTIONS}/${id}`)
    return response.data
  },

  async getByPatientId(patientId: number): Promise<Prescription[]> {
    const response = await api.get(`${API_ENDPOINTS.PRESCRIPTIONS}?patientId=${patientId}`)
    return response.data
  },

  async create(prescription: Omit<Prescription, "id">): Promise<Prescription> {
    const response = await api.post(API_ENDPOINTS.PRESCRIPTIONS, prescription)
    return response.data
  },

  async update(id: number, prescription: Partial<Prescription>): Promise<Prescription> {
    const response = await api.put(`${API_ENDPOINTS.PRESCRIPTIONS}/${id}`, prescription)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.PRESCRIPTIONS}/${id}`)
  },
}
