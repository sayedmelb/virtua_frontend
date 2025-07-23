export const APP_NAME = "Vitura"

export const ROUTES = {
  DASHBOARD: "dashboard",
  PATIENTS: "patients",
  PRESCRIPTIONS: "prescriptions",
  NEW_PRESCRIPTION: "new-prescription",
} as const

export const API_ENDPOINTS = {
  PATIENTS: "http://localhost:5120/api/patients",
  PRESCRIPTIONS: "http://localhost:5120/api/prescriptions",
} as const

export const FORM_VALIDATION = {
  DRUG_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  DOSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
} as const

export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: "w-64",
  CARD_SHADOW: "shadow-sm",
  BORDER_RADIUS: "rounded-xl",
} as const

export const MESSAGES = {
  LOADING: "Loading...",
  NO_DATA: "No data available",
  SUCCESS: {
    PRESCRIPTION_CREATED: "Prescription created successfully!",
  },
  ERROR: {
    REQUIRED_FIELD: "This field is required",
    INVALID_INPUT: "Please enter a valid value",
    NETWORK_ERROR: "Network error. Please try again.",
  },
} as const
