'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/currency';

type Deal = {
  id: number;
  clientName: string;
  propertyId: number;
  stage: 'Negotiation' | 'Agreement' | 'Closed';
  value: number;
  commission: number;
};

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
};

type Lead = {
  id: number;
  name: string;
  status: string;
  assignedTo: string | null;
};

const stageOptions: Array<Deal['stage']> = ['Negotiation', 'Agreement', 'Closed'];

const stageStyles: Record<Deal['stage'], string> = {
  Negotiation: 'bg-amber-50 text-amber-700 border-amber-200',
  Agreement: 'bg-blue-50 text-blue-700 border-blue-200',
  Closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    clientName: '',
    propertyId: '',
    value: '',
  });
  const [stageSelections, setStageSelections] = useState<Record<number, Deal['stage']>>({});

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dealsRes, propertiesRes, leadsRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/properties'),
        fetch('/api/leads'),
      ]);

      if (!dealsRes.ok) {
        const payload = await dealsRes.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to load deals');
      }

      if (!propertiesRes.ok) {
        const payload = await propertiesRes.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to load properties');
      }

      if (!leadsRes.ok) {
        const payload = await leadsRes.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to load leads');
      }

      const dealsPayload = await dealsRes.json();
      const propertiesPayload = await propertiesRes.json();
      const leadsPayload = await leadsRes.json();

      const dealsData: Deal[] = dealsPayload.data || [];
      setDeals(dealsData);
      setProperties(propertiesPayload.data || []);
      setLeads(leadsPayload.data || []);

      const nextStages: Record<number, Deal['stage']> = {};
      dealsData.forEach((deal) => {
        nextStages[deal.id] = deal.stage;
      });
      setStageSelections(nextStages);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const propertyMap = useMemo(() => {
    const map = new Map<number, Property>();
    properties.forEach((property) => map.set(property.id, property));
    return map;
  }, [properties]);

  const leadMap = useMemo(() => {
    const map = new Map<string, Lead>();
    leads.forEach((lead) => {
      map.set(lead.name.trim().toLowerCase(), lead);
    });
    return map;
  }, [leads]);

  const filteredDeals = useMemo(() => {
    if (!searchTerm.trim()) {
      return deals;
    }

    const search = searchTerm.toLowerCase();
    return deals.filter((deal) => {
      const property = propertyMap.get(Number(deal.propertyId));
      return (
        deal.clientName.toLowerCase().includes(search) ||
        String(deal.propertyId).includes(search) ||
        deal.stage.toLowerCase().includes(search) ||
        property?.title.toLowerCase().includes(search)
      );
    });
  }, [deals, searchTerm, propertyMap]);

  const totalValue = filteredDeals.reduce((sum, deal) => sum + Number(deal.value), 0);
  const totalCommission = filteredDeals.reduce((sum, deal) => sum + Number(deal.commission), 0);

  const handleCreateDeal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.clientName.trim() || !form.propertyId.trim() || !form.value.trim()) {
      toast.error('Client name, property ID, and value are required');
      return;
    }

    const propertyId = Number(form.propertyId);
    const value = Number(form.value);
    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      toast.error('Please enter a valid property ID');
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Please enter a valid deal value');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: form.clientName.trim(),
          propertyId,
          value,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to create deal');
      }

      setForm({ clientName: '', propertyId: '', value: '' });
      toast.success('Deal created in Negotiation stage');
      await fetchDeals();
    } catch (createError) {
      toast.error(createError instanceof Error ? createError.message : 'Failed to create deal');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStage = async (dealId: number) => {
    const stage = stageSelections[dealId];
    if (!stage) {
      toast.error('Select a valid stage');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to update stage');
      }

      toast.success(stage === 'Closed' ? 'Deal closed and commission updated' : 'Deal stage updated');
      await fetchDeals();
    } catch (updateError) {
      toast.error(updateError instanceof Error ? updateError.message : 'Failed to update stage');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Deals</h1>
          <p className="text-gray-600">Track and manage deal progress with live MySQL data.</p>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Plus className="w-4 h-4" />
              Create Deal
            </CardTitle>
            <CardDescription>Create a new deal with client name, property ID, and value.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDeal} className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                placeholder="Client name"
                value={form.clientName}
                onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <Input
                placeholder="Property ID"
                type="number"
                value={form.propertyId}
                onChange={(event) => setForm((prev) => ({ ...prev, propertyId: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <Input
                placeholder="Deal value"
                type="number"
                value={form.value}
                onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <div className="md:col-span-3 flex items-center gap-3">
                <Button type="submit" disabled={saving} className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  {saving ? 'Saving...' : 'Create Deal'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchDeals}
                  className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">Total Deal Value</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{formatINR(totalValue)}</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">Open Deals</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {filteredDeals.filter((deal) => deal.stage !== 'Closed').length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">Total Commission</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-700">{formatINR(totalCommission)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            placeholder="Search by client, stage, property id, or property title"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 md:max-w-md"
          />
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Deals List</CardTitle>
            <CardDescription className="text-gray-600">
              {loading ? 'Loading deals...' : `${filteredDeals.length} deal(s) found`}
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
            ) : filteredDeals.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-gray-500">
                No deals found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeals.map((deal) => {
                  const property = propertyMap.get(Number(deal.propertyId));
                  const linkedLead = leadMap.get(deal.clientName.trim().toLowerCase());

                  return (
                    <div
                      key={deal.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{deal.clientName}</h3>
                            <Badge className={`border ${stageStyles[deal.stage]}`}>
                              {deal.stage}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Property: {property ? `${property.title} (${property.location})` : `ID ${deal.propertyId}`}
                          </p>
                          {linkedLead ? (
                            <p className="text-sm text-gray-600">
                              Lead: <span className="font-medium">#{linkedLead.id}</span> | Status: <span className="font-medium">{linkedLead.status}</span>
                              {linkedLead.assignedTo ? ` | Assigned: ${linkedLead.assignedTo}` : ''}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">Lead: Not linked</p>
                          )}
                          <p className="text-sm text-gray-700">
                            Value: <span className="font-medium">{formatINR(Number(deal.value))}</span>
                          </p>
                          <p className="text-sm text-emerald-700">
                            Commission: <span className="font-medium">{formatINR(Number(deal.commission))}</span>
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 lg:min-w-[260px]">
                          <select
                            value={stageSelections[deal.id] || deal.stage}
                            onChange={(event) =>
                              setStageSelections((prev) => ({
                                ...prev,
                                [deal.id]: event.target.value as Deal['stage'],
                              }))
                            }
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                          >
                            {stageOptions.map((stage) => (
                              <option key={stage} value={stage}>
                                {stage}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            onClick={() => handleUpdateStage(deal.id)}
                            disabled={saving}
                            className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Update Stage
                          </Button>
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
