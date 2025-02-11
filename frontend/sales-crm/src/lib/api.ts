interface Company {
  id?: number;
  company_name: string;
  industry: string;
  employee_count: number;
  budget_estimate: number;
  country: string;
  company_needs: string;
  description: string;
  contact_type: string;
  created_at?: string;
}

export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await fetch('/api/companies')
  if (!response.ok) {
    throw new Error('Failed to fetch companies')
  }
  return response.json()
}

export const createCompany = async (company: Omit<Company, 'id' | 'created_at'>): Promise<Company> => {
  const response = await fetch('/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })
  if (!response.ok) {
    throw new Error('Failed to create company')
  }
  return response.json()
}
