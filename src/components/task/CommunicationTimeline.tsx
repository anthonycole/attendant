'use client';

import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Tag,
} from '@chakra-ui/react';
import {
  FiMail,
  FiGlobe,
  FiArrowDown,
  FiArrowUp,
  FiPhone,
  FiMessageSquare,
} from 'react-icons/fi';
import type { Communication } from '@/types/schema';
import type { CommunicationActivity, ChannelType } from '@/types';

interface CommunicationTimelineProps {
  communications: Array<{ type: 'communication' | 'mock'; data: Communication | CommunicationActivity }>;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function getChannelIcon(channelType: string) {
  switch (channelType) {
    case 'email':
      return FiMail;
    case 'web':
      return FiGlobe;
    case 'phone':
      return FiPhone;
    case 'sms':
      return FiMessageSquare;
    default:
      return null;
  }
}

function CommunicationMessage({ 
  activity, 
  communication,
  isLast = false
}: { 
  activity?: CommunicationActivity; 
  communication?: Communication;
  isLast?: boolean;
}) {
  const data = communication || activity;
  if (!data) return null;
  
  const isInbound = data.direction === 'inbound';
  const channelType = 'channel' in data ? data.channel : data.activity_type;
  const ChannelIcon = getChannelIcon(channelType as ChannelType);

  return (
    <HStack align="flex-start" spacing={4} position="relative" pb={isLast ? 2 : 6}>
      {/* Timeline connector line */}
      {!isLast && (
        <Box
          position="absolute"
          left="16px" // Center of avatar
          top="32px" // Start after avatar
          width="2px"
          height="calc(100% + 8px)"
          bg="gray.200"
          zIndex={0}
        />
      )}
      
      {/* Avatar/Icon */}
      <Avatar
        size="sm"
        bg={isInbound ? 'blue.50' : 'green.50'}
        color={isInbound ? 'blue.600' : 'green.600'}
        border="2px"
        borderColor={isInbound ? 'blue.100' : 'green.100'}
        icon={ChannelIcon ? <Box as={ChannelIcon} /> : <FiArrowDown />}
        zIndex={1}
        position="relative"
      />
      
      {/* Content */}
      <VStack align="stretch" flex={1} spacing={2}>
        <HStack spacing={3} align="flex-start" justify="space-between">
          <Box flex={1} minW={0}>
            <HStack spacing={2} mb={1} flexWrap="wrap" align="center">
              <Text fontSize="sm" fontWeight="600" color="gray.800" textTransform="capitalize">
                {channelType}
              </Text>
              <Box w="4px" h="4px" bg="gray.300" borderRadius="full" />
              <Text fontSize="xs" color="gray.500">
                {formatDateTime(data.timestamp)}
              </Text>
              {data.duration && (
                <>
                  <Box w="4px" h="4px" bg="gray.300" borderRadius="full" />
                  <Text fontSize="xs" color="gray.500">
                    {formatDuration(data.duration)}
                  </Text>
                </>
              )}
            </HStack>
            <Text fontSize="xs" color="gray.600" noOfLines={1}>
              {data.from} → {data.to}
            </Text>
          </Box>
          <Tag
            size="sm"
            colorScheme={isInbound ? 'blue' : 'green'}
            fontSize="xs"
            flexShrink={0}
          >
            {isInbound ? 'Received' : 'Sent'}
          </Tag>
        </HStack>

        {data.subject && (
          <Box>
            <Text 
              fontSize="md" 
              fontWeight="600" 
              color="gray.900"
              wordBreak="break-word"
              overflowWrap="break-word"
            >
              {data.subject}
            </Text>
          </Box>
        )}

        <Box>
          <Box
            bg="white"
            p={4}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="sm"
          >
            <Text
              fontSize="sm"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              overflowWrap="break-word"
              lineHeight="1.6"
              color="gray.700"
            >
              {data.body || data.notes || 'No content'}
            </Text>
          </Box>
        </Box>
      </VStack>
    </HStack>
  );
}

export function CommunicationTimeline({ communications }: CommunicationTimelineProps) {
  if (communications.length === 0) {
    return (
      <Box textAlign="center" py={12} bg="white" border="1px" borderColor="gray.200" borderRadius="md">
        <Text fontSize="sm" color="gray.500" fontWeight="500">
          No communications found
        </Text>
        <Text fontSize="xs" color="gray.400" mt={1}>
          Communications will appear here once the conversation starts
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={0} align="stretch" w="100%">
      {communications.map((item, index) => {
        const isLast = index === communications.length - 1;
        return item.type === 'communication' ? (
          <CommunicationMessage 
            key={`comm-${(item.data as Communication).id}`} 
            communication={item.data as Communication} 
            isLast={isLast}
          />
        ) : (
          <CommunicationMessage 
            key={`mock-${(item.data as CommunicationActivity).id}`} 
            activity={item.data as CommunicationActivity} 
            isLast={isLast}
          />
        );
      })}
    </VStack>
  );
}