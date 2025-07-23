

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchPrescriptions } from "../store/prescriptionsSlice"
import { FileText, Search, Filter, Calendar, Pill, User } from "lucide-react"

export default function PrescriptionHistory() {
  const dispatch = useAppDispatch()
  const list = useAppSelector((s) => s.prescriptions)
  const patients = useAppSelector((s) => s.patients)
  const [filter, setFilter] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "drug">("date")

  useEffect(() => void dispatch(fetchPrescriptions()), [dispatch])

  const filtered = list
    .filter((p) => p.drugName.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) =>
      sortBy === "date"
        ? new Date(b.datePrescribed).getTime() - new Date(a.datePrescribed).getTime()
        : a.drugName.localeCompare(b.drugName),
    )

  const getPatientName = (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient?.fullName || "Unknown Patient"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Prescription History</h3>
              <p className="text-sm text-gray-500">{filtered.length} prescriptions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by drug name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="drug">Sort by Drug</option>
            </select>
          </div>
        </div>

        {/* Prescription List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filtered.map((prescription) => (
            <div key={prescription.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{prescription.drugName}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {prescription.dosage}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{getPatientName(prescription.patientId)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(prescription.datePrescribed).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        )}
      </div>
    </div>
  )
}
