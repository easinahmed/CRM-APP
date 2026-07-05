import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads, useUpdateLead, useConvertLead } from '@/hooks/useApi';
import { formatDate, formatCurrency, getInitials, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Plus, Search, Filter, MoreHorizontal, TrendingUp, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function LeadsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLeads({ search, status, page, limit: 10 });
  const updateLead = useUpdateLead();
  const convertLead = useConvertLead();

  const leads = data?.leads || [];
  const pagination = data?.pagination;

  const handleStatusChange = (id: string, newStatus: string) => {
    updateLead.mutate({ id, status: newStatus });
  };

  const handleConvert = (id: string) => {
    convertLead.mutate(id, {
      onSuccess: () => toast.success('Lead converted to customer!'),
    });
  };

  return (
    <div>
      <Header title="Leads" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search leads..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
              </div>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="w-[130px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
          </div>

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
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Priority</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Value</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Probability</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                      <th className="w-24 p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b last:border-0">
                          {[...Array(8)].map((__, j) => (
                            <td key={j} className="p-4"><Skeleton className="h-5 w-20" /></td>
                          ))}
                        </tr>
                      ))
                    ) : leads.length === 0 ? (
                      <tr><td colSpan={9} className="text-center py-16 text-muted-foreground"><p>No leads found</p></td></tr>
                    ) : (
                      leads.map((lead: any) => (
                        <tr key={lead._id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(lead.fullName)}</AvatarFallback></Avatar>
                              <div><p className="text-sm font-medium">{lead.fullName}</p><p className="text-xs text-muted-foreground">{lead.title || '-'}</p></div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{lead.email}</td>
                          <td className="p-4 text-sm">{lead.company || '-'}</td>
                          <td className="p-4">
                            <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead._id, v)}>
                              <SelectTrigger className="h-7 w-[110px] border-0 shadow-none p-0">
                                <Badge variant="outline" className={getStatusColor(lead.status)}>{getStatusLabel(lead.status)}</Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(s => (
                                  <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4"><Badge variant="outline" className={getStatusColor(lead.priority)}>{getStatusLabel(lead.priority)}</Badge></td>
                          <td className="p-4 text-sm font-medium">{formatCurrency(lead.estimatedValue)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${lead.probability}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{lead.probability}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(lead.createdAt)}</td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              {lead.status !== 'won' && lead.status !== 'lost' && (
                                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => handleConvert(lead._id)}>
                                  <TrendingUp className="h-3.5 w-3.5 mr-1" /> Convert
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Page {page} of {pagination.pages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
