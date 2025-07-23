import { describe, it, expect, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "./utils/test-utils"
import App from "../App"

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Activity: () => <div data-testid="activity-icon" />,
  Users: () => <div data-testid="users-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  MoreVertical: () => <div data-testid="more-vertical-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Pill: () => <div data-testid="pill-icon" />,
  User: () => <div data-testid="user-icon" />,
  Stethoscope: () => <div data-testid="stethoscope-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  Check: () => <div data-testid="check-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}))

describe("App Component", () => {
  it("renders the main dashboard by default", async () => {
    renderWithProviders(<App />)

    expect(screen.getByText("Vitura")).toBeInTheDocument()
    // Use more specific selector for the header Dashboard text
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument()
    expect(screen.getByText("Manage your patients and prescriptions")).toBeInTheDocument()
    expect(screen.getByText("Online")).toBeInTheDocument()
  })

  it("displays dashboard statistics cards", async () => {
    renderWithProviders(<App />)

    expect(screen.getByText("Total Patients")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("Active Prescriptions")).toBeInTheDocument()
    expect(screen.getByText("21")).toBeInTheDocument()
    expect(screen.getByText("This Month")).toBeInTheDocument()
    expect(screen.getByText("8")).toBeInTheDocument()
  })

  it("shows navigation items in sidebar", () => {
    renderWithProviders(<App />)

    expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /patients/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /prescriptions/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /new prescription/i })).toBeInTheDocument()
  })

  it("displays doctor profile information", () => {
    renderWithProviders(<App />)

    expect(screen.getByText("Dr. Smith")).toBeInTheDocument()
    expect(screen.getByText("General Practitioner")).toBeInTheDocument()
  })

  it("switches to patients view when patients nav is clicked", async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)

    const patientsButton = screen.getByRole("button", { name: /patients/i })
    await user.click(patientsButton)

    await waitFor(() => {
      // Look for the main page heading (h2) specifically, not the component heading (h3)
      expect(screen.getByRole("heading", { level: 2, name: "Patients" })).toBeInTheDocument()
    })
  })

  it("switches to prescriptions view when prescriptions nav is clicked", async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)

    const prescriptionsButton = screen.getByRole("button", { name: /prescriptions/i })
    await user.click(prescriptionsButton)

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2, name: "Prescriptions" })).toBeInTheDocument()
    })
  })

})
