import type React from "react"
// Centralized type definitions
export interface Patient {
  id: number
  fullName: string
  dateOfBirth: string
}

export interface Prescription {
  id: number
  patientId: number
  drugName: string
  dosage: string
  datePrescribed: string
}

export interface FormErrors {
  [key: string]: string
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export type TabId = "dashboard" | "patients" | "prescriptions" | "new-prescription"

export interface NavigationItem {
  id: TabId
  name: string
  icon: React.ComponentType
}
