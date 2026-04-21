'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MapPin, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/currency';

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  type?: string;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
  });

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to load properties');
      }

      const payload = await response.json();
      setProperties(payload.data || []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) {
      return properties;
    }

    return properties.filter((property) => {
      const search = searchTerm.toLowerCase();
      return (
        property.title.toLowerCase().includes(search) ||
        property.location.toLowerCase().includes(search)
      );
    });
  }, [properties, searchTerm]);

  const handleCreateProperty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim() || !form.price.trim()) {
      toast.error('Title, location, and price are required');
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Please enter a valid property price');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Keep backend compatibility: current API expects type.
        body: JSON.stringify({
          title: form.title.trim(),
          location: form.location.trim(),
          price,
          type: 'Residential',
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to create property');
      }

      setForm({ title: '', location: '', price: '' });
      toast.success('Property added successfully');
      await fetchProperties();
    } catch (createError) {
      toast.error(createError instanceof Error ? createError.message : 'Failed to create property');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Properties</h1>
          <p className="text-gray-600">Browse and manage property listings from the live database.</p>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Plus className="w-4 h-4" />
              Add Property
            </CardTitle>
            <CardDescription>Save a property record directly to MySQL.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProperty} className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                placeholder="Property title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <Input
                placeholder="Location"
                value={form.location}
                onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <Input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <div className="md:col-span-3 flex items-center gap-3">
                <Button type="submit" disabled={saving} className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  {saving ? 'Saving...' : 'Create Property'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchProperties}
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
            placeholder="Search by title or location"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 md:max-w-md"
          />
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Property Listings</CardTitle>
            <CardDescription className="text-gray-600">
              {loading ? 'Loading properties...' : `${filteredProperties.length} property(s) found`}
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
            ) : filteredProperties.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-gray-500">
                No properties found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-2 text-gray-800">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-3">
                      <span className="text-base font-semibold text-gray-900">
                        {formatINR(Number(property.price))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
