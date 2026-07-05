import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useLeads, useUpdatePipelinePosition } from '@/hooks/useApi';
import { formatCurrency, getInitials, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Plus, MoreHorizontal } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'New Lead', color: 'bg-blue-500' },
  { id: 'Contacted', color: 'bg-yellow-500' },
  { id: 'Qualified', color: 'bg-purple-500' },
  { id: 'Proposal', color: 'bg-orange-500' },
  { id: 'Negotiation', color: 'bg-pink-500' },
  { id: 'Closed Won', color: 'bg-emerald-500' },
];

export function PipelinePage() {
  const { data, isLoading } = useLeads({ limit: 100 });
  const updatePosition = useUpdatePipelinePosition();
  const leads = data?.leads || [];

  const getLeadsByStage = (stage: string) => {
    return leads.filter((l: any) => l.pipelineStage === stage)
      .sort((a: any, b: any) => a.pipelinePosition - b.pipelinePosition);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    updatePosition.mutate({
      id: draggableId,
      stage: destination.droppableId,
      position: destination.index,
    });
  };

  return (
    <div>
      <Header title="Sales Pipeline" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
              {PIPELINE_STAGES.map((stage) => {
                const stageLeads = getLeadsByStage(stage.id);
                return (
                  <div key={stage.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                        <h3 className="font-semibold text-sm">{stage.id}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Plus className="h-4 w-4" /></Button>
                    </div>

                    <Droppable droppableId={stage.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-3 p-2 rounded-xl transition-colors min-h-[200px] ${snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-muted/30'}`}
                        >
                          {stageLeads.map((lead: any, index: number) => (
                            <Draggable key={lead._id} draggableId={lead._id} index={index}>
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary' : 'hover:shadow-md'}`}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{getInitials(lead.fullName)}</AvatarFallback></Avatar>
                                        <div>
                                          <p className="text-sm font-medium">{lead.fullName}</p>
                                          <p className="text-xs text-muted-foreground">{lead.company || 'No company'}</p>
                                        </div>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 -mt-1"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                      <Badge variant="outline" className={getStatusColor(lead.priority)}>{getStatusLabel(lead.priority)}</Badge>
                                      <span className="text-sm font-semibold">{formatCurrency(lead.estimatedValue)}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {stageLeads.length === 0 && !snapshot.isDraggingOver && (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                              <p className="text-xs">No leads</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </motion.div>
      </div>
    </div>
  );
}
