import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users, Target, DollarSign, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useApi';
import { formatCurrency, formatDate, formatDateTime, getInitials, getStatusColor, getStatusLabel } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StatCard({ title, value, change, icon: Icon, isCurrency }: { title: string; value: number; change?: string; icon: any; isCurrency?: boolean }) {
  const isPositive = change && parseFloat(change) >= 0;
  return (
    <motion.div variants={item}>
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">
            {isCurrency ? formatCurrency(value) : value.toLocaleString()}
          </p>
          {change && (
            <div className="flex items-center gap-1 text-sm">
              <span className={isPositive ? 'text-emerald-500' : 'text-red-500'}>
                {isPositive ? <ArrowUpRight className="h-4 w-4 inline" /> : <ArrowDownRight className="h-4 w-4 inline" />}
                {Math.abs(parseFloat(change))}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardPage() {
  const { data, isLoading } = useDashboard();

  const stats = data?.stats;
  const customerGrowth = data?.customerGrowth || [];
  const revenueTrend = data?.revenueTrend || [];
  const recentActivities = data?.recentActivities || [];
  const leadsByStatus = data?.leadsByStatus || [];
  const customersByStatus = data?.customersByStatus || [];

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Customers" value={stats?.totalCustomers || 0} change="12.5" icon={Users} />
              <StatCard title="Active Leads" value={stats?.activeLeads || 0} change="8.2" icon={Target} />
              <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} change="15.3" icon={DollarSign} isCurrency />
              <StatCard title="Conversion Rate" value={stats?.conversionRate || 0} change="2.1" icon={TrendingUp} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="New Customers (Month)" value={stats?.newCustomersThisMonth || 0} icon={Users} />
              <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={Target} />
              <StatCard title="Monthly Revenue" value={stats?.monthlyRevenue || 0} isCurrency icon={DollarSign} />
              <StatCard title="Pending Tasks" value={stats?.pendingTasks || 0} icon={Activity} />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Chart */}
              <motion.div variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
                    <Badge variant="success">+{stats?.monthlyRevenue ? ((stats.monthlyRevenue / (stats.totalRevenue || 1)) * 100).toFixed(1) : 0}% this month</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueTrend}>
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="_id" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                            formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                          />
                          <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customer Growth Chart */}
              <motion.div variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-semibold">Customer Growth</CardTitle>
                    <Badge variant="info">+{stats?.newCustomersThisMonth || 0} this month</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={customerGrowth}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="_id" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                          />
                          <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Leads by Status */}
              <motion.div variants={item}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Leads by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={leadsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="count" nameKey="_id">
                            {leadsByStatus.map((_: any, idx: number) => (
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activities */}
              <motion.div variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.slice(0, 6).map((activity: any) => (
                        <div key={activity._id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 mt-0.5">
                            <AvatarImage src={activity.performedBy?.avatar} />
                            <AvatarFallback className="text-xs">{getInitials(activity.performedBy?.name || 'U')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{formatDateTime(activity.createdAt)}</p>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-[10px]">
                            {getStatusLabel(activity.type)}
                          </Badge>
                        </div>
                      ))}
                      {recentActivities.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-8">No recent activities</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customers by Status */}
              <motion.div variants={item}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Customers by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customersByStatus.map((item: any) => (
                        <div key={item._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(item._id)}>
                              {getStatusLabel(item._id)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{item.count}</span>
                            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${(item.count / (stats?.totalCustomers || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
