'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/currency';
import { useAuth } from '@/lib/auth-context';

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  budget: number | null;
  status: string;
  assignedTo: string | null;
};

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
};

type Deal = {
  id: number;
  clientName: string;
  propertyId: number;
  stage: string;
  value: number;
};

type Agent = {
  id: string;
  name: string;
  email: string | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

function buildApiUrl(path: string): string {
  const normalizedBase = BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed', 'Lost'];

const statusStyles: Record<string, string> = {
  New: 'bg-gray-100 text-gray-700 border-gray-200',
  Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  Qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Proposal: 'bg-amber-50 text-amber-700 border-amber-200',
  Negotiation: 'bg-orange-50 text-orange-700 border-orange-200',
  Closed: 'bg-violet-50 text-violet-700 border-violet-200',
  Lost: 'bg-red-50 text-red-700 border-red-200',
};

export default function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [convertingLeadId, setConvertingLeadId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
  });
  const [editableRows, setEditableRows] = useState<Record<number, { status: string; assignedTo: string }>>({});
  const [conversionRows, setConversionRows] = useState<Record<number, { propertyId: string; value: string }>>({});

  const normalize = (value: string | null | undefined) => (value || '').trim().toLowerCase();

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = statusFilter !== 'all' ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const [leadsResponse, propertiesResponse, dealsResponse, agentsResponse] = await Promise.all([
        fetch(buildApiUrl(`/api/leads${query}`)),
        fetch(buildApiUrl('/api/properties')),
        fetch(buildApiUrl('/api/deals')),
        fetch(buildApiUrl('/api/agents')),
      ]);

      if (!leadsResponse.ok) {
        const payload = await leadsResponse.json().catch(() => ({}));
        throw new Error(
          payload?.details || payload?.error || `Failed to load leads (HTTP ${leadsResponse.status})`
        );
      }

      if (!propertiesResponse.ok) {
        const payload = await propertiesResponse.json().catch(() => ({}));
        throw new Error(
          payload?.details || payload?.error || `Failed to load properties (HTTP ${propertiesResponse.status})`
        );
      }

      if (!dealsResponse.ok) {
        const payload = await dealsResponse.json().catch(() => ({}));
        throw new Error(payload?.details || payload?.error || `Failed to load deals (HTTP ${dealsResponse.status})`);
      }

      const payload = await leadsResponse.json();
      const propertiesPayload = await propertiesResponse.json();
      const dealsPayload = await dealsResponse.json();
      const data: Lead[] = payload.data || [];
      setLeads(data);
      setProperties(propertiesPayload.data || []);
      setDeals(dealsPayload.data || []);

      if (agentsResponse.ok) {
        const agentsPayload = await agentsResponse.json().catch(() => ({}));
        setAgents(agentsPayload.data || []);
      } else {
        setAgents([]);
      }

      const nextEditableRows: Record<number, { status: string; assignedTo: string }> = {};
      const nextConversionRows: Record<number, { propertyId: string; value: string }> = {};
      data.forEach((lead) => {
        nextEditableRows[lead.id] = {
          status: lead.status || 'New',
          assignedTo: lead.assignedTo || '',
        };

        nextConversionRows[lead.id] = {
          propertyId: '',
          value: lead.budget ? String(lead.budget) : '',
        };
      });
      setEditableRows(nextEditableRows);
      setConversionRows(nextConversionRows);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load leads';
      console.error('Error fetching leads page data', {
        message,
        statusFilter,
        baseUrl: BASE_URL || '(relative)',
      });
      setError(`Failed to fetch leads: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const filteredLeads = useMemo(() => {
    const searchFiltered = leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    if (user?.role === 'agent') {
      const agentKeys = [user.name, user.email, user.id].map((value) => normalize(value));
      return searchFiltered.filter((lead) => agentKeys.includes(normalize(lead.assignedTo)));
    }

    return searchFiltered;
  }, [leads, searchTerm, user]);

  const convertedLeadNames = useMemo(() => {
    const names = new Set<string>();
    deals.forEach((deal) => {
      names.add(normalize(deal.clientName));
    });
    return names;
  }, [deals]);

  const handleCreateLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error('Name, phone, and email are required');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(buildApiUrl('/api/leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          budget: form.budget ? Number(form.budget) : null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to create lead');
      }

      setForm({ name: '', phone: '', email: '', budget: '' });
      toast.success('Lead created successfully');
      await fetchLeads();
    } catch (createError) {
      toast.error(createError instanceof Error ? createError.message : 'Failed to create lead');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLead = async (leadId: number) => {
    const editable = editableRows[leadId];
    if (!editable) return;

    setSaving(true);
    try {
      const response = await fetch(buildApiUrl(`/api/leads/${leadId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editable.status,
          assignedTo: editable.assignedTo || null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to update lead');
      }

      toast.success('Lead updated');
      await fetchLeads();
    } catch (updateError) {
      toast.error(updateError instanceof Error ? updateError.message : 'Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    setSaving(true);
    try {
      const response = await fetch(buildApiUrl(`/api/leads/${leadId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to delete lead');
      }

      toast.success('Lead deleted');
      await fetchLeads();
    } catch (deleteError) {
      toast.error(deleteError instanceof Error ? deleteError.message : 'Failed to delete lead');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignAgent = async (leadId: number, assignedTo: string) => {
    setEditableRows((prev) => ({
      ...prev,
      [leadId]: {
        ...(prev[leadId] || { status: 'New', assignedTo: '' }),
        assignedTo,
        status: 'Contacted',
      },
    }));

    setSaving(true);
    try {
      const response = await fetch(buildApiUrl(`/api/leads/${leadId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTo: assignedTo || null,
          status: 'Contacted',
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to assign agent');
      }

      toast.success('Lead assigned and moved to Contacted');
      await fetchLeads();
    } catch (assignError) {
      toast.error(assignError instanceof Error ? assignError.message : 'Failed to assign agent');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkContacted = async (leadId: number) => {
    setSaving(true);
    try {
      const response = await fetch(buildApiUrl(`/api/leads/${leadId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Contacted' }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to mark lead as Contacted');
      }

      toast.success('Lead moved to Contacted');
      await fetchLeads();
    } catch (markError) {
      toast.error(markError instanceof Error ? markError.message : 'Failed to mark lead as Contacted');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToDeal = async (lead: Lead) => {
    const conversion = conversionRows[lead.id] || { propertyId: '', value: '' };
    const propertyId = Number(conversion.propertyId);
    const value = Number(conversion.value || lead.budget || 0);

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      toast.error('Select a property before converting');
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Enter a valid deal value');
      return;
    }

    setConvertingLeadId(lead.id);
    try {
      const dealResponse = await fetch(buildApiUrl('/api/deals'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: lead.name,
          propertyId,
          value,
        }),
      });

      if (!dealResponse.ok) {
        const payload = await dealResponse.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to convert lead to deal');
      }

      const leadResponse = await fetch(buildApiUrl(`/api/leads/${lead.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Qualified',
        }),
      });

      if (!leadResponse.ok) {
        const payload = await leadResponse.json().catch(() => ({}));
        throw new Error(payload.error || 'Deal created but failed to update lead status');
      }

      toast.success('Lead converted to deal and moved to Qualified');
      await fetchLeads();
    } catch (convertError) {
      toast.error(convertError instanceof Error ? convertError.message : 'Failed to convert lead');
    } finally {
      setConvertingLeadId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage incoming leads with real MySQL data.</p>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Plus className="w-4 h-4" />
              Add Lead
            </CardTitle>
            <CardDescription>Save a new lead directly to the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateLead} className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <Input
                placeholder="Budget"
                type="number"
                value={form.budget}
                onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <div className="md:col-span-4 flex items-center gap-3">
                <Button type="submit" disabled={saving} className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  {saving ? 'Saving...' : 'Create Lead'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchLeads}
                  className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 md:max-w-md"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Lead List</CardTitle>
            <CardDescription className="text-gray-600">
              {loading ? 'Loading leads...' : `${filteredLeads.length} lead(s) found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : loading ? (
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="h-12 animate-pulse rounded-md bg-gray-200" />
                <div className="h-12 animate-pulse rounded-md bg-gray-200" />
                <div className="h-12 animate-pulse rounded-md bg-gray-200" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-gray-500">
                No leads found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead) => {
                  const rowState = editableRows[lead.id] || { status: lead.status, assignedTo: lead.assignedTo || '' };
                  const conversion = conversionRows[lead.id] || { propertyId: '', value: lead.budget ? String(lead.budget) : '' };
                  const isConverted = convertedLeadNames.has(normalize(lead.name));
                  const canAssign = user?.role === 'admin';

                  return (
                    <div
                      key={lead.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                            <Badge className={`border ${statusStyles[lead.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                              {lead.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{lead.phone}</p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                          <p className="text-sm text-gray-700">
                            Budget: <span className="font-medium">{lead.budget ? formatINR(Number(lead.budget)) : 'N/A'}</span>
                          </p>
                          <p className="text-sm text-gray-700">
                            Assigned To: <span className="font-medium">{lead.assignedTo || 'Unassigned'}</span>
                          </p>
                          <p className="text-xs text-gray-500 pt-1">
                            {'Progress: New → Contacted → Qualified → Closed'}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:min-w-[420px]">
                          <select
                            value={rowState.status}
                            onChange={(event) =>
                              setEditableRows((prev) => ({
                                ...prev,
                                [lead.id]: { ...rowState, status: event.target.value },
                              }))
                            }
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          {canAssign ? (
                            <select
                              value={rowState.assignedTo}
                              onChange={(event) => {
                                const nextAgent = event.target.value;
                                setEditableRows((prev) => ({
                                  ...prev,
                                  [lead.id]: { ...rowState, assignedTo: nextAgent, status: 'Contacted' },
                                }));
                                handleAssignAgent(lead.id, nextAgent);
                              }}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                            >
                              <option value="">Select agent</option>
                              {agents.map((agent) => (
                                <option key={agent.id} value={agent.name}>
                                  {agent.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              placeholder="Assigned to"
                              value={rowState.assignedTo}
                              readOnly
                              className="border-gray-200 bg-gray-50 text-gray-700"
                            />
                          )}

                          <select
                            value={conversion.propertyId}
                            onChange={(event) =>
                              setConversionRows((prev) => ({
                                ...prev,
                                [lead.id]: {
                                  ...conversion,
                                  propertyId: event.target.value,
                                },
                              }))
                            }
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                          >
                            <option value="">Select property</option>
                            {properties.map((property) => (
                              <option key={property.id} value={property.id}>
                                {property.title} ({property.location})
                              </option>
                            ))}
                          </select>

                          <Input
                            placeholder="Deal value"
                            type="number"
                            value={conversion.value}
                            onChange={(event) =>
                              setConversionRows((prev) => ({
                                ...prev,
                                [lead.id]: {
                                  ...conversion,
                                  value: event.target.value,
                                },
                              }))
                            }
                            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                          />

                          <div className="flex gap-2 md:col-span-2">
                            <Button
                              type="button"
                              onClick={() => handleSaveLead(lead.id)}
                              disabled={saving}
                              className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            {canAssign && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAssignAgent(lead.id, rowState.assignedTo)}
                                disabled={saving}
                                className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                              >
                                Assign Agent
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleMarkContacted(lead.id)}
                              disabled={saving}
                              className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              Mark as Contacted
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleConvertToDeal(lead)}
                              disabled={saving || convertingLeadId === lead.id || isConverted}
                              className="rounded-full bg-emerald-700 text-white hover:bg-emerald-600"
                            >
                              {isConverted ? 'Already Converted' : convertingLeadId === lead.id ? 'Converting...' : 'Convert to Deal'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleDeleteLead(lead.id)}
                              disabled={saving}
                              className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
