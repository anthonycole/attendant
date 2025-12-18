'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import {
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiGlobe,
  FiFileText,
  FiArrowDown,
  FiArrowUp,
  FiCheckCircle,
} from 'react-icons/fi';
import { useCommunications } from '@/contexts/CommunicationsContext';
import type { CommunicationWithDetails, CommunicationChannel } from '@/types/schema';

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

function getChannelIcon(channel: CommunicationChannel) {
  switch (channel) {
    case 'email':
      return FiMail;
    case 'phone':
      return FiPhone;
    case 'sms':
      return FiMessageSquare;
    case 'web':
      return FiGlobe;
    case 'internal':
      return FiFileText;
    default:
      return FiMail;
  }
}

function getChannelColor(channel: CommunicationChannel): string {
  switch (channel) {
    case 'email':
      return 'blue';
    case 'phone':
      return 'green';
    case 'sms':
      return 'purple';
    case 'web':
      return 'cyan';
    case 'internal':
      return 'gray';
    default:
      return 'gray';
  }
}

interface CommunicationListItemProps {
  communication: CommunicationWithDetails;
  selected: boolean;
  onClick: () => void;
}

const CommunicationListItem = memo(function CommunicationListItem({
  communication,
  selected,
  onClick,
}: CommunicationListItemProps) {
  const ChannelIcon = getChannelIcon(communication.channel);
  const channelColor = getChannelColor(communication.channel);

  // Determine what content to show (body, notes, or subject)
  const content =
    communication.body ||
    communication.notes ||
    communication.subject ||
    'No content';

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
      position="relative"
    >
      <VStack align="stretch" spacing={2}>
        {/* Header Row */}
        <HStack justify="space-between" align="flex-start">
          <HStack spacing={2} flex={1}>
            <Icon as={ChannelIcon} boxSize={4} color={`${channelColor}.500`} />
            <Text fontSize="sm" fontWeight="600" noOfLines={1} flex={1}>
              {communication.customer
                ? `${communication.customer.first_name} ${communication.customer.last_name}`
                : communication.from || 'Unknown'}
            </Text>
            {communication.triaged && (
              <Icon as={FiCheckCircle} boxSize={3.5} color="green.500" />
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" ml={2}>
            {formatDate(communication.timestamp)}
          </Text>
        </HStack>

        {/* Subject/Title */}
        {communication.subject && (
          <Text fontSize="sm" fontWeight="500" noOfLines={1} color="gray.800">
            {communication.subject}
          </Text>
        )}

        {/* Content Preview */}
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {content}
        </Text>

        {/* Metadata Row */}
        <HStack spacing={2} flexWrap="wrap">
          {/* Direction Badge */}
          <Badge
            size="sm"
            colorScheme={communication.direction === 'inbound' ? 'orange' : 'blue'}
            fontSize="xs"
          >
            <HStack spacing={1}>
              <Icon
                as={communication.direction === 'inbound' ? FiArrowDown : FiArrowUp}
                boxSize={2.5}
              />
              <Text>{communication.direction}</Text>
            </HStack>
          </Badge>

          {/* Channel Badge */}
          <Badge size="sm" colorScheme={channelColor} fontSize="xs">
            {communication.channel}
          </Badge>

          {/* Task Link Badge */}
          {communication.task && (
            <Badge size="sm" colorScheme="purple" fontSize="xs">
              Task #{communication.task.id.split('-')[1]}
            </Badge>
          )}

          {/* Customer Info */}
          {communication.customer?.unit_number && (
            <Text fontSize="xs" color="gray.500">
              Unit {communication.customer.unit_number}
            </Text>
          )}

          {/* Phone Call Duration */}
          {communication.channel === 'phone' && communication.duration && (
            <Text fontSize="xs" color="gray.500">
              {Math.floor(communication.duration / 60)}m {communication.duration % 60}s
            </Text>
          )}
        </HStack>
      </VStack>

      {/* Untriaged Indicator */}
      {!communication.triaged && communication.direction === 'inbound' && (
        <Box
          position="absolute"
          top={4}
          right={4}
          w={2}
          h={2}
          borderRadius="full"
          bg="red.500"
        />
      )}
    </Box>
  );
});

function CommunicationsListSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} p={4} borderBottom="1px" borderColor="gray.200">
          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between">
              <Skeleton height="20px" width="60%" />
              <Skeleton height="16px" width="15%" />
            </HStack>
            <Skeleton height="16px" width="90%" />
            <Skeleton height="16px" width="70%" />
            <HStack spacing={2}>
              <Skeleton height="20px" width="80px" />
              <Skeleton height="20px" width="60px" />
            </HStack>
          </VStack>
        </Box>
      ))}
    </>
  );
}

export function CommunicationsList() {
  const router = useRouter();
  const {
    communications,
    selectedCommunication,
    selectCommunication,
    loadingCommunications,
  } = useCommunications();

  const handleCommunicationClick = (commId: string) => {
    selectCommunication(commId);
    router.push(`/communications/${commId}`);
  };

  return (
    <Box h="100%" overflow="auto" display="flex" flexDirection="column" bg="white">
      {loadingCommunications ? (
        <CommunicationsListSkeleton />
      ) : communications.length === 0 ? (
        <Box p={8} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            No communications found
          </Text>
        </Box>
      ) : (
        communications.map((comm) => (
          <CommunicationListItem
            key={comm.id}
            communication={comm}
            selected={selectedCommunication?.id === comm.id}
            onClick={() => handleCommunicationClick(comm.id)}
          />
        ))
      )}
    </Box>
  );
}
