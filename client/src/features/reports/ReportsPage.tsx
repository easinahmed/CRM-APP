import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/useApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ReportsPage() {
  const { data, isLoading } = useDashboard();

  const customerGrowth = data?.customerGrowth || [];
  const revenueTrend = data?.revenueTrend || [];
  const leadsByStatus = data?.leadsByStatus || [];

  return (
    <div>
      <Header title="Reports & Analytics" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Total Revenue', value: data?.stats?.totalRevenue || 0, icon: DollarSign, prefix: '$' },
              { label: 'Total Customers', value: data?.stats?.totalCustomers || 0, icon: Users },
              { label: 'Conversion Rate', value: data?.stats?.conversionRate || 0, icon: TrendingUp, suffix: '%' },
              { label: 'Active Leads', value: data?.stats?.activeLeads || 0, icon: Activity },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3"><stat.icon className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.prefix || ''}{stat.value.toLocaleString()}{stat.suffix || ''}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Chart */}
              <Card><CardHeader><CardTitle className="text-base">Revenue Overview</CardTitle></CardHeader>
                <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="_id" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                    <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#colorRev)" />
                    <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                  </AreaChart>
                </ResponsiveContainer></div></CardContent>
              </Card>

              {/* Customer Growth */}
              <Card><CardHeader><CardTitle className="text-base">Customer Growth</CardTitle></CardHeader>
                <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="_id" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer></div></CardContent>
              </Card>

              {/* Leads Distribution */}
              <Card><CardHeader><CardTitle className="text-base">Leads by Status</CardTitle></CardHeader>
                <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={leadsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="_id">
                      {leadsByStatus.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer></div></CardContent>
              </Card>

              {/* Performance Summary */}
              <Card><CardHeader><CardTitle className="text-base">Performance Summary</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: 'Invoices Paid', value: data?.stats?.paidInvoices || 0, total: data?.stats?.totalInvoices || 1 },
                    { label: 'Customer Retention', value: data?.stats?.totalCustomers || 0, total: 100 },
                    { label: 'Lead Conversion', value: data?.stats?.conversionRate || 0, total: 100 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}{item.total === 100 ? '%' : ''} / {item.total}{item.total === 100 ? '%' : ''}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((item.value / item.total) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
