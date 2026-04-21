'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { dummyUsers } from '@/lib/dummy-data';

export default function UserManagementPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only admins can access this page
    if (user && user.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  if (user?.role !== 'admin') {
    return null;
  }

  const systemUsers = Object.values(dummyUsers);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions (Admin Only)</p>
        </div>

        <Alert className="border-primary/50 bg-primary/5">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription>
            This page is restricted to administrators only. Changes to user roles will affect system-wide access controls.
          </AlertDescription>
        </Alert>

        <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>All users in the system and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {systemUsers.map((sysUser) => (
                    <tr key={sysUser.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-900 font-medium">{sysUser.name}</td>
                      <td className="py-3 px-4 text-gray-600">{sysUser.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                          {sysUser.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{sysUser.department}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sysUser.isActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {sysUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Access levels for each role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Admin</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Full system access</li>
                  <li>✓ User management</li>
                  <li>✓ All analytics</li>
                  <li>✓ View all data</li>
                  <li>✓ System settings</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Manager</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Team analytics</li>
                  <li>✓ Performance tracking</li>
                  <li>✓ View team data</li>
                  <li>✗ User management</li>
                  <li>✗ System settings</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Agent</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Own leads</li>
                  <li>✓ Own deals</li>
                  <li>✓ Own tasks</li>
                  <li>✗ Team data</li>
                  <li>✗ Analytics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
