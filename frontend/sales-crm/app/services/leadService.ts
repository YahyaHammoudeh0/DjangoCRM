const API_BASE_URL = 'http://localhost:8000/api';

export interface Lead {
    id?: number;
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
}

export const getLeads = async (): Promise<Lead[]> => {
    const response = await fetch(`${API_BASE_URL}/leads/`);
    return response.json();
};

export const createLead = async (lead: Omit<Lead, 'id' | 'score' | 'created_at'>): Promise<Lead> => {
    const response = await fetch(`${API_BASE_URL}/leads/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
    });
    return response.json();
};

export const rescoreLead = async (leadId: number): Promise<{ score: number }> => {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/score/`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to score lead');
    }
    return response.json();
};
