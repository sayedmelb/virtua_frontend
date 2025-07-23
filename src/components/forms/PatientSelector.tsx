import { Listbox, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { ChevronDown, Check, User } from "lucide-react"
import type { Patient } from "../../types"
import { getInitials } from "../../lib/utils"

interface PatientSelectorProps {
  patients: Patient[]
  selectedPatient: Patient | null
  onPatientChange: (patient: Patient | null) => void
  loading?: boolean
  error?: string
}

export function PatientSelector({
  patients,
  selectedPatient,
  onPatientChange,
  loading = false,
  error,
}: PatientSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <User className="h-4 w-4 text-blue-600" />
        Select Patient
      </label>

      <Listbox value={selectedPatient} onChange={onPatientChange} disabled={loading}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full h-12 cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border-2 transition-colors ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-2`}
          >
            <span className="block truncate">
              {loading ? (
                <span className="flex items-center gap-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  Loading patients...
                </span>
              ) : selectedPatient ? (
                <span className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(selectedPatient.fullName)}
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

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                          {getInitials(patient.fullName)}
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

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
