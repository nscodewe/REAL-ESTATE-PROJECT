import type { Lead, Property, Client, Deal, Task, UserRole } from './types';

type ApiErrorPayload = {
  error?: string;
  details?: string;
};

type ApiDataPayload<T> = {
  data?: T;
};

async function fetchFromApi<T>(
  path: string,
  init: RequestInit = {},
  fallbackErrorMessage: string
): Promise<T> {
  const response = await fetch(path, init);
  const payload = (await response.json().catch(() => ({}))) as ApiDataPayload<T> & ApiErrorPayload;

  if (!response.ok) {
    throw new Error(payload.details || payload.error || fallbackErrorMessage);
  }

  return (typeof payload === 'object' && payload !== null && 'data' in payload
    ? payload.data
    : payload) as T;
}

export const apiService = {
  // Leads with role-based filtering
  async getLeads(userRole?: UserRole, userId?: string): Promise<Lead[]> {
    const leads = await fetchFromApi<Lead[]>('/api/leads', {}, 'Failed to fetch leads');

    if (userRole === 'agent' && userId) {
      // Agents only see their assigned leads
      return leads.filter((lead) => lead.assignedTo === userId);
    }

    return leads;
  },

  async getLeadById(id: string): Promise<Lead | undefined> {
    const leads = await fetchFromApi<Lead[]>('/api/leads', {}, 'Failed to fetch leads');
    return leads.find((lead) => String(lead.id) === String(id));
  },

  async createLead(lead: Omit<Lead, 'id' | 'createdDate'>): Promise<Lead> {
    return fetchFromApi<Lead>(
      '/api/leads',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      },
      'Failed to create lead'
    );
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    return fetchFromApi<Lead>(
      `/api/leads/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      },
      'Failed to update lead'
    );
  },

  async deleteLead(id: string): Promise<void> {
    await fetchFromApi<{ success: boolean }>(`/api/leads/${id}`, { method: 'DELETE' }, 'Failed to delete lead');
  },

  // Properties
  async getProperties(): Promise<Property[]> {
    return fetchFromApi<Property[]>('/api/properties', {}, 'Failed to fetch properties');
  },

  async getPropertyById(id: string): Promise<Property | undefined> {
    const properties = await fetchFromApi<Property[]>('/api/properties', {}, 'Failed to fetch properties');
    return properties.find((property) => String(property.id) === String(id));
  },

  async createProperty(property: Omit<Property, 'id' | 'listedDate'>): Promise<Property> {
    return fetchFromApi<Property>(
      '/api/properties',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      },
      'Failed to create property'
    );
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    return fetchFromApi<Property>(
      `/api/properties/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      },
      'Failed to update property'
    );
  },

  async deleteProperty(id: string): Promise<void> {
    await fetchFromApi<{ success: boolean }>(
      `/api/properties/${id}`,
      { method: 'DELETE' },
      'Failed to delete property'
    );
  },

  // Clients
  async getClients(): Promise<Client[]> {
    return fetchFromApi<Client[]>('/api/clients', {}, 'Failed to fetch clients');
  },

  async getClientById(id: string): Promise<Client | undefined> {
    const clients = await fetchFromApi<Client[]>('/api/clients', {}, 'Failed to fetch clients');
    return clients.find((client) => String(client.id) === String(id));
  },

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    return fetchFromApi<Client>(
      '/api/clients',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      },
      'Failed to create client'
    );
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    return fetchFromApi<Client>(
      `/api/clients/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      },
      'Failed to update client'
    );
  },

  // Deals with role-based filtering
  async getDeals(userRole?: UserRole, userId?: string): Promise<Deal[]> {
    const deals = await fetchFromApi<Deal[]>('/api/deals', {}, 'Failed to fetch deals');

    if (userRole === 'agent' && userId) {
      // Agents only see their assigned deals
      return deals.filter((deal) => deal.assignedTo === userId);
    }

    return deals;
  },

  async getDealById(id: string): Promise<Deal | undefined> {
    const deals = await fetchFromApi<Deal[]>('/api/deals', {}, 'Failed to fetch deals');
    return deals.find((deal) => String(deal.id) === String(id));
  },

  async createDeal(deal: Omit<Deal, 'id' | 'createdDate'>): Promise<Deal> {
    return fetchFromApi<Deal>(
      '/api/deals',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deal),
      },
      'Failed to create deal'
    );
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    return fetchFromApi<Deal>(
      `/api/deals/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      },
      'Failed to update deal'
    );
  },

  async deleteDeal(id: string): Promise<void> {
    await fetchFromApi<{ success: boolean }>(`/api/deals/${id}`, { method: 'DELETE' }, 'Failed to delete deal');
  },

  // Tasks with role-based filtering
  async getTasks(userRole?: UserRole, userId?: string): Promise<Task[]> {
    const tasks = await fetchFromApi<Task[]>('/api/tasks', {}, 'Failed to fetch tasks');

    if (userRole === 'agent' && userId) {
      // Agents only see their assigned tasks
      return tasks.filter((task) => task.assignedTo === userId);
    }

    return tasks;
  },

  async getTaskById(id: string): Promise<Task | undefined> {
    const tasks = await fetchFromApi<Task[]>('/api/tasks', {}, 'Failed to fetch tasks');
    return tasks.find((task) => String(task.id) === String(id));
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    return fetchFromApi<Task>(
      '/api/tasks',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      },
      'Failed to create task'
    );
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return fetchFromApi<Task>(
      `/api/tasks/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      },
      'Failed to update task'
    );
  },

  async deleteTask(id: string): Promise<void> {
    await fetchFromApi<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' }, 'Failed to delete task');
  },


  // Dashboard metrics with role-based data
async getDashboardMetrics(userRole: UserRole, userId: string) {
  let leads = await fetchFromApi<Lead[]>('/api/leads', {}, 'Failed to fetch leads');
  let deals = await fetchFromApi<Deal[]>('/api/deals', {}, 'Failed to fetch deals');
  let tasks = await fetchFromApi<Task[]>('/api/tasks', {}, 'Failed to fetch tasks'); // ✅ FIXED

  if (userRole === 'agent') {
    leads = leads.filter((lead) => lead.assignedTo === userId);
    deals = deals.filter((deal) => deal.assignedTo === userId);
    tasks = tasks.filter((task) => task.assignedTo === userId);
  }

  const properties = await fetchFromApi<Property[]>('/api/properties', {}, 'Failed to fetch properties');

  return {
    totalLeads: leads.length,
    activeDeals: deals.filter((deal) => String(deal.stage).toLowerCase() !== 'closed').length,
    properties: properties.length,
    revenue: deals
      .filter((deal) => String(deal.stage).toLowerCase() === 'closed')
      .reduce((sum, deal) => sum + Number(deal.commission || 0), 0),
    conversionRate:
      leads.length > 0
        ? Math.round(
            (leads.filter((lead) => String(lead.status).toLowerCase() === 'closed').length / leads.length) * 100
          )
        : 0,
    teamMembers: userRole === 'manager' ? 12 : 1,
    pendingTasks: tasks.filter((task) => task.status !== 'completed').length,
  };
}
};
