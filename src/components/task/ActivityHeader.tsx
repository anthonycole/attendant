'use client';

import React from 'react';
import {
  HStack,
  VStack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@/components/ui/popover';
import { FiPlus } from 'react-icons/fi';
import { SimpleTipTapEditor } from './SimpleTipTapEditor';
import type { TaskWithDetails, TaskStatus } from '@/types/schema';

interface ActivityHeaderProps {
  totalItems: number;
  task: TaskWithDetails;
  taskId: string;
  onAddUpdate: (content: string, newStatus?: TaskStatus) => void;
}

export function ActivityHeader({ totalItems, task, taskId, onAddUpdate }: ActivityHeaderProps) {
  return (
    <HStack justify="space-between" align="center">
      <VStack align="flex-start" spacing={0}>
        <Text fontSize="md" fontWeight="600" color="gray.900">
          Activity Timeline
        </Text>
        <Text fontSize="xs" color="gray.500">
          {totalItems} total items
        </Text>
      </VStack>

      {/* Add Update Popover Button */}
      <PopoverRoot>
        <PopoverTrigger>
          <IconButton
            aria-label="Add private update"
            icon={<FiPlus />}
            size="sm"
            colorScheme="blue"
            variant="outline"
          />
        </PopoverTrigger>
        <PopoverContent w="400px" mr={4}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Text fontSize="sm" fontWeight="600">Add Private Update</Text>
          </PopoverHeader>
          <PopoverBody p={3}>
            <SimpleTipTapEditor
              taskId={taskId}
              currentStatus={task.status}
              onAddUpdate={onAddUpdate}
            />
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </HStack>
  );
}