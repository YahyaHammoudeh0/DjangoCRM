const API_BASE_URL = 'http://localhost:8000/api';

export interface CompanyInfo {
  id?: number;
  company_name: string;
  industry: string;
  employee_count: number;
  budget_estimate: number;
  country: string;
  company_needs: string;
  description: string;
  contact_type: 'LEAD' | 'CLIENT';
  expected_score?: number;
  created_at?: string;
  updated_at?: string;
}

export async function fetchCompanies(type: 'LEAD' | 'CLIENT') {
  const response = await fetch(`${API_BASE_URL}/companies/?contact_type=${type}`);
  if (!response.ok) throw new Error('Failed to fetch companies');
  return response.json();
}

export async function createCompany(data: CompanyInfo) {
  const response = await fetch(`${API_BASE_URL}/companies/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create company');
  return response.json();
}
