import type { Lead, Property, Client, Deal, Task } from './types';

export const dummyUsers = {
  admin: {
    id: 'admin-1',
    name: 'Sarah Johnson',
    email: 'admin@crm.com',
    role: 'admin',
    phone: '(555) 123-4567',
    department: 'Management',
    joinDate: '2023-01-15',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  agent: {
    id: 'agent-1',
    name: 'John Smith',
    email: 'john@crm.com',
    role: 'agent',
    phone: '(555) 234-5678',
    department: 'Sales',
    joinDate: '2023-06-20',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  manager: {
    id: 'manager-1',
    name: 'Emma Davis',
    email: 'emma@crm.com',
    role: 'manager',
    phone: '(555) 345-6789',
    department: 'Operations',
    joinDate: '2023-03-10',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  }
};

export const dummyLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 456-7890',
    status: 'qualified',
    source: 'website',
    assignedTo: 'agent-1',
    budget: 450000,
    notes: 'Looking for 3BR home in downtown area',
    createdDate: '2024-03-01',
    lastContact: '2024-04-15',
    activities: [
      {
        id: 'lead-1-act-1',
        message: 'Called client',
        createdAt: '2024-04-15T10:00:00.000Z',
        createdBy: 'agent-1',
      },
    ]
  },
  {
    id: 'lead-2',
    name: 'Jessica Martinez',
    email: 'j.martinez@email.com',
    phone: '(555) 567-8901',
    status: 'proposal',
    source: 'referral',
    assignedTo: 'agent-1',
    budget: 650000,
    notes: 'Investor looking for multi-unit properties',
    createdDate: '2024-02-20',
    lastContact: '2024-04-16',
    activities: []
  },
  {
    id: 'lead-3',
    name: 'Robert Wilson',
    email: 'r.wilson@email.com',
    phone: '(555) 678-9012',
    status: 'contacted',
    source: 'phone',
    budget: 350000,
    notes: 'First-time homebuyer, needs financing help',
    createdDate: '2024-04-10',
    assignedTo: null,
    lastContact: '2024-04-17',
    activities: []
  },
  {
    id: 'lead-4',
    name: 'Amanda Foster',
    email: 'a.foster@email.com',
    phone: '(555) 789-0123',
    status: 'new',
    source: 'social',
    budget: 800000,
    notes: 'Luxury market interested',
    assignedTo: null,
    createdDate: '2024-04-18',
    activities: []
  },
  {
    id: 'lead-5',
    name: 'David Brown',
    email: 'd.brown@email.com',
    phone: '(555) 890-1234',
    status: 'closed',
    source: 'email',
    assignedTo: 'agent-1',
    budget: 550000,
    notes: 'Successfully closed on Maple St property',
    createdDate: '2024-01-15',
    lastContact: '2024-04-16',
    activities: []
  }
];

export const dummyProperties: Property[] = [
  {
    id: 'prop-1',
    address: '123 Maple Street',
    city: 'Portland',
    state: 'OR',
    zipCode: '97204',
    price: 495000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2100,
    type: 'house',
    status: 'available',
    features: ['Pool', 'Garage', 'Garden', 'Hardwood Floors'],
    listedDate: '2024-03-01',
    agent: 'agent-1',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop'
  },
  {
    id: 'prop-2',
    address: '456 Oak Avenue',
    city: 'Portland',
    state: 'OR',
    zipCode: '97205',
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    type: 'house',
    status: 'pending',
    features: ['Luxury Kitchen', 'Master Suite', 'Theater Room', 'Smart Home'],
    listedDate: '2024-02-15',
    agent: 'agent-1',
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=300&fit=crop'
  },
  {
    id: 'prop-3',
    address: '789 Pine Road',
    city: 'Portland',
    state: 'OR',
    zipCode: '97206',
    price: 385000,
    bedrooms: 2,
    bathrooms: 1.5,
    sqft: 1450,
    type: 'condo',
    status: 'available',
    features: ['Balcony', 'Fitness Center', 'Parking', 'Modern'],
    listedDate: '2024-04-01',
    agent: 'agent-1',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'
  },
  {
    id: 'prop-4',
    address: '321 Elm Court',
    city: 'Portland',
    state: 'OR',
    zipCode: '97207',
    price: 1200000,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    type: 'house',
    status: 'sold',
    features: ['Estate', 'Wine Cellar', 'Guest House', 'Waterfront'],
    listedDate: '2024-01-20',
    agent: 'agent-1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop'
  },
  {
    id: 'prop-5',
    address: '555 Birch Lane',
    city: 'Portland',
    state: 'OR',
    zipCode: '97208',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    type: 'house',
    status: 'available',
    features: ['Renovated', 'Energy Efficient', 'Large Yard', 'New Roof'],
    listedDate: '2024-03-20',
    agent: 'agent-1',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop'
  }
];

