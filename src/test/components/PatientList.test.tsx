import { describe, it, expect, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "../utils/test-utils"
import PatientList from "../../components/PatientList"

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Users: () => <div data-testid="users-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  MoreVertical: () => <div data-testid="more-vertical-icon" />,
}))

describe("PatientList Component", () => {
  it("renders patient list header", () => {
    renderWithProviders(<PatientList />)

    expect(screen.getByText("Patients")).toBeInTheDocument()
    expect(screen.getByText("View All")).toBeInTheDocument()
  })

  it("displays patients after loading", async () => {
    renderWithProviders(<PatientList />)

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument()
      expect(screen.getByText("Bob Jones")).toBeInTheDocument()
      expect(screen.getByText("Carlos Mendes")).toBeInTheDocument()
    })
  })

  it("shows patient count in header", async () => {
    renderWithProviders(<PatientList />)

    await waitFor(() => {
      expect(screen.getByText("3 registered patients")).toBeInTheDocument()
    })
  })

  it("displays patient birth dates", async () => {
    renderWithProviders(<PatientList />)

    await waitFor(() => {
      // Check for the actual date format that appears in the component
      expect(screen.getByText(/Born.*10\/4\/1985/)).toBeInTheDocument()
      expect(screen.getByText(/Born.*22\/9\/1978/)).toBeInTheDocument()
      expect(screen.getByText(/Born.*15\/1\/1990/)).toBeInTheDocument()
    })
  })

  it("shows active status for all patients", async () => {
    renderWithProviders(<PatientList />)

    await waitFor(() => {
      const activeStatuses = screen.getAllByText("Active")
      expect(activeStatuses).toHaveLength(3)
    })
  })

  it("displays patient initials in avatars", async () => {
    renderWithProviders(<PatientList />)

    await waitFor(() => {
      expect(screen.getByText("AS")).toBeInTheDocument() // Alice Smith
      expect(screen.getByText("BJ")).toBeInTheDocument() // Bob Jones
      expect(screen.getByText("CM")).toBeInTheDocument() // Carlos Mendes
    })
  })
})
