

import type React from "react"
import { useEffect, useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchPatients } from "../store/patientsSlice"
import { addPrescription } from "../store/prescriptionsSlice"
import {
  Loader2,
  Pill,
  User,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Check,
  Calendar,
  FileText,
} from "lucide-react"

export default function NewPrescriptionForm() {
  const dispatch = useAppDispatch()
  const patients = useAppSelector((s) => s.patients)
  const [form, setForm] = useState({ patientId: "", drugName: "", dosage: "" })
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPatients = async () => {
      setIsLoading(true)
      await dispatch(fetchPatients())
      setIsLoading(false)
    }
    loadPatients()
  }, [dispatch])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedPatient) {
      newErrors.patientId = "Please select a patient"
    }
    if (!form.drugName.trim()) {
      newErrors.drugName = "Drug name is required"
    }
    if (!form.dosage.trim()) {
      newErrors.dosage = "Dosage is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await dispatch(
        addPrescription({
          patientId: selectedPatient.id,
          drugName: form.drugName.trim(),
          dosage: form.dosage.trim(),
          datePrescribed: new Date().toISOString().split("T")[0],
        }),
      )

      setForm({ patientId: "", drugName: "", dosage: "" })
      setSelectedPatient(null)
      setErrors({})
      setShowSuccess(true)

      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      setErrors({ submit: "Failed to create prescription. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePatientChange = (patient: any) => {
    setSelectedPatient(patient)
    if (errors.patientId) {
      setErrors((prev) => ({ ...prev, patientId: "" }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">New Prescription</h2>
              <p className="text-gray-600 mt-1">Create a new prescription for your patient</p>
            </div>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">Prescription created successfully!</p>
            </div>
          )}

          {/* Error Alert */}
          {errors.submit && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 font-medium">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Select Patient
              </label>
              <Listbox value={selectedPatient} onChange={handlePatientChange} disabled={isLoading}>
                <div className="relative">
                  <Listbox.Button
                    className={`relative w-full h-12 cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border-2 transition-colors ${
                      errors.patientId
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    } focus:outline-none focus:ring-2`}
                  >
                    <span className="block truncate">
                      {isLoading ? (
                        <span className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading patients...
                        </span>
                      ) : selectedPatient ? (
                        <span className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {selectedPatient.fullName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <span className="font-medium">{selectedPatient.fullName}</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">Choose a patient...</span>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {patients.map((patient) => (
                        <Listbox.Option
                          key={patient.id}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-3 pl-4 pr-10 ${
                              active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                            }`
                          }
                          value={patient}
                        >
                          {({ selected }) => (
                            <>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {patient.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <span className={`block truncate ${selected ? "font-semibold" : "font-medium"}`}>
                                  {patient.fullName}
                                </span>
                              </div>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <Check className="h-5 w-5" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              {errors.patientId && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.patientId}
                </p>
              )}
            </div>

            {/* Drug Name */}
            <div className="space-y-2">
              <label htmlFor="drugName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Pill className="h-4 w-4 text-green-600" />
                Medication Name
              </label>
              <input
                id="drugName"
                type="text"
                placeholder="Enter medication name (e.g., Amoxicillin)"
                value={form.drugName}
                onChange={(e) => handleInputChange("drugName", e.target.value)}
                className={`w-full h-12 px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                  errors.drugName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {errors.drugName && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.drugName}
                </p>
              )}
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <label htmlFor="dosage" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                Dosage & Instructions
              </label>
              <input
                id="dosage"
                type="text"
                placeholder="Enter dosage and instructions (e.g., 500mg twice daily)"
                value={form.dosage}
                onChange={(e) => handleInputChange("dosage", e.target.value)}
                className={`w-full h-12 px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                  errors.dosage
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {errors.dosage && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.dosage}
                </p>
              )}
            </div>

            {/* Date Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Prescription Date</p>
                  <p className="text-sm text-blue-700">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Prescription...
                </>
              ) : (
                <>
                  <Pill className="h-5 w-5" />
                  Create Prescription
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
