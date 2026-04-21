'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { dummyClients, dummyDeals, dummyLeads, dummyProperties, dummyUsers } from '@/lib/dummy-data';
import type { Client, Deal, Lead, Property, User, UserRole } from '@/lib/types';

type CreateLeadInput = {
  name: string;
  email: string;
  phone: string;
  budget?: number;
};

type CrmContextType = {
  leads: Lead[];
  clients: Client[];
  properties: Property[];
  deals: Deal[];
  agents: User[];
  createLead: (input: CreateLeadInput) => Lead;
  assignLead: (leadId: string, agentId: string, actorId: string) => void;
  markLeadContacted: (leadId: string, actorId: string) => void;
  addLeadActivity: (leadId: string, message: string, actorId: string) => void;
  convertLeadToClient: (leadId: string) => Client | null;
  markPropertyViewed: (clientId: string, propertyId: string) => void;
  convertClientToDeal: (clientId: string, propertyId: string, value: number) => Deal | null;
  updateDealStage: (dealId: string, stage: Deal['stage']) => void;
  closeDeal: (dealId: string) => void;
  getVisibleLeads: (role: UserRole, userId: string) => Lead[];
  getVisibleClients: (role: UserRole, userId: string) => Client[];
  getVisibleDeals: (role: UserRole, userId: string) => Deal[];
  getDashboardMetrics: (role: UserRole, userId: string) => {
    totalLeads: number;
    activeDeals: number;
    properties: number;
    revenue: number;
    conversionRate: number;
    teamMembers: number;
    pendingTasks: number;
  };
};

