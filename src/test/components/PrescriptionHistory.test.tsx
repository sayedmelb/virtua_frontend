import { describe, it, expect, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "../utils/test-utils"
import PrescriptionHistory from "../../components/PrescriptionHistory"

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  FileText: () => <div data-testid="file-text-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Pill: () => <div data-testid="pill-icon" />,
  User: () => <div data-testid="user-icon" />,
}))

describe("PrescriptionHistory Component", () => {
  it("renders prescription history header", () => {
    renderWithProviders(<PrescriptionHistory />)

    expect(screen.getByText("Prescription History")).toBeInTheDocument()
  })

  it("displays prescriptions after loading", async () => {
    renderWithProviders(<PrescriptionHistory />)

    await waitFor(() => {
      expect(screen.getByText("Amoxicillin")).toBeInTheDocument()
      expect(screen.getByText("Ibuprofen")).toBeInTheDocument()
    })
  })

  it("shows prescription count in header", async () => {
    renderWithProviders(<PrescriptionHistory />)

    await waitFor(() => {
      expect(screen.getByText("2 prescriptions")).toBeInTheDocument()
    })
  })

  it("displays prescription dosages", async () => {
    renderWithProviders(<PrescriptionHistory />)

    await waitFor(() => {
      expect(screen.getByText("500mg")).toBeInTheDocument()
      expect(screen.getByText("200mg")).toBeInTheDocument()
    })
  })

  it("shows prescription dates", async () => {
    renderWithProviders(<PrescriptionHistory />)

    await waitFor(() => {
      // Check for the actual date format that appears in the component
      expect(screen.getByText("1/12/2024")).toBeInTheDocument()
      expect(screen.getByText("3/12/2024")).toBeInTheDocument()
    })
  })

  it("filters prescriptions by drug name", async () => {
    const user = userEvent.setup()
    renderWithProviders(<PrescriptionHistory />)

    await waitFor(() => {
      expect(screen.getByText("Amoxicillin")).toBeInTheDocument()
      expect(screen.getByText("Ibuprofen")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText("Search by drug name...")
    await user.type(searchInput, "Amoxicillin")

    await waitFor(() => {
      expect(screen.getByText("Amoxicillin")).toBeInTheDocument()
      expect(screen.queryByText("Ibuprofen")).not.toBeInTheDocument()
    })
  })

  it("sorts prescriptions by date and drug name", async () => {
    const user = userEvent.setup()
    renderWithProviders(<PrescriptionHistory />)

    await waitFor(() => {
      expect(screen.getByText("Amoxicillin")).toBeInTheDocument()
    })

    const sortSelect = screen.getByDisplayValue("Sort by Date")
    await user.selectOptions(sortSelect, "drug")

    expect(sortSelect).toHaveValue("drug")
  })

  it('shows "No prescriptions found" when filter returns no results', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PrescriptionHistory />)

    await waitFor(() => {
      expect(screen.getByText("Amoxicillin")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText("Search by drug name...")
    await user.type(searchInput, "NonexistentDrug")

    await waitFor(() => {
      expect(screen.getByText("No prescriptions found")).toBeInTheDocument()
    })
  })
})
