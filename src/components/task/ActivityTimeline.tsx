'use client';

import React from 'react';
import {
  Box,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ActivityItem } from './ActivityItem';
import type { Communication } from '@/types/schema';

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

interface CombinedActivity {
  id: string;
  timestamp: string;
  type: 'activity' | 'communication';
  data: ActivityData | Communication;
}

interface ActivityTimelineProps {
  activities: CombinedActivity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Box textAlign="center" py={12} bg="white" border="1px" borderColor="gray.200" borderRadius="md">
        <Text fontSize="sm" color="gray.500" fontWeight="500">
          No activity found
        </Text>
        <Text fontSize="xs" color="gray.400" mt={1}>
          Activity will appear here once communications or updates are made
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {activities.map((activity) => (
        <ActivityItem
          key={`${activity.type}-${activity.id}`}
          activity={activity.data}
          type={activity.type}
        />
      ))}
    </VStack>
  );
}