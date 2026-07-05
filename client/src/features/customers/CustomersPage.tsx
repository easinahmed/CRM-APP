import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomers } from '@/hooks/useApi';
import { formatDate, getInitials, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Plus, Search, Filter, ChevronDown, MoreHorizontal, Mail, Phone, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCustomers({ search, status, page, limit: 10 });

  const customers = data?.customers || [];
  const pagination = data?.pagination;

  return (
    <div>
      <Header title="Customers" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9"
                />
              </div>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button asChild>
              <Link to="/customers/new">
                <Plus className="h-4 w-4 mr-2" /> Add Customer
              </Link>
            </Button>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Score</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Assigned To</th>
                      <th className="w-10 p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="p-4"><Skeleton className="h-8 w-32" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                          <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="p-4"><Skeleton className="h-8 w-24" /></td>
                          <td className="p-4" />
                        </tr>
                      ))
                    ) : customers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-16 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-40" />
                            <p>No customers found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      customers.map((customer: any) => (
                        <tr key={customer._id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <Link to={`/customers/${customer._id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(customer.fullName)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{customer.fullName}</p>
                                <p className="text-xs text-muted-foreground">{customer.title || 'No title'}</p>
                              </div>
                            </Link>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-sm">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground text-xs">{customer.email}</span>
                              </div>
                              {customer.phone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-muted-foreground text-xs">{customer.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-sm">{customer.company || '-'}</td>
                          <td className="p-4">
                            <Badge variant="outline" className={getStatusColor(customer.status)}>
                              {getStatusLabel(customer.status)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${customer.leadScore}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{customer.leadScore}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(customer.createdAt)}</td>
                          <td className="p-4">
                            {customer.assignedTo ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-[10px]">{getInitials(customer.assignedTo.name)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{customer.assignedTo.name}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Unassigned</span>
                            )}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
