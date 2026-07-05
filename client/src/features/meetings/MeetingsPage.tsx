import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMeetings } from '@/hooks/useApi';
import { formatDateTime, getInitials, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Plus, Video, Phone, MapPin, Clock, Users } from 'lucide-react';

export function MeetingsPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useMeetings({ status, limit: 50 });
  const meetings = data?.meetings || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'in_person': return <MapPin className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <Header title="Meetings" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button><Plus className="h-4 w-4 mr-2" /> Schedule Meeting</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              [...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
            ) : meetings.length === 0 ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No meetings scheduled</p>
              </div>
            ) : (
              meetings.map((meeting: any) => (
                <Card key={meeting._id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className={getStatusColor(meeting.status)}>
                        {getStatusLabel(meeting.status)}
                      </Badge>
                      <div className="flex -space-x-2">
                        {meeting.attendees?.slice(0, 3).map((a: any) => (
                          <Avatar key={a._id} className="h-7 w-7 border-2 border-background"><AvatarFallback className="text-[9px]">{getInitials(a.name)}</AvatarFallback></Avatar>
                        ))}
                        {(meeting.attendees?.length || 0) > 3 && (
                          <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium">
                            +{meeting.attendees.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{meeting.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{meeting.description || 'No description'}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDateTime(meeting.startTime)} - {new Date(meeting.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                      {meeting.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {meeting.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getTypeIcon(meeting.type)}
                        {getStatusLabel(meeting.type)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
