'use client';

import React from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useInbox } from '@/contexts/TasksContext';
import { TaskHeader } from './task/TaskHeader';
import { TaskSummary } from './task/TaskSummary';
import { CommunicationHistory } from './task/CommunicationHistory';
import { EmptyState } from './common/EmptyState';
import { ThreadViewSkeleton } from './common/LoadingSkeleton';

export function ThreadView() {
  const { selectedTask, selectedTaskId, loadingTask, currentTab, navigateToTab } = useInbox();

  // Show loading state when a ticket is selected but still loading
  if (selectedTaskId && loadingTask) {
    return <ThreadViewSkeleton />;
  }

  if (!selectedTask) {
    return (
      <EmptyState
        title="No ticket selected"
        description="Select a ticket from the list to view its details and conversation history"
      />
    );
  }

  const handleTabChange = (index: number) => {
    const tab = index === 0 ? 'summary' : 'timeline';
    navigateToTab(tab);
  };

  return (
    <Box
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      minW={0}
      w="100%"
    >
      {/* Header */}
      <TaskHeader task={selectedTask} />
      
      {/* Tabbed Content */}
      <Tabs
        index={currentTab === 'summary' ? 0 : 1}
        onChange={handleTabChange}
        variant="line"
        colorScheme="blue"
        flex={1}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <TabList
          borderBottom="1px"
          borderColor="gray.200"
          bg="white"
          px={6}
          flexShrink={0}
          w="100%"
        >
          <Tab px={4} py={3} flex={1}>
            Summary
          </Tab>
          <Tab px={4} py={3} flex={1}>
            Timeline
          </Tab>
        </TabList>

        <TabPanels flex={1} overflow="hidden">
          <TabPanel h="100%" overflow="auto" p={0}>
            <Box p={6}>
              <TaskSummary task={selectedTask} />
            </Box>
          </TabPanel>

          <TabPanel h="100%" overflow="auto" p={0}>
            <CommunicationHistory task={selectedTask} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}