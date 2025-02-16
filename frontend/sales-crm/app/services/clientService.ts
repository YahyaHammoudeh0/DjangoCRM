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

export const getClients = async (): Promise<Client[]> => {
    const response = await fetch(`${API_URL}/customers/`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    if (!response.ok) throw new Error('Failed to fetch clients')
    return response.json()
}

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
    const response = await fetch(`${API_URL}/customers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
    })
    if (!response.ok) throw new Error('Failed to create client')
    return response.json()
}

export const convertLeadToClient = async (leadId: number): Promise<Client> => {
    const response = await fetch(`${API_URL}/leads/convert/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId })
    })
    if (!response.ok) throw new Error('Failed to convert lead')
    return response.json()
}
