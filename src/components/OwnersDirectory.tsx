'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  VStack,
  HStack,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { FiMoreVertical, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'
import { FilterSidebar, FilterField } from '@/components/common/FilterSidebar'
import { DirectoryLayout } from '@/components/common/DirectoryLayout'
import { EmptyState } from '@/components/common/EmptyState'
import { Customer, CustomerType } from '@/types/schema'

interface OwnersDirectoryProps {
  customers: Customer[]
}

const customerTypeOptions = [
  { value: 'owner', label: 'Owner' },
  { value: 'tenant', label: 'Tenant' },
  { value: 'committee_member', label: 'Committee Member' },
  { value: 'proxy', label: 'Proxy' },
  { value: 'agent', label: 'Agent' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'other', label: 'Other' },
]

const getCustomerTypeColor = (type?: CustomerType) => {
  switch (type) {
    case 'owner':
      return 'blue'
    case 'committee_member':
      return 'purple'
    case 'tenant':
      return 'green'
    case 'proxy':
      return 'orange'
    case 'agent':
      return 'teal'
    case 'contractor':
      return 'red'
    default:
      return 'gray'
  }
}

const getCustomerTypeLabel = (type?: CustomerType) => {
  return customerTypeOptions.find(opt => opt.value === type)?.label || type || 'Unknown'
}

export function OwnersDirectory({ customers }: OwnersDirectoryProps) {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showCommitteeOnly, setShowCommitteeOnly] = useState(false)

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(query)
        const matchesEmail = customer.email?.toLowerCase().includes(query)
        const matchesUnit = customer.unit_number?.toLowerCase().includes(query)
        
        if (!matchesName && !matchesEmail && !matchesUnit) {
          return false
        }
      }

      // Type filter
      if (selectedType && customer.customer_type !== selectedType) {
        return false
      }

      // Committee filter
      if (showCommitteeOnly) {
        const isCommittee = customer.customer_type === 'committee_member' || 
                           (customer.metadata as any)?.committee_position ||
                           (customer.metadata as any)?.committee_role
        if (!isCommittee) {
          return false
        }
      }

      return true
    })
  }, [customers, searchQuery, selectedType, showCommitteeOnly])

  const filters: FilterField[] = [
    {
      id: 'search',
      label: 'Search',
      type: 'search',
      value: searchQuery,
      onChange: setSearchQuery,
    },
    {
      id: 'type',
      label: 'Customer Type',
      type: 'select',
      options: customerTypeOptions,
      value: selectedType,
      onChange: setSelectedType,
    },
    {
      id: 'committee',
      label: 'Committee Members Only',
      type: 'checkbox',
      value: showCommitteeOnly,
      onChange: setShowCommitteeOnly,
    },
  ]

  return (
    <DirectoryLayout
      sidebar={
        <FilterSidebar
          title="Filter Owners"
          filters={filters}
          isCollapsed={isFilterCollapsed}
          onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
        />
      }
    >
      <Box p={6}>
        <VStack align="stretch" spacing={6}>
          {/* Header */}
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              Owners Directory
            </Text>
            <Text color="gray.600">
              Manage property owners and residents
            </Text>
          </Box>

          {/* Results */}
          {filteredCustomers.length === 0 ? (
            <EmptyState
              title="No owners found"
              description="Try adjusting your search criteria or add a new owner."
            />
          ) : (
            <Box 
              borderWidth={1} 
              borderRadius="lg" 
              overflow="hidden"
              bg="white"
            >
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Owner</Th>
                    <Th>Unit</Th>
                    <Th>Type</Th>
                    <Th>Contact</Th>
                    <Th>Committee Role</Th>
                    <Th w="80px"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCustomers.map((customer) => {
                    const committeeRole = (customer.metadata as any)?.committee_position || 
                                        (customer.metadata as any)?.committee_role
                    
                    return (
                      <Tr key={customer.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar
                              size="sm"
                              name={`${customer.first_name} ${customer.last_name}`}
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">
                                {customer.first_name} {customer.last_name}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {customer.email}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">
                              Unit {customer.unit_number}
                            </Text>
                            {customer.lot_number && (
                              <Text fontSize="sm" color="gray.600">
                                Lot {customer.lot_number}
                              </Text>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getCustomerTypeColor(customer.customer_type)}
                            variant="subtle"
                          >
                            {getCustomerTypeLabel(customer.customer_type)}
                          </Badge>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            {customer.phone && (
                              <Text fontSize="sm">{customer.phone}</Text>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          {committeeRole && (
                            <Badge colorScheme="purple" variant="outline">
                              {committeeRole}
                            </Badge>
                          )}
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                              aria-label="Actions"
                            />
                            <MenuList>
                              <MenuItem icon={<FiEye />}>
                                View Details
                              </MenuItem>
                              <MenuItem icon={<FiEdit />}>
                                Edit Owner
                              </MenuItem>
                              <MenuItem icon={<FiTrash2 />} color="red.500">
                                Remove Owner
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </Box>
          )}

          {/* Results count */}
          <Text fontSize="sm" color="gray.600">
            Showing {filteredCustomers.length} of {customers.length} owners
          </Text>
        </VStack>
      </Box>
    </DirectoryLayout>
  )
}