import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomer, useActivities } from '@/hooks/useApi';
import { formatDate, formatDateTime, formatCurrency, getInitials, getStatusColor, getStatusLabel } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, MapPin, Globe, Calendar, User, Edit, Activity, FileText, DollarSign, CheckSquare, MessageSquare } from 'lucide-react';

export function CustomerDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useCustomer(id || '');
  const { data: activitiesData } = useActivities({ relatedType: 'customer', relatedId: id });

  if (isLoading) {
    return (
      <div>
        <Header title="Customer" />
        <div className="p-6 space-y-6">
          <Skeleton className="h-20 w-64" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const customer = data?.customer;
  const activities = data?.activities || [];

  if (!customer) {
    return (
      <div>
        <Header title="Customer" />
        <div className="p-6 text-center text-muted-foreground py-16">Customer not found</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Customer Profile" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Back button */}
          <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Customers
          </Link>

          {/* Customer Header */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
            <CardContent className="relative -mt-16 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">{getInitials(customer.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{customer.fullName}</h1>
                    <Badge variant="outline" className={getStatusColor(customer.status)}>{getStatusLabel(customer.status)}</Badge>
                  </div>
                  <p className="text-muted-foreground">{customer.title} {customer.company ? `at ${customer.company}` : ''}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{customer.email}</span></div>
                {customer.phone && <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{customer.phone}</span></div>}
                {customer.address?.city && (
                  <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{customer.address.city}, {customer.address.country}</span></div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Source</span><span className="text-sm font-medium">{getStatusLabel(customer.source)}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Lead Score</span><span className="text-sm font-medium">{customer.leadScore}/100</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Lifetime Value</span><span className="text-sm font-medium">{formatCurrency(customer.lifetimeValue)}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Created</span><span className="text-sm font-medium">{formatDate(customer.createdAt)}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Assigned To</CardTitle></CardHeader>
              <CardContent>
                {customer.assignedTo ? (
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback className="text-xs">{getInitials(customer.assignedTo.name)}</AvatarFallback></Avatar>
                    <div><p className="text-sm font-medium">{customer.assignedTo.name}</p><p className="text-xs text-muted-foreground">{customer.assignedTo.email}</p></div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not assigned</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {customer.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {customer.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Activity Timeline */}
          <Card>
            <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity: any) => (
                  <div key={activity._id} className="flex items-start gap-3 pb-4 border-l-2 border-muted pl-4 ml-2 relative">
                    <div className="absolute -left-[9px] h-4 w-4 rounded-full bg-primary/20 border-2 border-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{formatDateTime(activity.createdAt)}</span>
                        <span className="text-xs text-muted-foreground">by {activity.performedBy?.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No activities yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
