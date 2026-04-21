import type { Lead, Property, Client, Deal, Task, UserRole } from './types';
import {
  dummyLeads,
  dummyProperties,
  dummyClients,
  dummyDeals,
  dummyTasks,
} from './dummy-data';

// Simulate API delays
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Leads with role-based filtering
  async getLeads(userRole?: UserRole, userId?: string): Promise<Lead[]> {
    await delay();
    if (userRole === 'agent' && userId) {
      // Agents only see their assigned leads
      return dummyLeads.filter(l => l.assignedAgent === userId);
    }
    return dummyLeads;
  },

  async getLeadById(id: string): Promise<Lead | undefined> {
    await delay();
    return dummyLeads.find(l => l.id === id);
  },

  async createLead(lead: Omit<Lead, 'id' | 'createdDate'>): Promise<Lead> {
    await delay();
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    dummyLeads.push(newLead);
    return newLead;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    await delay();
    const index = dummyLeads.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    dummyLeads[index] = { ...dummyLeads[index], ...updates };
    return dummyLeads[index];
  },

  async deleteLead(id: string): Promise<void> {
    await delay();
    const index = dummyLeads.findIndex(l => l.id === id);
    if (index !== -1) {
      dummyLeads.splice(index, 1);
    }
  },

  // Properties
  async getProperties(): Promise<Property[]> {
    await delay();
    return dummyProperties;
  },

  async getPropertyById(id: string): Promise<Property | undefined> {
    await delay();
    return dummyProperties.find(p => p.id === id);
  },

  async createProperty(property: Omit<Property, 'id' | 'listedDate'>): Promise<Property> {
    await delay();
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      listedDate: new Date().toISOString().split('T')[0],
    };
    dummyProperties.push(newProperty);
    return newProperty;
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    await delay();
    const index = dummyProperties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    dummyProperties[index] = { ...dummyProperties[index], ...updates };
    return dummyProperties[index];
  },

  async deleteProperty(id: string): Promise<void> {
    await delay();
    const index = dummyProperties.findIndex(p => p.id === id);
    if (index !== -1) {
      dummyProperties.splice(index, 1);
    }
  },

  // Clients
  async getClients(): Promise<Client[]> {
    await delay();
    return dummyClients;
  },

  async getClientById(id: string): Promise<Client | undefined> {
    await delay();
    return dummyClients.find(c => c.id === id);
  },

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    await delay();
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
    };
    dummyClients.push(newClient);
    return newClient;
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    await delay();
    const index = dummyClients.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Client not found');
    dummyClients[index] = { ...dummyClients[index], ...updates };
    return dummyClients[index];
  },

  // Deals with role-based filtering
  async getDeals(userRole?: UserRole, userId?: string): Promise<Deal[]> {
    await delay();
    if (userRole === 'agent' && userId) {
      // Agents only see their assigned deals
      return dummyDeals.filter(d => d.agent === userId);
    }
    return dummyDeals;
  },

  async getDealById(id: string): Promise<Deal | undefined> {
    await delay();
    return dummyDeals.find(d => d.id === id);
  },

  async createDeal(deal: Omit<Deal, 'id' | 'createdDate'>): Promise<Deal> {
    await delay();
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    dummyDeals.push(newDeal);
    return newDeal;
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    await delay();
    const index = dummyDeals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    dummyDeals[index] = { ...dummyDeals[index], ...updates };
    return dummyDeals[index];
  },

  async deleteDeal(id: string): Promise<void> {
    await delay();
    const index = dummyDeals.findIndex(d => d.id === id);
    if (index !== -1) {
      dummyDeals.splice(index, 1);
    }
  },

  // Tasks with role-based filtering
  async getTasks(userRole?: UserRole, userId?: string): Promise<Task[]> {
    await delay();
    if (userRole === 'agent' && userId) {
      // Agents only see their assigned tasks
      return dummyTasks.filter(t => t.assignedTo === userId);
    }
    return dummyTasks;
  },

  async getTaskById(id: string): Promise<Task | undefined> {
    await delay();
    return dummyTasks.find(t => t.id === id);
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    await delay();
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    };
    dummyTasks.push(newTask);
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay();
    const index = dummyTasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    dummyTasks[index] = { ...dummyTasks[index], ...updates };
    return dummyTasks[index];
  },

  async deleteTask(id: string): Promise<void> {
    await delay();
    const index = dummyTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      dummyTasks.splice(index, 1);
    }
  },

  // Dashboard metrics with role-based data
  async getDashboardMetrics(userRole: UserRole, userId: string) {
    await delay();
    let leads = dummyLeads;
    let deals = dummyDeals;
    let tasks = dummyTasks;

    if (userRole === 'agent') {
      leads = dummyLeads.filter(l => l.assignedAgent === userId);
      deals = dummyDeals.filter(d => d.agent === userId);
      tasks = dummyTasks.filter(t => t.assignedTo === userId);
    }

    return {
      totalLeads: leads.length,
      activeDeals: deals.filter(d => d.stage !== 'closed').length,
      properties: dummyProperties.filter(p => p.status === 'available').length,
      revenue: deals.filter(d => d.stage === 'closed').reduce((sum, d) => sum + d.commission, 0),
      conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'closed').length / leads.length) * 100) : 0,
      teamMembers: userRole === 'manager' ? 12 : 1,
      pendingTasks: tasks.filter(t => t.status !== 'completed').length,
    };
  },
};
