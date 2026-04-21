'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunicationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Communications</h1>
          <p className="text-gray-600">Manage all client communications</p>
        </div>

        <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Communication Timeline</CardTitle>
            <CardDescription>All calls, emails, and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-600">No data available yet. Communications module coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
