import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Clients from '../page'
import { fetchCompanies, createCompany } from '../../../src/lib/api'

// Mock the API functions
jest.mock('@/lib/api', () => ({
  fetchCompanies: jest.fn(),
  createCompany: jest.fn(),
}))

const mockClients = [
  {
    id: 1,
    company_name: "Test Company",
    industry: "Technology",
    employee_count: 100,
    budget_estimate: 50000,
    country: "USA",
    company_needs: "Software",
    description: "Test description",
    contact_type: "CLIENT",
    created_at: "2024-02-12T00:00:00.000Z"
  }
]

describe('Clients Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    ;(fetchCompanies as jest.Mock).mockResolvedValue(mockClients)
  })

  it('renders clients list', async () => {
    render(<Clients />)
    
    // Wait for the clients to load
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument()
    })

    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('$50000')).toBeInTheDocument()
  })

  it('opens add client dialog when button is clicked', async () => {
    render(<Clients />)
    
    const addButton = screen.getByText('Add New Client')
    await userEvent.click(addButton)

    expect(screen.getByText('Add New Client')).toBeInTheDocument()
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument()
  })

  it('adds a new client', async () => {
    const newClient = {
      company_name: "New Company",
      industry: "Finance",
      employee_count: 50,
      budget_estimate: 100000,
      country: "UK",
      company_needs: "Investment",
      description: "New client description",
      contact_type: "CLIENT"
    }

    ;(createCompany as jest.Mock).mockResolvedValue({
      ...newClient,
      id: 2,
      created_at: "2024-02-12T00:00:00.000Z"
    })

    render(<Clients />)

    // Open dialog
    const addButton = screen.getByText('Add New Client')
    await userEvent.click(addButton)

    // Fill form
    await userEvent.type(screen.getByLabelText('Company Name'), newClient.company_name)
    await userEvent.type(screen.getByLabelText('Industry'), newClient.industry)
    await userEvent.type(screen.getByLabelText('Employees'), '50')
    await userEvent.type(screen.getByLabelText('Budget'), '100000')
    await userEvent.type(screen.getByLabelText('Country'), newClient.country)
    await userEvent.type(screen.getByLabelText('Needs'), newClient.company_needs)
    await userEvent.type(screen.getByLabelText('Description'), newClient.description)

    // Submit form
    const saveButton = screen.getByText('Save Client')
    await userEvent.click(saveButton)

    // Verify createCompany was called with correct data
    expect(createCompany).toHaveBeenCalledWith(newClient)

    // Verify new client appears in table
    await waitFor(() => {
      expect(screen.getByText('New Company')).toBeInTheDocument()
    })
  })

  it('handles errors when loading clients', async () => {
    ;(fetchCompanies as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))
    
    render(<Clients />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load clients')).toBeInTheDocument()
    })
  })
})