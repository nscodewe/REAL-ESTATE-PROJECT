'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const analyticsData = [
  { month: 'Jan', leads: 45, deals: 12, conversion: 26 },
  { month: 'Feb', leads: 52, deals: 18, conversion: 35 },
  { month: 'Mar', leads: 48, deals: 15, conversion: 31 },
  { month: 'Apr', leads: 61, deals: 22, conversion: 36 },
  { month: 'May', leads: 70, deals: 28, conversion: 40 },
  { month: 'Jun', leads: 65, deals: 25, conversion: 38 },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only admin and manager can access this page
    if (user && user.role === 'agent') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  if (user?.role === 'agent') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Business metrics and performance analysis</p>
        </div>

        {user?.role === 'manager' && (
          <Alert className="border-blue-500/50 bg-blue-500/5">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              You are viewing team-level analytics. Use these insights to track your team&apos;s performance.
            </AlertDescription>
          </Alert>
        )}

        {user?.role === 'admin' && (
          <Alert className="border-primary/50 bg-primary/5">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription>
              You are viewing system-wide analytics with access to all business data.
            </AlertDescription>
          </Alert>
        )}

        {/* Lead and Deal Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Lead Pipeline</CardTitle>
              <CardDescription>Monthly lead volume and deals closed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#3b82f6" />
                  <Bar dataKey="deals" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Conversion Rate Trend</CardTitle>
              <CardDescription>Lead to deal conversion percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="conversion" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ fill: '#10b981' }}
                    label="Conversion %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Total Leads (6 months)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">341</p>
              <p className="text-xs text-emerald-600 mt-2">↑ 8% vs previous period</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Total Deals Closed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">120</p>
              <p className="text-xs text-emerald-600 mt-2">↑ 15% vs previous period</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Avg Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">35.2%</p>
              <p className="text-xs text-emerald-600 mt-2">↑ 3% vs previous period</p>
            </CardContent>
          </Card>
        </div>

        {/* Access Control Info */}
        <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Analytics Access Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Admin Access</p>
                <p>Full access to all analytics and reports across the entire system.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Manager Access</p>
                <p>Access to team-level performance metrics and analytics.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