export const dummyClients: Client[] = [
  {
    id: 'client-1',
    leadId: 'lead-1',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 456-7890',
    assignedTo: 'agent-1',
    type: 'buyer',
    preferredProperties: ['prop-1', 'prop-2'],
    viewedProperties: ['prop-1'],
    preferredLocations: ['Downtown', 'Pearl District'],
    budget: 450000,
    linkedDeals: ['deal-1'],
    communicationPreferences: { email: true, phone: true, text: false },
    interactions: [
      {
        id: 'int-1',
        type: 'call',
        date: '2024-04-15',
        duration: 30,
        notes: 'Discussed property details and financing options',
        agent: 'agent-1'
      },
      {
        id: 'int-2',
        type: 'email',
        date: '2024-04-16',
        notes: 'Sent property comparison document',
        agent: 'agent-1'
      }
    ]
  },
  {
    id: 'client-2',
    leadId: 'lead-2',
    name: 'Jessica Martinez',
    email: 'j.martinez@email.com',
    phone: '(555) 567-8901',
    assignedTo: 'agent-1',
    type: 'investor',
    preferredProperties: ['prop-3', 'prop-4'],
    viewedProperties: ['prop-3'],
    preferredLocations: ['Inner SE', 'Lloyd District'],
    budget: 750000,
    linkedDeals: ['deal-2'],
    communicationPreferences: { email: true, phone: false, text: true },
    interactions: []
  }
];

export const dummyDeals: Deal[] = [
  {
    id: 'deal-1',
    leadId: 'lead-1',
    clientId: 'client-1',
    propertyId: 'prop-1',
    assignedTo: 'agent-1',
    title: 'Chen - Maple Street Property',
    clientName: 'Michael Chen',
    propertyAddress: '123 Maple Street',
    value: 495000,
    commission: 14850,
    stage: 'negotiation',
    createdDate: '2024-03-15',
    expectedCloseDate: '2024-05-15',
    notes: 'Waiting for appraisal results'
  },
  {
    id: 'deal-2',
    leadId: 'lead-2',
    clientId: 'client-2',
    propertyId: 'prop-2',
    assignedTo: 'agent-1',
    title: 'Martinez - Multi-unit Investment',
    clientName: 'Jessica Martinez',
    propertyAddress: '456 Oak Avenue',
    value: 750000,
    commission: 22500,
    stage: 'agreement',
    createdDate: '2024-02-20',
    expectedCloseDate: '2024-05-20',
    notes: 'Final walkthrough scheduled'
  },
  {
    id: 'deal-3',
    leadId: 'lead-3',
    clientId: 'client-1',
    propertyId: 'prop-3',
    assignedTo: 'agent-1',
    title: 'Wilson - First-time Buyer',
    clientName: 'Robert Wilson',
    propertyAddress: '789 Pine Road',
    value: 385000,
    commission: 11550,
    stage: 'negotiation',
    createdDate: '2024-04-10',
    expectedCloseDate: '2024-06-10',
    notes: 'Arranging financing consultation'
  }
];

export const dummyTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Follow up with Michael Chen',
    description: 'Call regarding inspection results',
    dueDate: '2024-04-20',
    priority: 'high',
    status: 'todo',
    assignedTo: 'agent-1',
    createdBy: 'manager-1'
  },
  {
    id: 'task-2',
    title: 'Prepare market analysis',
    description: 'For Pearl District neighborhoods',
    dueDate: '2024-04-22',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'agent-1',
    createdBy: 'manager-1'
  },
  {
    id: 'task-3',
    title: 'List new property photos',
    description: 'Upload images for 789 Pine Road',
    dueDate: '2024-04-18',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'agent-1',
    createdBy: 'admin-1'
  }
];
