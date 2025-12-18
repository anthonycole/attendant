'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  HStack,
  VStack,
  Text,
  Badge,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiPhone,
  FiMail,
  FiStar,
} from 'react-icons/fi';
import { DataTable } from '@/components/common/DataTable';
import { getTradeTypeOption, getTradeStatusOption } from '@/lib/tradeOptions';
import type { Trade } from '@/types/trades';

interface TradesTableProps {
  trades: Trade[];
  onEditTrade?: (trade: Trade) => void;
  onDeleteTrade?: (tradeId: string) => void;
  isLoading?: boolean;
}

export function TradesTable({
  trades,
  onEditTrade,
  onDeleteTrade,
  isLoading = false,
}: TradesTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating?: number | null) => {
    if (!rating) return <Text fontSize="xs" color="gray.400">Not rated</Text>;

    return (
      <HStack spacing={0}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size="12px"
            fill={star <= rating ? '#F6AD55' : 'none'}
            color={star <= rating ? '#F6AD55' : '#E2E8F0'}
          />
        ))}
        <Text fontSize="xs" ml={1} color="gray.600">
          ({rating})
        </Text>
      </HStack>
    );
  };

  const columns = useMemo<ColumnDef<Trade>[]>(
    () => [
      {
        id: 'company',
        header: 'Company & Contact',
        accessorFn: (row) => row.company_name,
        size: 280,
        minSize: 200,
        cell: ({ row }) => {
          const trade = row.original;
          const tradeTypeOption = getTradeTypeOption(trade.trade_type);
          const Icon = tradeTypeOption?.icon || FiMoreVertical;

          return (
            <HStack spacing={3}>
              <Avatar
                size="sm"
                bg={`${tradeTypeOption?.colorScheme || 'gray'}.100`}
                color={`${tradeTypeOption?.colorScheme || 'gray'}.600`}
                icon={<Icon size="16px" />}
              />
              <VStack align="start" spacing={0.5}>
                <Text fontWeight="500" fontSize="sm" noOfLines={1}>
                  {trade.company_name}
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  {trade.contact_name}
                </Text>
                {trade.preferred && (
                  <Badge
                    size="sm"
                    colorScheme="yellow"
                    variant="subtle"
                    alignSelf="flex-start"
                  >
                    Preferred
                  </Badge>
                )}
              </VStack>
            </HStack>
          );
        },
      },
      {
        id: 'trade_type',
        header: 'Trade Type',
        accessorFn: (row) => row.trade_type,
        cell: ({ row }) => {
          const trade = row.original;
          const tradeTypeOption = getTradeTypeOption(trade.trade_type);

          return (
            <Badge colorScheme={tradeTypeOption?.colorScheme || 'gray'} variant="subtle">
              {tradeTypeOption?.label || trade.trade_type}
            </Badge>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => row.status,
        cell: ({ row }) => {
          const trade = row.original;
          const statusOption = getTradeStatusOption(trade.status);

          return (
            <Badge
              colorScheme={statusOption?.colorScheme || 'gray'}
              variant={trade.status === 'active' ? 'solid' : 'subtle'}
            >
              {statusOption?.label || trade.status}
            </Badge>
          );
        },
      },
      {
        id: 'rating',
        header: 'Rating',
        accessorFn: (row) => row.rating || 0,
        cell: ({ row }) => renderStars(row.original.rating),
      },
      {
        id: 'rates',
        header: 'Rates',
        accessorFn: (row) => row.hourly_rate || 0,
        cell: ({ row }) => {
          const trade = row.original;

          return (
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" fontWeight="500">
                {trade.hourly_rate ? formatCurrency(trade.hourly_rate) + '/hr' : 'TBD'}
              </Text>
              {trade.callout_fee && (
                <Text fontSize="xs" color="gray.600">
                  {formatCurrency(trade.callout_fee)} callout
                </Text>
              )}
            </VStack>
          );
        },
      },
      {
        id: 'contact',
        header: 'Contact Info',
        cell: ({ row }) => {
          const trade = row.original;

          return (
            <HStack spacing={2}>
              {trade.contact_phone && (
                <Tooltip label={trade.contact_phone}>
                  <IconButton
                    aria-label="Call"
                    icon={<FiPhone />}
                    size="xs"
                    variant="ghost"
                    as="a"
                    href={`tel:${trade.contact_phone}`}
                  />
                </Tooltip>
              )}
              {trade.contact_email && (
                <Tooltip label={trade.contact_email}>
                  <IconButton
                    aria-label="Email"
                    icon={<FiMail />}
                    size="xs"
                    variant="ghost"
                    as="a"
                    href={`mailto:${trade.contact_email}`}
                  />
                </Tooltip>
              )}
            </HStack>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const trade = row.original;

          return (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                size="sm"
                variant="ghost"
                aria-label="Actions"
              />
              <MenuList>
                <MenuItem icon={<FiEdit />} onClick={() => onEditTrade?.(trade)}>
                  Edit Trade
                </MenuItem>
                <MenuItem
                  icon={<FiTrash2 />}
                  color="red.500"
                  onClick={() => onDeleteTrade?.(trade.id)}
                >
                  Delete Trade
                </MenuItem>
              </MenuList>
            </Menu>
          );
        },
      },
    ],
    [onEditTrade, onDeleteTrade]
  );

  return (
    <DataTable
      data={trades}
      columns={columns}
      enableSorting
      emptyMessage="No trades found. Try adjusting your search criteria or add a new trade."
      isLoading={isLoading}
    />
  );
}
