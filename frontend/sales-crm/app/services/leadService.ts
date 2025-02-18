const API_BASE_URL = 'http://localhost:8000/api';

export interface Employee {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

export interface Lead {
    id: number;
    company_name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    industry: string;
    employee_count: number;
    budget_estimate: number;
    country: string;
    description: string;
    created_at: string;
    score: number;
    assigned_to?: Employee;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
    };
};

export const getLeads = async (): Promise<Lead[]> => {
    const response = await fetch(`${API_BASE_URL}/leads/`, {
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch leads');
    }
    return response.json();
};

export const createLead = async (lead: Omit<Lead, 'id' | 'score' | 'created_at'>): Promise<Lead> => {
    const response = await fetch(`${API_BASE_URL}/leads/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(lead),
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        throw new Error('Failed to create lead');
    }
    return response.json();
};

export const rescoreLead = async (leadId: number): Promise<{ score: number }> => {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/score/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        throw new Error('Failed to score lead');
    }
    return response.json();
};

export const assignLead = async (leadId: number, employeeId: number): Promise<Lead> => {
    console.log('Assigning lead:', { leadId, employeeId }); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/assign/`, {  // Remove extra 'api' from URL
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ employee_id: employeeId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Assignment failed:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
        }); // Enhanced debug log
        throw new Error(`Failed to assign lead: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Assignment successful:', data); // Debug log
    return data;
};