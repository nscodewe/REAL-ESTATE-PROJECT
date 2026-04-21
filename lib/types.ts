export type UserRole = 'admin' | 'agent' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  department?: string;
  joinDate: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  source: 'website' | 'referral' | 'phone' | 'email' | 'social' | 'event';
  assignedTo: string | null;
  property?: string;
  budget?: number;
  notes: string;
  createdDate: string;
  lastContact?: string;
  activities: LeadActivity[];
}

export interface LeadActivity {
  id: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  status: 'available' | 'sold' | 'rented' | 'pending';
  image?: string;
  features: string[];
  listedDate: string;
  agent: string;
}

export interface Client {
  id: string;
  leadId: string;
  name: string;
  email: string;
  phone: string;
  assignedTo: string | null;
  type: 'buyer' | 'seller' | 'investor' | 'renter';
  preferredProperties?: string[];
  viewedProperties: string[];
  preferredLocations: string[];
  budget?: number;
  interactions: Interaction[];
  linkedDeals: string[];
  communicationPreferences: {
    email: boolean;
    phone: boolean;
    text: boolean;
  };
}

export interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  date: string;
  duration?: number;
  notes: string;
  agent: string;
}

export interface Deal {
  id: string;
  leadId: string;
  clientId: string;
  propertyId: string;
  assignedTo: string | null;
  title: string;
  clientName: string;
  propertyAddress: string;
  value: number;
  commission: number;
  stage: 'negotiation' | 'agreement' | 'closed';
  createdDate: string;
  expectedCloseDate?: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo: string;
  createdBy: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  activeDeals: number;
  properties: number;
  revenue: number;
  conversionRate: number;
  teamMembers?: number;
  pendingTasks?: number;
}
