'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { FiMail, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FilterSidebar, FilterField } from '@/components/common/FilterSidebar';
import { CommunicationsList } from './CommunicationsList';
import { CommunicationDetail } from './CommunicationDetail';
import { useCommunications } from '@/contexts/CommunicationsContext';
import type { CommunicationChannel, CommunicationDirection } from '@/types/schema';

export function CommunicationsDashboard() {
  const {
    selectedCommunication,
    channelFilter,
    directionFilter,
    triagedFilter,
    showNeedsResponseOnly,
    setChannelFilter,
    setDirectionFilter,
    setTriagedFilter,
    setShowNeedsResponseOnly,
    clearAllFilters,
    hasActiveFilters,
    communications,
    untriagedCount,
    needsResponseCount,
  } = useCommunications();

  const [filterSidebarCollapsed, setFilterSidebarCollapsed] = useState(false);

  const channelOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms', label: 'SMS' },
    { value: 'web', label: 'Web' },
    { value: 'internal', label: 'Internal' },
  ];

  const directionOptions = [
    { value: 'inbound', label: 'Inbound' },
    { value: 'outbound', label: 'Outbound' },
  ];

  const statusOptions = [
    { value: 'false', label: 'Untriaged' },
    { value: 'true', label: 'Triaged' },
  ];

  const filters: FilterField[] = [
    {
      id: 'channel',
      label: 'Channel',
      type: 'select',
      options: channelOptions,
      value: channelFilter === 'all' ? '' : channelFilter,
      onChange: (value: string) => setChannelFilter((value || 'all') as CommunicationChannel | 'all'),
      icon: FiMail,
    },
    {
      id: 'direction',
      label: 'Direction',
      type: 'select',
      options: directionOptions,
      value: directionFilter === 'all' ? '' : directionFilter,
      onChange: (value: string) => setDirectionFilter((value || 'all') as CommunicationDirection | 'all'),
      icon: FiSend,
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      value: triagedFilter === 'all' ? '' : String(triagedFilter),
      onChange: (value: string) => {
        setTriagedFilter(value === '' ? 'all' : value === 'true');
      },
      icon: FiCheckCircle,
    },
    {
      id: 'needs_response',
      label: 'Needs Response Only',
      type: 'checkbox',
      value: showNeedsResponseOnly,
      onChange: setShowNeedsResponseOnly,
      icon: FiAlertCircle,
      colorScheme: showNeedsResponseOnly ? 'red' : undefined,
    },
  ];

  return (
    <Box h="100%" display="flex" overflow="hidden">
      {/* Filter Sidebar */}
      <FilterSidebar
        title="Filter Communications"
        filters={filters}
        isCollapsed={filterSidebarCollapsed}
        onToggleCollapse={() => setFilterSidebarCollapsed(!filterSidebarCollapsed)}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearAllFilters}
        forceCollapsed={!!selectedCommunication}
      />

      {/* Communications List */}
      <Box
        w={selectedCommunication ? '400px' : '100%'}
        flexShrink={0}
        borderRight={selectedCommunication ? '1px' : 'none'}
        borderColor="gray.200"
        overflow="hidden"
        transition="width 0.3s ease"
        h="100%"
        display="flex"
        flexDirection="column"
      >
        {/* Header with counts */}
        <Box p={3} borderBottom="1px" borderColor="gray.200" bg="white">
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight="600">
              {communications.length} Communications
            </Text>
            {untriagedCount > 0 && (
              <Badge size="sm" colorScheme="orange">
                {untriagedCount} untriaged
              </Badge>
            )}
            {needsResponseCount > 0 && (
              <Badge size="sm" colorScheme="red">
                {needsResponseCount} need response
              </Badge>
            )}
          </HStack>
        </Box>
        <Box flex={1} overflow="auto">
          <CommunicationsList />
        </Box>
      </Box>

      {/* Communication Detail Panel */}
      {selectedCommunication && (
        <Box flex={1} overflow="hidden" h="100%">
          <CommunicationDetail />
        </Box>
      )}
    </Box>
  );
}
