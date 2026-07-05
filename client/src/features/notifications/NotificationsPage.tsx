import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications, useMarkNotificationRead } from '@/hooks/useApi';
import { formatDateTime, getStatusLabel } from '@/lib/utils';
import { Bell, CheckCheck, CalendarCheck, Target, FileText, MessageSquare, AlertCircle } from 'lucide-react';

const typeIcons: Record<string, any> = {
  task_assigned: CalendarCheck,
  meeting_invite: CalendarCheck,
  lead_assigned: Target,
  invoice_created: FileText,
  payment_received: FileText,
  comment: MessageSquare,
  system: AlertCircle,
};

export function NotificationsPage() {
  const { data, isLoading } = useNotifications({ limit: 50 });
  const markRead = useMarkNotificationRead();
  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div>
      <Header title="Notifications" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">{unreadCount} unread</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm">
                <CheckCheck className="h-4 w-4 mr-2" /> Mark all read
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.length === 0 ? (
              <Card><CardContent className="text-center py-16 text-muted-foreground"><Bell className="h-12 w-12 mx-auto mb-3 opacity-40" /><p>No notifications</p></CardContent></Card>
            ) : (
              notifications.map((notif: any) => {
                const Icon = typeIcons[notif.type] || Bell;
                return (
                  <Card
                    key={notif._id}
                    className={`transition-all hover:shadow-md cursor-pointer ${!notif.isRead ? 'border-primary/30 bg-primary/[0.02]' : ''}`}
                    onClick={() => { if (!notif.isRead) markRead.mutate(notif._id); }}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`rounded-xl p-2.5 ${!notif.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`h-5 w-5 ${!notif.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium'}`}>{notif.title}</p>
                          {!notif.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{formatDateTime(notif.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
