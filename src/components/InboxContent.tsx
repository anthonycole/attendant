'use client';

import React, { useState } from 'react';
import {
  Box,
  Text,
  Button,
  Select,
  HStack,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
} from '@/components/ui/popover';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { MainLayout } from '@/components/MainLayout';
import { ThreadList } from '@/components/ThreadList';
import { ThreadView } from '@/components/ThreadView';
import { CustomerProfileDrawer } from '@/components/CustomerProfileDrawer';
import { CreateIssueDrawer } from '@/components/CreateIssueDrawer';
import { CommunicationComposer } from '@/components/CommunicationComposer';
import { useInbox } from '@/contexts/TasksContext';
import type { TaskCategory, TaskPriority } from '@/types/schema';

export function InboxContent() {
  const {
    selectedTaskId,
    profileOpen,
    composeOpen,
    selectedTask,
    toggleProfile,
    toggleCompose,
    selectedCategory,
    setSelectedCategory,
    selectedPriorities,
    setSelectedPriorities,
    hasActiveFilters,
    clearAllFilters
  } = useInbox();
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [filterSidebarCollapsed, setFilterSidebarCollapsed] = useState(false);
  const [taskListCollapsed, setTaskListCollapsed] = useState(false);

  const categoryOptions: { value: TaskCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repairs', label: 'Repairs' },
    { value: 'noise_complaint', label: 'Noise Complaint' },
    { value: 'parking', label: 'Parking' },
    { value: 'pets', label: 'Pets' },
    { value: 'common_property', label: 'Common Property' },
    { value: 'levy_inquiry', label: 'Levy Inquiry' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'by_laws', label: 'By-Laws' },
    { value: 'meeting_inquiry', label: 'Meeting Inquiry' },
    { value: 'other', label: 'Other' },
  ];

  const priorityOptions: { value: TaskPriority | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Priorities', color: 'gray' },
    { value: 'urgent', label: 'Urgent', color: 'red' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'medium', label: 'Medium', color: 'blue' },
    { value: 'low', label: 'Low', color: 'gray' },
  ];

  const handleCreateClick = () => {
    setCreateDrawerOpen(true);
  };

  // Main content area with collapsible filter sidebar + three-column layout
  const inboxContent = (
    <Box h="100%" display="flex" overflow="hidden">
      {/* Collapsible Filter Sidebar */}
      <Box
        w={filterSidebarCollapsed || profileOpen || composeOpen ? "40px" : "220px"}
        borderRight="1px"
        borderColor="gray.200"
        bg="gray.50"
        transition="width 0.2s ease"
        overflow="hidden"
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
            {!(filterSidebarCollapsed || profileOpen || composeOpen) && (
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                Filter Tasks
              </Text>
            )}
            <IconButton
              aria-label={(filterSidebarCollapsed || profileOpen || composeOpen) ? "Expand sidebar" : "Collapse sidebar"}
              icon={(filterSidebarCollapsed || profileOpen || composeOpen) ? <FiChevronRight /> : <FiChevronLeft />}
              size="xs"
              variant="ghost"
              onClick={() => setFilterSidebarCollapsed(!filterSidebarCollapsed)}
            />
          </HStack>

          {/* Sidebar Content */}
          <Box flex={1} p={(filterSidebarCollapsed || profileOpen || composeOpen) ? 1 : 3} w="100%">
            {(filterSidebarCollapsed || profileOpen || composeOpen) ? (
              <VStack spacing={2}>
                <PopoverRoot>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Filter by category"
                      icon={<FiFilter />}
                      size="sm"
                      variant="ghost"
                      colorScheme={hasActiveFilters ? 'blue' : 'gray'}
                    />
                  </PopoverTrigger>
                  <PopoverContent w="200px">
                    <PopoverArrow />
                    <PopoverHeader>
                      <Text fontSize="sm" fontWeight="600">Category Filter</Text>
                    </PopoverHeader>
                    <PopoverBody>
                      <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'all')}
                        size="sm"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>

                <PopoverRoot>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Filter by priority"
                      icon={<FiFilter />}
                      size="sm"
                      variant="ghost"
                      colorScheme={selectedPriorities.length > 0 ? 'orange' : 'gray'}
                    />
                  </PopoverTrigger>
                  <PopoverContent w="200px">
                    <PopoverArrow />
                    <PopoverHeader>
                      <Text fontSize="sm" fontWeight="600">Priority Filter</Text>
                    </PopoverHeader>
                    <PopoverBody>
                      <Select
                        value={selectedPriorities.length === 0 ? 'all' : selectedPriorities[0]}
                        onChange={(e) => {
                          const value = e.target.value as TaskPriority | 'all';
                          if (value === 'all') {
                            setSelectedPriorities([]);
                          } else {
                            setSelectedPriorities([value]);
                          }
                        }}
                        size="sm"
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>

                {/* Clear filters button when collapsed and filters are active */}
                {hasActiveFilters && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={clearAllFilters}
                  >
                    ✕
                  </Button>
                )}
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>
                    CATEGORY
                  </Text>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'all')}
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>
                    PRIORITY
                  </Text>
                  <Select
                    value={selectedPriorities.length === 0 ? 'all' : selectedPriorities[0]}
                    onChange={(e) => {
                      const value = e.target.value as TaskPriority | 'all';
                      if (value === 'all') {
                        setSelectedPriorities([]);
                      } else {
                        setSelectedPriorities([value]);
                      }
                    }}
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Box>

                {/* Filter Summary */}
                {hasActiveFilters && (
                  <Box pt={2} borderTop="1px" borderColor="gray.200">
                    <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>
                      ACTIVE FILTERS
                    </Text>
                    <VStack spacing={1} align="stretch">
                      {selectedCategory !== 'all' && (
                        <HStack justify="space-between">
                          <Text fontSize="xs" color="gray.600">Category:</Text>
                          <Text fontSize="xs" fontWeight="500">
                            {categoryOptions.find(opt => opt.value === selectedCategory)?.label}
                          </Text>
                        </HStack>
                      )}
                      {selectedPriorities.length > 0 && (
                        <HStack justify="space-between">
                          <Text fontSize="xs" color="gray.600">Priority:</Text>
                          <Text fontSize="xs" fontWeight="500">
                            {priorityOptions.find(opt => opt.value === selectedPriorities[0])?.label}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="gray"
                      mt={2}
                      w="100%"
                      onClick={clearAllFilters}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                )}
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
      
      {/* Task List Column */}
      <Box
        w={
          taskListCollapsed && (profileOpen || composeOpen)
            ? "60px"  // Collapsed width when profile/compose is open and manually collapsed
            : (profileOpen || composeOpen)
              ? "260px"  // Compressed width when profile/compose is open
              : "320px"  // Full width when neither is open
        }
        borderRight="1px"
        borderColor="gray.200"
        overflow="hidden"
        transition="width 0.3s ease"
        position="relative"
      >
        {/* Collapse/Expand Button - only show when profile or compose is open */}
        {(profileOpen || composeOpen) && (
          <IconButton
            aria-label={taskListCollapsed ? "Expand task list" : "Collapse task list"}
            icon={taskListCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            size="xs"
            variant="ghost"
            position="absolute"
            top="50%"
            right="8px"
            transform="translateY(-50%)"
            zIndex={1000}
            onClick={() => setTaskListCollapsed(!taskListCollapsed)}
          />
        )}

        {/* ThreadList - hide content when collapsed */}
        <Box
          h="100%"
          opacity={taskListCollapsed && (profileOpen || composeOpen) ? 0 : 1}
          transition="opacity 0.3s ease"
        >
          <ThreadList />
        </Box>
      </Box>

      {/* Task Details Column */}
      <Box flex={1} borderRight="1px" borderColor="gray.200" overflow="hidden">
        <ThreadView />
      </Box>

      {/* Customer Profile Column (conditional) */}
      {profileOpen && selectedTask && selectedTask.customer && !composeOpen && (
        <Box w="400px" overflow="hidden">
          <CustomerProfileDrawer
            customer={selectedTask.customer}
            onClose={() => {
              toggleProfile(false);
              setTaskListCollapsed(false); // Reset collapse state when profile closes
            }}
          />
        </Box>
      )}

      {/* Communication Composer Column (conditional) */}
      {composeOpen && selectedTask && (
        <Box w="500px" overflow="hidden">
          <CommunicationComposer
            task={selectedTask}
            onClose={() => {
              toggleCompose(false);
              setTaskListCollapsed(false); // Reset collapse state when compose closes
            }}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <MainLayout 
      showCreateButton={true}
      onCreateClick={handleCreateClick}
      createButtonLabel="Create new task"
    >
      {inboxContent}
      
      {/* Modals/Drawers */}
      <CreateIssueDrawer 
        open={createDrawerOpen} 
        onClose={() => setCreateDrawerOpen(false)}
        onSubmit={(issueData) => {
          // Handle submission logic here
          console.log('New issue:', issueData);
          setCreateDrawerOpen(false);
        }}
      />
    </MainLayout>
  );
}