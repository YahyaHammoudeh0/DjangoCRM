const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface Client {
    id?: number
    company_name: string
    industry: string
    country: string
    contact_person: string
    email: string
    phone: string
    address?: string
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
    };
};

export const getClients = async (): Promise<Client[]> => {
    const response = await fetch(`${API_URL}/customers/`, {
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch clients');
    }
    return response.json();
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
    const response = await fetch(`${API_URL}/customers/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(client)
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        throw new Error('Failed to create client');
    }
    return response.json();
};

export const convertLeadToClient = async (leadId: number): Promise<Client> => {
    const response = await fetch(`${API_URL}/leads/convert/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ lead_id: leadId })
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        throw new Error('Failed to convert lead');
    }
    return response.json();
};