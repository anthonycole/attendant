'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { ActivityHeader } from './ActivityHeader';
import { ActivityTimeline } from './ActivityTimeline';
import type { Communication } from '@/types/schema';
import type { TaskWithDetails, TaskStatus } from '@/types/schema';
import { useStrataScheme } from '@/contexts/StrataSchemeContext';

interface ActivityData {
  id: string;
  task_id: string;
  type: 'status_update' | 'communication' | 'internal_note';
  timestamp: string;
  author: string;
  content: string;
  status_change?: {
    from: string;
    to: string;
  };
  communication_details?: {
    channel: string;
    direction: string;
    duration?: number;
    recipients?: string;
  };
  strata_scheme_id: string;
}

type FilterStatus = 'all' | 'communication' | 'status_update' | 'internal_note';

interface CommunicationHistoryProps {
  task: TaskWithDetails;
}

export function CommunicationHistory({ task }: CommunicationHistoryProps) {
  const { currentScheme } = useStrataScheme();
  const taskId = task.id;
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  // Get timeline communications for the current task
  const timelineData = React.useMemo(() => {
    try {
      const timelineJson = require('@/data/communications.json');
      return (timelineJson as Communication[]).filter(
        (comm: Communication) => comm.task_id === taskId
      );
    } catch {
      return [];
    }
  }, [taskId]);

  // Get activities for the current scheme and task
  const activitiesData = React.useMemo(() => {
    try {
      const activitiesJson = require('@/data/activities.json');
      return (activitiesJson as ActivityData[]).filter(
        (activity: ActivityData) => activity.task_id === taskId && 
        (!currentScheme?.id || activity.strata_scheme_id === currentScheme.id)
      );
    } catch {
      return [];
    }
  }, [currentScheme?.id, taskId]);

  // Add new update handler
  const handleAddUpdate = (content: string, newStatus?: TaskStatus) => {
    // For now, just log the update. In a real app, this would save to the backend
    console.log('Adding update:', { content, newStatus, taskId });
    
    // You could add optimistic updates here by updating local state
    // const newActivity: ActivityData = {
    //   id: Date.now().toString(),
    //   task_id: taskId,
    //   type: 'internal_note',
    //   timestamp: new Date().toISOString(),
    //   author: 'Current User',
    //   content,
    //   status_change: newStatus ? {
    //     from: task.status,
    //     to: newStatus
    //   } : undefined,
    //   strata_scheme_id: currentScheme?.id || ''
    // };
  };

  // Combine timeline and activities into a unified timeline
  const allActivities = React.useMemo(() => {
    // Convert timeline to timeline format
    const timelineItems = timelineData.map((comm: Communication) => ({
      id: comm.id,
      timestamp: comm.timestamp,
      type: 'communication' as const,
      data: comm
    }));

    // Convert activities to timeline format  
    const activityItems = activitiesData.map((activity: ActivityData) => ({
      id: activity.id,
      timestamp: activity.timestamp,
      type: 'activity' as const,
      data: activity
    }));

    // Combine all activities
    const combined = [...timelineItems, ...activityItems];

    // Sort by timestamp (most recent first)
    const sorted = combined.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA; // Most recent first
    });

    // Apply status filter
    if (statusFilter === 'all') {
      return sorted;
    }

    return sorted.filter(item => {
      if (statusFilter === 'communication') {
        return item.type === 'communication';
      }
      if (item.type === 'activity') {
        const activityData = item.data as ActivityData;
        return activityData.type === statusFilter;
      }
      return false;
    });
  }, [timelineData, activitiesData, statusFilter]);

  return (
    <Box p={6} flex={1} overflow="auto" bg="gray.50" minW={0}>
      <VStack spacing={4} align="stretch">
        <ActivityHeader 
          totalItems={allActivities.length}
          task={task}
          taskId={taskId}
          onAddUpdate={handleAddUpdate}
        />

        {/* Status Filter */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
            Filter by type:
          </Text>
          <ButtonGroup size="sm" variant="outline" spacing={2}>
            <Button
              variant={statusFilter === 'all' ? 'solid' : 'outline'}
              colorScheme={statusFilter === 'all' ? 'blue' : 'gray'}
              onClick={() => setStatusFilter('all')}
            >
              All ({timelineData.length + activitiesData.length})
            </Button>
            <Button
              variant={statusFilter === 'communication' ? 'solid' : 'outline'}
              colorScheme={statusFilter === 'communication' ? 'blue' : 'gray'}
              onClick={() => setStatusFilter('communication')}
            >
              Timeline ({timelineData.length})
            </Button>
            <Button
              variant={statusFilter === 'status_update' ? 'solid' : 'outline'}
              colorScheme={statusFilter === 'status_update' ? 'blue' : 'gray'}
              onClick={() => setStatusFilter('status_update')}
            >
              Status Updates ({activitiesData.filter(a => a.type === 'status_update').length})
            </Button>
            <Button
              variant={statusFilter === 'internal_note' ? 'solid' : 'outline'}
              colorScheme={statusFilter === 'internal_note' ? 'blue' : 'gray'}
              onClick={() => setStatusFilter('internal_note')}
            >
              Internal Notes ({activitiesData.filter(a => a.type === 'internal_note').length})
            </Button>
          </ButtonGroup>
        </Box>

        <ActivityTimeline activities={allActivities} />
      </VStack>
    </Box>
  );
}