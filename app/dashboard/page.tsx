'use client';

import { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { useCrm } from '@/lib/crm-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, Home, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { formatINR } from '@/lib/currency';

const monthlyData = [
  { month: 'Jan', sales: 1200000 },
  { month: 'Feb', sales: 1400000 },
  { month: 'Mar', sales: 1100000 },
  { month: 'Apr', sales: 1550000 },
  { month: 'May', sales: 1800000 },
  { month: 'Jun', sales: 1650000 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

type MetricCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  change: number;
};

function MetricCard({ icon: Icon, label, value, change }: MetricCardProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{label}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            <p className="text-xs text-emerald-600 mt-2">↑ {change}% from last month</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { getDashboardMetrics, getVisibleLeads } = useCrm();

  const metrics = useMemo(() => {
    if (!user) {
      return null;
    }
    return getDashboardMetrics(user.role, user.id);
  }, [getDashboardMetrics, user]);

  const conversionData = useMemo(() => {
    if (!user) {
      return [];
    }

    const visibleLeads = getVisibleLeads(user.role, user.id);
    const totalLeads = visibleLeads.length;
    const toPercent = (count: number) => (totalLeads === 0 ? 0 : Math.round((count / totalLeads) * 100));

    return [
      { name: 'New', value: toPercent(visibleLeads.filter((lead) => lead.status === 'new').length) },
      { name: 'Contacted', value: toPercent(visibleLeads.filter((lead) => lead.status === 'contacted').length) },
      { name: 'Qualified', value: toPercent(visibleLeads.filter((lead) => lead.status === 'qualified').length) },
      { name: 'Closed', value: toPercent(visibleLeads.filter((lead) => lead.status === 'closed').length) },
    ];
  }, [getVisibleLeads, user]);

  const getRoleWelcome = () => {
    switch (user?.role) {
      case 'admin':
        return 'Full system overview and team management';
      case 'manager':
        return 'Team performance and analytics';
      case 'agent':
        return 'Your personal leads and deals';
      default:
        return 'Dashboard';
    }
  };

  const revenueLabel = user?.role === 'agent' ? 'Commission' : 'Total Revenue';
  const revenueValue = !metrics ? '-' : formatINR(Number(metrics.revenue));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Welcome back, {user?.name.split(' ')[0]}</h1>
              <p className="text-muted-foreground mt-2">
                {getRoleWelcome()} • <span className="capitalize">{user?.role}</span>
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">{user?.role}</div>
          </div>
        </div>

        <div className={`grid gap-4 ${user?.role === 'agent' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          <MetricCard icon={Users} label="Total Leads" value={metrics?.totalLeads ?? '-'} change={12} />
          {user?.role !== 'agent' && (
            <MetricCard icon={Home} label="Active Properties" value={metrics?.properties ?? '-'} change={8} />
          )}
          <MetricCard icon={Briefcase} label="Active Deals" value={metrics?.activeDeals ?? '-'} change={5} />
          <MetricCard icon={TrendingUp} label={revenueLabel} value={revenueValue} change={18} />
        </div>

        {user?.role === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>Revenue trend over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(value) => formatINR(Number(value))} />
                    <Tooltip formatter={(value) => formatINR(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Lead Status</CardTitle>
                <CardDescription>Distribution across stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={conversionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {conversionData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user?.role === 'manager' && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Overview of team metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{metrics?.teamMembers ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{metrics?.conversionRate ?? '-'}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{metrics?.pendingTasks ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {metrics ? formatINR(Number(metrics.revenue)) : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === 'agent' && (
          <Card className="border-border/50 border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <CardTitle>Your Tasks</CardTitle>
                  <CardDescription>Focus on what&apos;s assigned to you</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                You have <span className="font-semibold">{metrics?.pendingTasks ?? 0}</span> pending tasks to complete.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You&apos;re managing <span className="font-semibold">{metrics?.totalLeads ?? 0}</span> leads and
                <span className="font-semibold"> {metrics?.activeDeals ?? 0}</span> active deals.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates {user?.role === 'agent' ? 'on your deals' : 'in your team'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-border/30 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Deal closed with Michael Chen</p>
                    <p className="text-sm text-muted-foreground mt-1">{formatINR(495000)} - Maple Street Property</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
