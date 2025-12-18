'use client';

import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { InlineTipTapEditor } from './InlineTipTapEditor';

interface TaskUpdate {
  id: string;
  task_id: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

interface TaskUpdateProps {
  taskId: string;
  updates: TaskUpdate[];
  onAddUpdate: (content: string) => void;
}

export function TaskUpdate({ taskId, updates, onAddUpdate }: TaskUpdateProps) {
  const handleAddUpdate = (content: string) => {
    onAddUpdate(content);
  };

  return (
    <Box>
      {/* Inline TipTap Editor - Always visible */}
      <InlineTipTapEditor
        taskId={taskId}
        onAddUpdate={handleAddUpdate}
      />

      {/* Updates List */}
      {updates.length > 0 && (
        <VStack spacing={3} align="stretch">
          {updates.map((update) => (
            <Box
              key={update.id}
              p={4}
              bg="white"
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              shadow="sm"
            >
              <HStack align="flex-start" spacing={3}>
                <Avatar
                  size="sm"
                  bg="blue.100"
                  color="blue.600"
                  icon={<FiUser size="16px" />}
                />
                <VStack spacing={1} align="stretch" flex={1}>
                  <HStack justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight="500" color="gray.700">
                      {update.author}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(update.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.800" lineHeight="1.4">
                    {update.content}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

// Mock data generator for updates
export function generateMockUpdates(taskId: string): TaskUpdate[] {
  return [
    {
      id: `update-${taskId}-1`,
      task_id: taskId,
      content: "Contacted the maintenance team and scheduled a visit for tomorrow morning. They'll assess the leak and provide a quote for repairs.",
      author: "Sarah Mitchell",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: `update-${taskId}-2`,
      task_id: taskId,
      content: "Resident confirmed they'll be available between 9-11 AM for the inspection. Updated their preferred contact method to SMS.",
      author: "Sarah Mitchell", 
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}