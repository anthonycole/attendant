'use client';

import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
} from '@chakra-ui/react';
import { 
  FiFileText, 
  FiMessageCircle, 
  FiEdit, 
  FiPhone, 
  FiMail, 
  FiMessageSquare 
} from 'react-icons/fi';
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

interface ActivityItemProps {
  activity: ActivityData | Communication;
  type: 'activity' | 'communication';
}

export function ActivityItem({ activity, type }: ActivityItemProps) {
  if (type === 'communication') {
    // Render communication item from communications.json
    const communication = activity as Communication;
    return (
      <Box
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
            name={communication.from}
            bg="blue.100"
            color="blue.600"
            icon={communication.channel === 'email' ? <FiMail size="16px" /> : <FiPhone size="16px" />}
          />
          <VStack spacing={1} align="stretch" flex={1}>
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                {communication.from || 'Unknown'}
              </Text>
              <HStack spacing={2}>
                <Badge 
                  size="sm" 
                  colorScheme={communication.direction === 'inbound' ? 'green' : 'blue'}
                  variant="subtle"
                >
                  {communication.direction}
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {new Date(communication.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </HStack>
            </HStack>
            {communication.subject && (
              <Text fontSize="sm" fontWeight="500" color="gray.800" mt={1}>
                {communication.subject}
              </Text>
            )}
            <Text fontSize="sm" color="gray.600" lineHeight="1.5" mt={2}>
              {communication.body || communication.notes || 'No content'}
            </Text>
            <HStack spacing={2} mt={2}>
              <Badge size="sm" variant="outline" colorScheme="gray" textTransform="capitalize">
                {communication.channel}
              </Badge>
              {communication.duration && (
                <Text fontSize="xs" color="gray.500">
                  Duration: {Math.floor(communication.duration / 60)}m {communication.duration % 60}s
                </Text>
              )}
            </HStack>
          </VStack>
        </HStack>
      </Box>
    );
  }

  // Render activity item from activities.json
  const activityData = activity as ActivityData;
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_update':
        return <FiEdit size="16px" />;
      case 'communication':
        return <FiMessageCircle size="16px" />;
      case 'internal_note':
        return <FiFileText size="16px" />;
      default:
        return <FiFileText size="16px" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'status_update':
        return { bg: 'green.100', color: 'green.600' };
      case 'communication':
        return { bg: 'blue.100', color: 'blue.600' };
      case 'internal_note':
        return { bg: 'purple.100', color: 'purple.600' };
      default:
        return { bg: 'gray.100', color: 'gray.600' };
    }
  };

  const colors = getActivityColor(activityData.type);

  return (
    <Box
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
          bg={colors.bg}
          color={colors.color}
          icon={getActivityIcon(activityData.type)}
        />
        <VStack spacing={1} align="stretch" flex={1}>
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="500" color="gray.700">
              {activityData.author}
            </Text>
            <HStack spacing={2}>
              <Badge 
                size="sm" 
                colorScheme={activityData.type === 'status_update' ? 'green' : activityData.type === 'communication' ? 'blue' : 'purple'}
                variant="subtle"
                textTransform="capitalize"
              >
                {activityData.type.replace('_', ' ')}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {new Date(activityData.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </HStack>
          </HStack>
          
          {activityData.status_change && (
            <Box bg="green.50" border="1px" borderColor="green.200" borderRadius="md" p={2} mt={1}>
              <Text fontSize="xs" color="green.700" fontWeight="500">
                Status changed: {activityData.status_change.from.replace('_', ' ')} → {activityData.status_change.to.replace('_', ' ')}
              </Text>
            </Box>
          )}

          <Text fontSize="sm" color="gray.600" lineHeight="1.5" mt={2}>
            {activityData.content}
          </Text>

          {activityData.communication_details && (
            <HStack spacing={2} mt={2}>
              <Badge size="sm" variant="outline" colorScheme="blue" textTransform="capitalize">
                {activityData.communication_details.channel}
              </Badge>
              <Badge 
                size="sm" 
                variant="outline" 
                colorScheme={activityData.communication_details.direction === 'inbound' ? 'green' : 'orange'}
              >
                {activityData.communication_details.direction}
              </Badge>
              {activityData.communication_details.duration && (
                <Text fontSize="xs" color="gray.500">
                  {Math.floor(activityData.communication_details.duration / 60)}m {activityData.communication_details.duration % 60}s
                </Text>
              )}
            </HStack>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}