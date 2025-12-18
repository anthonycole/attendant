'use client';

import React from 'react';
import { HStack, Tag } from '@chakra-ui/react';
import type { TaskWithDetails } from '@/types/schema';

interface TaskTagsProps {
  task: TaskWithDetails;
}

const priorityColors: Record<string, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
};

const categoryLabels: Record<string, string> = {
  maintenance: 'Maintenance',
  repairs: 'Repairs',
  noise_complaint: 'Noise Complaint',
  parking: 'Parking',
  pets: 'Pets',
  common_property: 'Common Property',
  levy_inquiry: 'Levy Inquiry',
  insurance: 'Insurance',
  by_laws: 'By-Laws',
  meeting_inquiry: 'Meeting Inquiry',
  other: 'Other',
};

export function TaskTags({ task }: TaskTagsProps) {
  return (
    <HStack spacing={2} mb={4} flexWrap="wrap">
      <Tag
        size="md"
        colorScheme={
          task.status === 'resolved' || task.status === 'closed'
            ? 'green'
            : task.status === 'in_progress'
              ? 'blue'
              : 'gray'
        }
        textTransform="capitalize"
      >
        {task.status.replace(/_/g, ' ')}
      </Tag>
      <Tag
        size="md"
        colorScheme={priorityColors[task.priority]}
        textTransform="capitalize"
      >
        {task.priority}
      </Tag>
      {task.category && (
        <Tag
          size="md"
          colorScheme="purple"
          textTransform="capitalize"
        >
          {categoryLabels[task.category]}
        </Tag>
      )}
    </HStack>
  );
}