const CrmContext = createContext<CrmContextType | undefined>(undefined);

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(dummyLeads);
  const [clients, setClients] = useState<Client[]>(dummyClients);
  const [properties] = useState<Property[]>(dummyProperties);
  const [deals, setDeals] = useState<Deal[]>(dummyDeals);

  const agents = useMemo(
    () => Object.values(dummyUsers).filter((user) => user.role === 'agent') as User[],
    []
  );

  // Creates an inbound website lead with default status and empty activity trail.
  const createLead = (input: CreateLeadInput) => {
    const lead: Lead = {
      id: createId('lead'),
      name: input.name,
      email: input.email,
      phone: input.phone,
      budget: input.budget,
      status: 'new',
      source: 'website',
      assignedTo: null,
      notes: 'Captured from website form',
      createdDate: new Date().toISOString().slice(0, 10),
      activities: [],
    };

    setLeads((prev) => [lead, ...prev]);
    return lead;
  };

  // Assigning a lead updates assignee and moves pipeline status to contacted.
  const assignLead = (leadId: string, agentId: string, actorId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              assignedTo: agentId,
              status: 'contacted',
              lastContact: new Date().toISOString().slice(0, 10),
              activities: [
                ...lead.activities,
                {
                  id: createId('activity'),
                  message: `Lead assigned to ${agentId}`,
                  createdAt: new Date().toISOString(),
                  createdBy: actorId,
                },
              ],
            }
          : lead
      )
    );
  };

  // Contact events are persisted in activity log for timeline visibility.
  const markLeadContacted = (leadId: string, actorId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: 'contacted',
              lastContact: new Date().toISOString().slice(0, 10),
              activities: [
                ...lead.activities,
                {
                  id: createId('activity'),
                  message: 'Called client',
                  createdAt: new Date().toISOString(),
                  createdBy: actorId,
                },
              ],
            }
          : lead
      )
    );
  };

  const addLeadActivity = (leadId: string, message: string, actorId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              activities: [
                ...lead.activities,
                {
                  id: createId('activity'),
                  message,
                  createdAt: new Date().toISOString(),
                  createdBy: actorId,
                },
              ],
            }
          : lead
      )
    );
  };

  // Converts lead to client only once and preserves assignment chain.
  const convertLeadToClient = (leadId: string) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) {
      return null;
    }

    const existingClient = clients.find((client) => client.leadId === leadId);
    if (existingClient) {
      return existingClient;
    }

    const client: Client = {
      id: createId('client'),
      leadId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      assignedTo: lead.assignedTo,
      type: 'buyer',
      preferredProperties: [],
      viewedProperties: [],
      preferredLocations: [],
      budget: lead.budget,
      interactions: [],
      linkedDeals: [],
      communicationPreferences: {
        email: true,
        phone: true,
        text: false,
      },
    };

    setClients((prev) => [client, ...prev]);
    setLeads((prev) =>
      prev.map((item) => (item.id === leadId ? { ...item, status: 'qualified' } : item))
    );

    return client;
  };

  const markPropertyViewed = (clientId: string, propertyId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) {
          return client;
        }

        if (client.viewedProperties.includes(propertyId)) {
          return client;
        }

        return {
          ...client,
          viewedProperties: [...client.viewedProperties, propertyId],
        };
      })
    );
  };

  // Deal conversion links back to lead/client/property for traceability.
  const convertClientToDeal = (clientId: string, propertyId: string, value: number) => {
    const client = clients.find((item) => item.id === clientId);
    const property = properties.find((item) => item.id === propertyId);
    if (!client || !property) {
      return null;
    }

    const existingDeal = deals.find(
      (deal) => deal.clientId === clientId && deal.propertyId === propertyId
    );
    if (existingDeal) {
      return existingDeal;
    }

    const deal: Deal = {
      id: createId('deal'),
      leadId: client.leadId,
      clientId,
      propertyId,
      assignedTo: client.assignedTo,
      title: `${client.name} - ${property.address}`,
      clientName: client.name,
      propertyAddress: property.address,
      value,
      commission: 0,
      stage: 'negotiation',
      createdDate: new Date().toISOString().slice(0, 10),
      notes: 'Auto-created from client conversion',
    };

    setDeals((prev) => [deal, ...prev]);
    setClients((prev) =>
      prev.map((item) =>
        item.id === clientId ? { ...item, linkedDeals: [...item.linkedDeals, deal.id] } : item
      )
    );
    setLeads((prev) =>
      prev.map((item) =>
        item.id === client.leadId
          ? {
              ...item,
              status: 'negotiation',
            }
          : item
      )
    );

    return deal;
  };

  const updateDealStage = (dealId: string, stage: Deal['stage']) => {
    let linkedLeadId: string | null = null;

    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) {
          return deal;
        }

        linkedLeadId = deal.leadId;
        const commission = stage === 'closed' ? deal.value * 0.02 : deal.commission;
        return {
          ...deal,
          stage,
          commission,
        };
      })
    );

    if (linkedLeadId) {
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id !== linkedLeadId) {
            return lead;
          }

          const mappedLeadStatus =
            stage === 'closed' ? 'closed' : stage === 'agreement' ? 'proposal' : 'negotiation';
          return {
            ...lead,
            status: mappedLeadStatus,
          };
        })
      );
    }
  };

  const closeDeal = (dealId: string) => {
    updateDealStage(dealId, 'closed');
  };

  const getVisibleLeads = (role: UserRole, userId: string) => {
    if (role === 'agent') {
      return leads.filter((lead) => lead.assignedTo === userId);
    }
    return leads;
  };

  const getVisibleClients = (role: UserRole, userId: string) => {
    if (role === 'agent') {
      return clients.filter((client) => client.assignedTo === userId);
    }
    return clients;
  };

  const getVisibleDeals = (role: UserRole, userId: string) => {
    if (role === 'agent') {
      return deals.filter((deal) => deal.assignedTo === userId);
    }
    return deals;
  };

  const getDashboardMetrics = (role: UserRole, userId: string) => {
    const visibleLeads = getVisibleLeads(role, userId);
    const visibleDeals = getVisibleDeals(role, userId);

    return {
      totalLeads: visibleLeads.length,
      activeDeals: visibleDeals.filter((deal) => deal.stage !== 'closed').length,
      properties: properties.filter((property) => property.status === 'available').length,
      revenue: visibleDeals.filter((deal) => deal.stage === 'closed').reduce((sum, deal) => sum + deal.commission, 0),
      conversionRate:
        visibleLeads.length > 0
          ? Math.round((visibleLeads.filter((lead) => lead.status === 'closed').length / visibleLeads.length) * 100)
          : 0,
      teamMembers: role === 'manager' ? agents.length : 1,
      pendingTasks: visibleLeads.filter((lead) => lead.status !== 'closed' && lead.status !== 'lost').length,
    };
  };

  const value: CrmContextType = {
    leads,
    clients,
    properties,
    deals,
    agents,
    createLead,
    assignLead,
    markLeadContacted,
    addLeadActivity,
    convertLeadToClient,
    markPropertyViewed,
    convertClientToDeal,
    updateDealStage,
    closeDeal,
    getVisibleLeads,
    getVisibleClients,
    getVisibleDeals,
    getDashboardMetrics,
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within CrmProvider');
  }
  return context;
}
