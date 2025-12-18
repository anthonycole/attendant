'use client';

import React from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Avatar,
  Tooltip,
  Spinner,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Select,
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
import { FiUser, FiSend, FiMoreVertical, FiTrash2, FiArchive, FiGitMerge } from 'react-icons/fi';
import { useInbox } from '@/contexts/TasksContext';
import { useRouter } from 'next/navigation';
import type { TaskWithDetails } from '@/types/schema';
import { InlineSelectTag } from '@/components/ui/InlineSelectTag';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from '@/lib/taskOptions';
import { useTaskUpdates } from '@/hooks/useTaskUpdates';

interface TaskHeaderProps {
  task: TaskWithDetails;
}

export function TaskHeader({ task }: TaskHeaderProps) {
  const router = useRouter();
  const { toggleProfile, profileOpen, toggleCompose, tasks } = useInbox();
  const {
    task: currentTask,
    isUpdating,
    updateStatus,
    updatePriority,
    updateCategory
  } = useTaskUpdates(task);
  
  // State for merge task functionality
  const [mergeTargetId, setMergeTargetId] = React.useState('');
  const [isMergePopoverOpen, setIsMergePopoverOpen] = React.useState(false);

  const handleSendCommunication = () => {
    toggleCompose(true);
    router.push(`/tasks/${task.id}/compose`);
  };

  const handleMergeTask = () => {
    // TODO: Implement API call to merge tasks
    console.log('Merging task', task.id, 'into', mergeTargetId);
    setMergeTargetId('');
    setIsMergePopoverOpen(false);
  };

  const handleMergeClick = () => {
    setIsMergePopoverOpen(true);
  };

  // Filter out the current task from available merge targets
  const availableTasks = tasks.filter(t => t.id !== task.id);

  return (
    <Box p={6} borderBottom="1px" borderColor="gray.200">
      {/* Main header with title and actions */}
      <HStack justify="space-between" align="flex-start" spacing={4} mb={4}>
        {/* Left side - Task title and tags */}
        <VStack align="stretch" spacing={2} flex={1} minW={0}>
          <Tooltip label={currentTask.subject} hasArrow placement="top-start">
            <Text 
              fontSize="lg" 
              fontWeight="600" 
              noOfLines={2}
              lineHeight="shorter"
              wordBreak="break-word"
              overflowWrap="break-word"
              color="gray.900"
            >
              {currentTask.subject}
            </Text>
          </Tooltip>
          
          {/* Status, Priority, Category Tags and Actions */}
          <HStack spacing={2} flexWrap="wrap" align="center">
            <InlineSelectTag
              value={currentTask.status}
              options={STATUS_OPTIONS}
              onChange={updateStatus}
              disabled={isUpdating}
            />
            
            <InlineSelectTag
              value={currentTask.priority}
              options={PRIORITY_OPTIONS}
              onChange={updatePriority}
              disabled={isUpdating}
            />
            
            {currentTask.category && (
              <InlineSelectTag
                value={currentTask.category}
                options={CATEGORY_OPTIONS}
                onChange={updateCategory}
                disabled={isUpdating}
              />
            )}
            
            {/* Actions Menu - Small style to match tags */}
            <Menu>
              <MenuButton
                as={Button}
                size="xs"
                variant="outline"
                rightIcon={<FiMoreVertical />}
                fontSize="xs"
                px={2}
                h="24px"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400", bg: "gray.50" }}
              >
                Actions
              </MenuButton>
              <MenuList fontSize="sm">
                <MenuItem icon={<FiSend />} onClick={handleSendCommunication}>
                  Send Communication
                </MenuItem>
                <MenuItem icon={<FiGitMerge />} onClick={handleMergeClick}>
                  Merge Task
                </MenuItem>
                <MenuItem icon={<FiArchive />}>
                  Archive Task
                </MenuItem>
                <MenuItem icon={<FiTrash2 />} color="red.500">
                  Delete Task
                </MenuItem>
              </MenuList>
            </Menu>
            
            {/* Show loading indicator when updating */}
            {isUpdating && (
              <Spinner size="sm" color="blue.500" />
            )}
          </HStack>
        </VStack>

        {/* Right side - Empty for now */}
        <Box />
      </HStack>

      {/* Customer info line */}
      {currentTask.customer && (
        <HStack spacing={3} py={2} borderTop="1px" borderColor="gray.100">
          <Avatar
            size="xs"
            bg="blue.100"
            color="blue.600"
            icon={<FiUser size="12px" />}
          />
          <Link
            onClick={() => toggleProfile(true)}
            cursor="pointer"
            _hover={{ textDecoration: "underline", color: "blue.600" }}
            fontSize="sm"
            fontWeight="500"
            color="gray.700"
          >
            {currentTask.customer.first_name} {currentTask.customer.last_name}
          </Link>
          <Text fontSize="sm" color="gray.500">
            Unit {currentTask.customer.unit_number} • {currentTask.customer.customer_type?.replace(/_/g, ' ') || 'Owner'}
          </Text>
        </HStack>
      )}

      {/* Merge Task Popover */}
      <PopoverRoot isOpen={isMergePopoverOpen} onClose={() => setIsMergePopoverOpen(false)}>
        <PopoverTrigger>
          <Box />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Merge Task</PopoverHeader>
          <PopoverBody>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="xs" color="gray.600">
                Move this task into another task
              </Text>
              <Select
                placeholder="Select target task..."
                value={mergeTargetId}
                onChange={(e) => setMergeTargetId(e.target.value)}
                size="sm"
              >
                {availableTasks.map((targetTask) => (
                  <option key={targetTask.id} value={targetTask.id}>
                    #{targetTask.id} - {targetTask.subject}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="red"
                size="sm"
                onClick={handleMergeTask}
                isDisabled={!mergeTargetId}
              >
                Merge
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </Box>
  );
}