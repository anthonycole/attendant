'use client';

import { memo, useCallback } from 'react';
import {
  Box,
  Text,
  Tag,
  HStack,
  VStack,
  Skeleton,
  Icon,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useInbox } from '@/contexts/TasksContext';
import type { TaskWithDetails } from '@/types/schema';
import { getStatusIcon, getPriorityIcon, getStatusColorScheme, getPriorityColorScheme } from '@/lib/taskIcons';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

interface TicketListItemProps {
  ticket: TaskWithDetails;
  selected: boolean;
  onClick: () => void;
}

const TicketListItem = memo(function TicketListItem({ ticket, selected, onClick }: TicketListItemProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="100%"
      textAlign="left"
      borderBottom="1px"
      borderColor="gray.200"
      borderLeft={selected ? '4px' : '0'}
      borderLeftColor={selected ? 'brand.400' : 'transparent'}
      bg={selected ? 'gray.50' : 'white'}
      _hover={{ bg: 'gray.50' }}
      transition="all 0.2s"
      p={4}
    >
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between" align="flex-start">
          <Text fontSize="sm" fontWeight="bold" noOfLines={1} flex={1} mr={2}>
            {ticket.subject}
          </Text>
          <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
            {formatDate(ticket.created_at)}
          </Text>
        </HStack>

        <Text
          fontSize="sm"
          color="gray.600"
          noOfLines={2}
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {ticket.latest_communication?.body || ticket.description || 'No messages'}
        </Text>

        <HStack spacing={2} flexWrap="wrap">
          <Tag
            size="sm"
            colorScheme={getStatusColorScheme(ticket.status)}
            textTransform="capitalize"
            fontSize="xs"
          >
            <HStack spacing={1}>
              <Icon as={getStatusIcon(ticket.status)} boxSize={2.5} />
              <Text>{ticket.status.replace(/_/g, ' ')}</Text>
            </HStack>
          </Tag>
          <Tag
            size="sm"
            colorScheme={getPriorityColorScheme(ticket.priority)}
            textTransform="capitalize"
            fontSize="xs"
          >
            <HStack spacing={1}>
              <Icon as={getPriorityIcon(ticket.priority)} boxSize={2.5} />
              <Text>{ticket.priority}</Text>
            </HStack>
          </Tag>
          {ticket.communication_count && ticket.communication_count > 0 && (
            <Tag
              size="sm"
              colorScheme="gray"
              fontSize="xs"
            >
              {ticket.communication_count} message{ticket.communication_count > 1 ? 's' : ''}
            </Tag>
          )}
        </HStack>

        {ticket.customer && (
          <Text fontSize="xs" color="gray.500">
            {ticket.customer.first_name} {ticket.customer.last_name} • Unit{' '}
            {ticket.customer.unit_number}
          </Text>
        )}
      </VStack>
    </Box>
  );
});

function TicketListSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} p={4} borderBottom="1px" borderColor="gray.200">
          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between" align="flex-start">
              <Skeleton height="20px" width="60%" />
              <Skeleton height="16px" width="15%" />
            </HStack>
            <Skeleton height="16px" width="90%" />
            <Skeleton height="16px" width="70%" />
            <HStack spacing={2}>
              <Skeleton height="24px" width="80px" />
              <Skeleton height="24px" width="70px" />
              <Skeleton height="24px" width="90px" />
            </HStack>
          </VStack>
        </Box>
      ))}
    </>
  );
}

export function ThreadList() {
  const { tasks, selectedTaskId, navigateToTask, selectedCategory, loadingTasks } = useInbox();

  const handleTicketSelect = useCallback((ticketId: string) => {
    navigateToTask(ticketId);
  }, [navigateToTask]);

  return (
    <Box
      h="100%"
      overflow="auto"
      display="flex"
      flexDirection="column"
      bg="white"
    >
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <Text fontSize="lg" fontWeight="bold" textTransform="capitalize">
          {selectedCategory === 'all' ? 'All Tasks' : selectedCategory.replace(/_/g, ' ')}
        </Text>
          {loadingTasks ? (
            <Skeleton height="14px" width="100px" display="inline-block" />
          ) : (
            <Text fontSize="xs" color="gray.500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </Text>
          )}
      </Box>

      <Box flex={1} overflow="auto">
        {loadingTasks ? (
          <TicketListSkeleton />
        ) : tasks.length === 0 ? (
          <Box p={8} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              No tasks found in this category
            </Text>
          </Box>
        ) : (
          tasks.map((task) => (
            <TicketListItem
              key={task.id}
              ticket={task}
              selected={selectedTaskId === task.id}
              onClick={() => handleTicketSelect(task.id)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
