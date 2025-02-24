const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`;

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  is_superuser: boolean;
  username: string;
}

interface Lead {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
}

interface CreateEmployeeData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  department?: string;
  position?: string;
  phone?: string;
  salary: number;
  is_active: boolean;
}

export const API = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/api/employee/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('is_superuser', String(data.is_superuser));
        localStorage.setItem('username', data.username);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getEmployees: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${BASE_URL}/api/employee/employees/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    return response.json();
  },

  createEmployee: async (employeeData: CreateEmployeeData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    try {
      // Debug logging
      console.log('Creating employee with data:', {
        ...employeeData,
        password: '[REDACTED]'
      });

      const response = await fetch(`${BASE_URL}/api/employee/employees/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...employeeData,
          salary: Number(employeeData.salary) || 0,
          is_active: Boolean(employeeData.is_active)
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(
          data.errors 
            ? Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join(', ')
            : data.message || 'Failed to create employee'
        );
      }

      return data;
    } catch (error) {
      console.error('Create employee error:', error);
      throw error;
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/api/employee/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getLeads: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${BASE_URL}/api/leads/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  createLead: async (leadData: Lead) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${BASE_URL}/api/leads/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create lead');
    }

    return response.json();
  },

  assignLead: async (leadId: number, employeeId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${BASE_URL}/api/leads/${leadId}/assign/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ employee_id: employeeId }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign lead');
    }

    return response.json();
  },

  rescoreLead: async (leadId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${BASE_URL}/api/leads/${leadId}/score/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to score lead');
    }

    return response.json();
  },
};
