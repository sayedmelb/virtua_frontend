import { describe, it, expect, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "../utils/test-utils"
import NewPrescriptionForm from "../../components/NewPrescriptionForm"

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Pill: () => <div data-testid="pill-icon" />,
  User: () => <div data-testid="user-icon" />,
  Stethoscope: () => <div data-testid="stethoscope-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  Check: () => <div data-testid="check-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}))

// Mock Headless UI components properly
vi.mock("@headlessui/react", () => {
  const MockListbox = ({ children, value, onChange, disabled }: any) => {
    return <div data-testid="listbox">{children}</div>
  }

  const MockListboxButton = ({ children, className, ...props }: any) => (
    <button className={className} data-testid="listbox-button" {...props}>
      {children}
    </button>
  )

  const MockListboxOptions = ({ children }: any) => <div data-testid="listbox-options">{children}</div>

  const MockListboxOption = ({ children, value, ...props }: any) => (
    <div data-testid="listbox-option" {...props}>
      {typeof children === "function" ? children({ selected: false }) : children}
    </div>
  )

  const MockTransition = ({ children }: any) => <div>{children}</div>

  const MockFragment = ({ children }: any) => <>{children}</>

  // Assign sub-components to main component
  MockListbox.Button = MockListboxButton
  MockListbox.Options = MockListboxOptions
  MockListbox.Option = MockListboxOption

  return {
    Listbox: MockListbox,
    Transition: MockTransition,
    Fragment: MockFragment,
  }
})

describe("NewPrescriptionForm Component", () => {
  it("renders form header", () => {
    renderWithProviders(<NewPrescriptionForm />)

    // Look for the h2 element directly
    expect(screen.getByText("New Prescription")).toBeInTheDocument()
    expect(screen.getByText("Create a new prescription for your patient")).toBeInTheDocument()
  })

  it("displays form fields", async () => {
    renderWithProviders(<NewPrescriptionForm />)

    await waitFor(() => {
      expect(screen.getByText("Select Patient")).toBeInTheDocument()
      expect(screen.getByText("Medication Name")).toBeInTheDocument()
      expect(screen.getByText("Dosage & Instructions")).toBeInTheDocument()
    })
  })

  it("shows current date in prescription date section", () => {
    renderWithProviders(<NewPrescriptionForm />)

    expect(screen.getByText("Prescription Date")).toBeInTheDocument()
    // Check that some date is displayed (exact format may vary)
    expect(screen.getByText(/\d{4}/)).toBeInTheDocument() // Year should be present
  })

  it("displays validation errors for empty fields", async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewPrescriptionForm />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /create prescription/i })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole("button", { name: /create prescription/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Please select a patient")).toBeInTheDocument()
      expect(screen.getByText("Drug name is required")).toBeInTheDocument()
      expect(screen.getByText("Dosage is required")).toBeInTheDocument()
    })
  })

  it("allows filling out medication name and dosage fields", async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewPrescriptionForm />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter medication name/i)).toBeInTheDocument()
    })

    const drugNameInput = screen.getByPlaceholderText(/enter medication name/i)
    const dosageInput = screen.getByPlaceholderText(/enter dosage and instructions/i)

    await user.type(drugNameInput, "Aspirin")
    await user.type(dosageInput, "100mg daily")

    expect(drugNameInput).toHaveValue("Aspirin")
    expect(dosageInput).toHaveValue("100mg daily")
  })

  it("clears validation errors when fields are filled", async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewPrescriptionForm />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /create prescription/i })).toBeInTheDocument()
    })

    // First trigger validation errors
    const submitButton = screen.getByRole("button", { name: /create prescription/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Drug name is required")).toBeInTheDocument()
    })

    // Then fill the field
    const drugNameInput = screen.getByPlaceholderText(/enter medication name/i)
    await user.type(drugNameInput, "Aspirin")

    await waitFor(() => {
      expect(screen.queryByText("Drug name is required")).not.toBeInTheDocument()
    })
  })

  it("shows loading state when patients are being fetched", () => {
    renderWithProviders(<NewPrescriptionForm />)

    expect(screen.getByText("Loading patients...")).toBeInTheDocument()
  })
})
