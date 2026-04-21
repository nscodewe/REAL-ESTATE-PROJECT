'use client';

import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { useCrm } from '@/lib/crm-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatINR } from '@/lib/currency';

export default function ClientsPage() {
  const { user } = useAuth();
  const {
    properties,
    getVisibleClients,
    markPropertyViewed,
    convertClientToDeal,
  } = useCrm();

  const [selectedProperty, setSelectedProperty] = useState<Record<string, string>>({});

  const clients = useMemo(() => {
    if (!user) {
      return [];
    }
    return getVisibleClients(user.role, user.id);
  }, [getVisibleClients, user]);

  const handleMarkViewed = (clientId: string) => {
    const propertyId = selectedProperty[clientId];
    if (!propertyId) {
      toast.error('Select a property first');
      return;
    }

    // Step 4: Track viewed properties under the client record.
    markPropertyViewed(clientId, propertyId);
    toast.success('Property marked as viewed');
  };

  const handleConvertToDeal = (clientId: string) => {
    const propertyId = selectedProperty[clientId];
    if (!propertyId) {
      toast.error('Select a property before creating deal');
      return;
    }

    const property = properties.find((item) => item.id === propertyId);
    if (!property) {
      toast.error('Invalid property selected');
      return;
    }

    // Step 5: Create deal linked to lead, client, and property.
    const deal = convertClientToDeal(clientId, propertyId, property.price);
    if (!deal) {
      toast.error('Unable to create deal for this client');
      return;
    }

    toast.success(`Deal created in Negotiation: ${deal.title}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Convert leads, track property views, and open negotiation deals</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
            <CardDescription>{clients.length} client(s) available in your scope</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No clients yet. Convert a lead from the Leads page to begin the workflow.
                </div>
              ) : (
                clients.map((client) => (
                  <Card key={client.id} className="border-border/40">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email} • {client.phone}</p>
                          <p className="text-xs text-muted-foreground mt-1">Lead ID: {client.leadId}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Viewed properties: {client.viewedProperties.length}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <select
                          value={selectedProperty[client.id] ?? ''}
                          onChange={(event) =>
                            setSelectedProperty((prev) => ({
                              ...prev,
                              [client.id]: event.target.value,
                            }))
                          }
                          className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground"
                        >
                          <option value="">Select property</option>
                          {properties.map((property) => (
                            <option key={property.id} value={property.id}>
                              {property.address} ({formatINR(Number(property.price))})
                            </option>
                          ))}
                        </select>
                        <Button variant="outline" onClick={() => handleMarkViewed(client.id)}>
                          Mark Property Viewed
                        </Button>
                        <Button onClick={() => handleConvertToDeal(client.id)} className="bg-primary hover:bg-primary/90">
                          Convert to Deal
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Linked deals: {client.linkedDeals.length === 0 ? 'None' : client.linkedDeals.join(', ')}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
