'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiSearch,
  FiTool,
  FiActivity,
  FiCheckCircle,
} from 'react-icons/fi';
import { FilterSidebar, FilterField } from '@/components/common/FilterSidebar';
import { DirectoryLayout } from '@/components/common/DirectoryLayout';
import { TradesTable } from '@/components/directory/TradesTable';
import { TRADE_TYPE_OPTIONS, TRADE_STATUS_OPTIONS } from '@/lib/tradeOptions';
import type { Trade } from '@/types/trades';

// Import sample data
import tradesData from '@/data/trades.json';

interface TradesDirectoryProps {
  onEditTrade?: (trade: Trade) => void;
  onDeleteTrade?: (tradeId: string) => void;
  onCreateTrade?: () => void;
}

export function TradesDirectory({ 
  onEditTrade, 
  onDeleteTrade, 
  onCreateTrade 
}: TradesDirectoryProps) {
  const [trades] = useState<Trade[]>(tradesData as Trade[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradeType, setSelectedTradeType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showPreferredOnly, setShowPreferredOnly] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  // Filter and search trades
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          trade.company_name.toLowerCase().includes(searchLower) ||
          trade.contact_name.toLowerCase().includes(searchLower) ||
          trade.contact_email?.toLowerCase().includes(searchLower) ||
          trade.contact_phone?.includes(searchQuery);
        
        if (!matchesSearch) return false;
      }

      // Trade type filter
      if (selectedTradeType && selectedTradeType !== 'all' && trade.trade_type !== selectedTradeType) {
        return false;
      }

      // Status filter
      if (selectedStatus && selectedStatus !== 'all' && trade.status !== selectedStatus) {
        return false;
      }

      // Preferred filter
      if (showPreferredOnly && !trade.preferred) {
        return false;
      }

      return true;
    });
  }, [trades, searchQuery, selectedTradeType, selectedStatus, showPreferredOnly]);

  // Check if any filters are active
  const hasActiveFilters = !!(
    searchQuery ||
    (selectedTradeType && selectedTradeType !== '' && selectedTradeType !== 'all') ||
    (selectedStatus && selectedStatus !== '' && selectedStatus !== 'all') ||
    showPreferredOnly
  );

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTradeType('');
    setSelectedStatus('');
    setShowPreferredOnly(false);
  };

  const filters: FilterField[] = [
    {
      id: 'search',
      label: 'Search',
      type: 'search',
      value: searchQuery,
      onChange: setSearchQuery,
      icon: FiSearch,
      placeholder: 'Search trades, contacts...',
    },
    {
      id: 'trade_type',
      label: 'Trade Type',
      type: 'select',
      options: TRADE_TYPE_OPTIONS,
      value: selectedTradeType,
      onChange: setSelectedTradeType,
      icon: FiTool,
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: TRADE_STATUS_OPTIONS,
      value: selectedStatus,
      onChange: setSelectedStatus,
      icon: FiActivity,
    },
    {
      id: 'preferred',
      label: 'Preferred Trades Only',
      type: 'checkbox',
      value: showPreferredOnly,
      onChange: setShowPreferredOnly,
      icon: FiCheckCircle,
      colorScheme: showPreferredOnly ? 'yellow' : undefined,
    },
  ];

  return (
    <DirectoryLayout
      sidebar={
        <FilterSidebar
          title="Filter Trades"
          filters={filters}
          isCollapsed={isFilterCollapsed}
          onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />
      }
    >
      {/* Main Content Area */}
      <Box flex={1} overflow="hidden" display="flex" flexDirection="column">
        {/* Header */}
        <Box p={6} borderBottom="1px" borderColor="gray.200" bg="white">
          <HStack justify="space-between" mb={2}>
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="600" color="gray.900">
                Trades Directory
              </Text>
              <Text fontSize="sm" color="gray.600">
                Manage contractors and service providers
              </Text>
            </VStack>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onCreateTrade}
            >
              Add Trade
            </Button>
          </HStack>

          {/* Results Summary */}
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Showing {filteredTrades.length} of {trades.length} trades
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme="green">
                {trades.filter(t => t.status === 'active').length} Active
              </Badge>
              <Badge colorScheme="orange">
                {trades.filter(t => t.status === 'pending').length} Pending
              </Badge>
              <Badge colorScheme="gray">
                {trades.filter(t => t.status === 'inactive').length} Inactive
              </Badge>
            </HStack>
          </HStack>
        </Box>

        {/* Scrollable Content Area */}
        <Box flex={1} overflow="auto" p={6}>
          <Card>
            <TradesTable
              trades={filteredTrades}
              onEditTrade={onEditTrade}
              onDeleteTrade={onDeleteTrade}
            />
          </Card>
        </Box>
      </Box>
    </DirectoryLayout>
  );
}