'use client'

import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  Checkbox,
  IconButton,
  Badge,
} from '@chakra-ui/react'
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
} from '@/components/ui/popover'
import { FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from 'react-icons/fi'
import type { IconType } from 'react-icons'

export interface FilterField {
  id: string
  label: string
  type: 'search' | 'select' | 'multi-select' | 'checkbox'
  options?: Array<{ value: string; label: string; colorScheme?: string }>
  value?: any
  onChange: (value: any) => void
  icon?: IconType
  colorScheme?: string
  placeholder?: string
}

interface FilterSidebarProps {
  title: string
  filters: FilterField[]
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  hasActiveFilters?: boolean
  onClearFilters?: () => void
  /** Force collapsed state (e.g., when detail panel is open) */
  forceCollapsed?: boolean
}

export function FilterSidebar({
  title,
  filters,
  isCollapsed = false,
  onToggleCollapse,
  hasActiveFilters = false,
  onClearFilters,
  forceCollapsed = false,
}: FilterSidebarProps) {
  const effectivelyCollapsed = isCollapsed || forceCollapsed

  const getFilterIcon = (filter: FilterField): IconType => {
    if (filter.icon) return filter.icon
    if (filter.type === 'search') return FiSearch
    return FiFilter
  }

  const getFilterColorScheme = (filter: FilterField): string => {
    if (filter.colorScheme) return filter.colorScheme

    // Auto-detect active state
    if (filter.type === 'search' && filter.value) return 'green'
    if (filter.type === 'select' && filter.value && filter.value !== '' && filter.value !== 'all') return 'blue'
    if (filter.type === 'checkbox' && filter.value) return 'purple'

    return 'gray'
  }

  const renderFilter = (filter: FilterField, compact = false) => {
    switch (filter.type) {
      case 'search':
        return (
          <Input
            placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
            value={filter.value || ''}
            onChange={(e) => filter.onChange(e.target.value)}
            size="sm"
            bg="white"
          />
        )

      case 'select':
        return (
          <Select
            value={filter.value || ''}
            onChange={(e) => filter.onChange(e.target.value)}
            size="sm"
            bg="white"
            border="1px solid"
            borderColor="gray.300"
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )

      case 'multi-select':
        return (
          <VStack align="stretch" spacing={1}>
            {filter.options?.map((option) => (
              <Checkbox
                key={option.value}
                isChecked={filter.value?.includes(option.value)}
                onChange={(e) => {
                  const currentValue = filter.value || []
                  if (e.target.checked) {
                    filter.onChange([...currentValue, option.value])
                  } else {
                    filter.onChange(currentValue.filter((v: string) => v !== option.value))
                  }
                }}
                size="sm"
              >
                {option.label}
              </Checkbox>
            ))}
          </VStack>
        )

      case 'checkbox':
        return (
          <Checkbox
            isChecked={filter.value || false}
            onChange={(e) => filter.onChange(e.target.checked)}
            size="sm"
          >
            {filter.label}
          </Checkbox>
        )

      default:
        return null
    }
  }

  return (
    <Box
      w={effectivelyCollapsed ? '40px' : '220px'}
      borderRight="1px"
      borderColor="gray.200"
      bg="gray.50"
      transition="width 0.2s ease"
      overflow="hidden"
      flexShrink={0}
    >
      <VStack spacing={0} h="100%">
        {/* Sidebar Header */}
        <HStack
          justify="space-between"
          p={3}
          borderBottom="1px"
          borderColor="gray.200"
          w="100%"
          bg="white"
        >
          {!effectivelyCollapsed && (
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              {title}
            </Text>
          )}
          <IconButton
            aria-label={effectivelyCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            icon={effectivelyCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            size="xs"
            variant="ghost"
            onClick={onToggleCollapse}
          />
        </HStack>

        {/* Sidebar Content */}
        <Box flex={1} p={effectivelyCollapsed ? 1 : 3} w="100%">
          {effectivelyCollapsed ? (
            <VStack spacing={2}>
              {/* Collapsed: Individual filter popovers */}
              {filters.map((filter) => {
                const Icon = getFilterIcon(filter)
                const colorScheme = getFilterColorScheme(filter)

                return (
                  <PopoverRoot key={filter.id}>
                    <PopoverTrigger>
                      <IconButton
                        aria-label={`Filter by ${filter.label}`}
                        icon={<Icon />}
                        size="sm"
                        variant="ghost"
                        colorScheme={colorScheme}
                      />
                    </PopoverTrigger>
                    <PopoverContent w="200px">
                      <PopoverArrow />
                      <PopoverHeader>
                        <Text fontSize="sm" fontWeight="600">{filter.label}</Text>
                      </PopoverHeader>
                      <PopoverBody>
                        {renderFilter(filter, true)}
                      </PopoverBody>
                    </PopoverContent>
                  </PopoverRoot>
                )
              })}

              {/* Clear filters button when collapsed and filters are active */}
              {hasActiveFilters && onClearFilters && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={onClearFilters}
                >
                  ✕
                </Button>
              )}
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              {/* Expanded: Full filter controls */}
              {filters.map((filter) => {
                if (filter.type === 'checkbox') {
                  return (
                    <Box key={filter.id}>
                      <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>
                        {filter.label.toUpperCase()}
                      </Text>
                      {renderFilter(filter)}
                    </Box>
                  )
                }

                return (
                  <Box key={filter.id}>
                    <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>
                      {filter.label.toUpperCase()}
                    </Text>
                    {renderFilter(filter)}
                  </Box>
                )
              })}

              {/* Active Filters Summary */}
              {hasActiveFilters && onClearFilters && (
                <Box pt={2} borderTop="1px" borderColor="gray.200">
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="gray"
                    w="100%"
                    onClick={onClearFilters}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              )}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  )
}