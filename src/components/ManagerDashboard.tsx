'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Select,
  HStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Button,
  Collapse,
  Icon,
  Flex
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTasksByCategory, useSLAs } from '@/hooks/useData';
import { ManagerMetricsCards } from './ManagerMetricsCards';
import { ManagerTasksTable } from './ManagerTasksTable';
import { calculateManagerMetrics } from '@/lib/slaUtils';
import type { TaskWithDetails } from '@/types/schema';

interface ManagerDashboardProps {
  schemeId: string;
}

export function ManagerDashboard({ schemeId }: ManagerDashboardProps) {
  const { data: allTasks, isLoading: tasksLoading } = useTasksByCategory(schemeId, 'all');
  const { data: slas, isLoading: slasLoading } = useSLAs(schemeId);

  const [selectedManager, setSelectedManager] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showMetrics, setShowMetrics] = useState(false);

  // Get unique managers from tasks
  const managers = useMemo(() => {
    if (!allTasks) return [];

    const managerMap = new Map<string, { id: string; name: string; taskCount: number }>();

    allTasks.forEach(task => {
      if (task.assigned_to) {
        const existing = managerMap.get(task.assigned_to);
        if (existing) {
          existing.taskCount++;
        } else {
          managerMap.set(task.assigned_to, {
            id: task.assigned_to,
            name: task.assigned_to, // In real app, would lookup manager name
            taskCount: 1
          });
        }
      }
    });

    return Array.from(managerMap.values()).sort((a, b) => b.taskCount - a.taskCount);
  }, [allTasks]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!allTasks) return [];
    const uniqueCategories = new Set(allTasks.map(t => t.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [allTasks]);

  // Filter tasks by manager
  const filteredTasks = useMemo(() => {
    if (!allTasks) return [];

    let tasks = allTasks;

    // Filter by manager
    if (selectedManager !== 'all') {
      if (selectedManager === 'unassigned') {
        tasks = tasks.filter(task => !task.assigned_to);
      } else {
        tasks = tasks.filter(task => task.assigned_to === selectedManager);
      }
    }

    // Filter by status
    if (statusFilter === 'active') {
      tasks = tasks.filter(task =>
        task.status !== 'resolved' && task.status !== 'closed'
      );
    } else if (statusFilter === 'resolved') {
      tasks = tasks.filter(task =>
        task.status === 'resolved' || task.status === 'closed'
      );
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      tasks = tasks.filter(task => task.priority === priorityFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      tasks = tasks.filter(task => task.category === categoryFilter);
    }

    return tasks;
  }, [allTasks, selectedManager, statusFilter, priorityFilter, categoryFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!filteredTasks || !slas) {
      return {
        totalTasks: 0,
        openTasks: 0,
        inProgressTasks: 0,
        resolvedTasks: 0,
        overdueTasks: 0,
        slaBreached: 0,
        slaAtRisk: 0,
        slaCompliant: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0,
        tasksByPriority: { urgent: 0, high: 0, medium: 0, low: 0 },
        tasksByCategory: {}
      };
    }

    return calculateManagerMetrics(filteredTasks, slas);
  }, [filteredTasks, slas]);

  // Group tasks by status for tabs
  const tasksByStatus = useMemo(() => {
    if (!filteredTasks) return { active: [], atRisk: [], breached: [] };

    const active: TaskWithDetails[] = [];
    const atRisk: TaskWithDetails[] = [];
    const breached: TaskWithDetails[] = [];

    filteredTasks.forEach(task => {
      if (task.status === 'resolved' || task.status === 'closed') return;

      // Simple categorization based on due dates for now
      // In real implementation, would use SLA calculations
      if (task.due_date && new Date(task.due_date) < new Date()) {
        breached.push(task);
      } else if (task.priority === 'urgent' || task.priority === 'high') {
        atRisk.push(task);
      } else {
        active.push(task);
      }
    });

    return { active, atRisk, breached };
  }, [filteredTasks]);

  const isLoading = tasksLoading || slasLoading;

  if (isLoading) {
    return (
      <Box py={12} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.600">Loading dashboard data...</Text>
      </Box>
    );
  }

  if (!allTasks || !slas) {
    return (
      <Alert status="warning">
        <AlertIcon />
        Unable to load dashboard data. Please try again.
      </Alert>
    );
  }

  return (
    <Box w="100%" minH="100%">
      <Container maxW="container.xl" py={6} px={{ base: 4, md: 6 }}>
        <VStack spacing={4} align="stretch" w="100%">
        {/* Compact Header with Metrics Toggle */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="md" mb={1}>Manager Dashboard</Heading>
            <Text fontSize="sm" color="gray.600">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} • {metrics.slaBreached} breached • {metrics.slaAtRisk} at risk
            </Text>
          </Box>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMetrics(!showMetrics)}
            rightIcon={<Icon as={showMetrics ? FiChevronUp : FiChevronDown} />}
          >
            {showMetrics ? 'Hide' : 'Show'} Metrics
          </Button>
        </Flex>

        {/* Collapsible Metrics */}
        <Collapse in={showMetrics} animateOpacity>
          <ManagerMetricsCards metrics={metrics} />
        </Collapse>

        {/* Prominent Filters */}
        <Box
          p={4}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          shadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Text fontWeight="semibold" fontSize="sm" color="gray.700">
              Filter Tasks
            </Text>
            <HStack spacing={3} flexWrap="wrap">
              <Box flex="1" minW="180px">
                <Text fontSize="xs" fontWeight="medium" mb={1} color="gray.600">
                  Manager
                </Text>
                <Select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  size="sm"
                  bg="white"
                >
                  <option value="all">All Managers ({allTasks.length})</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.taskCount})
                    </option>
                  ))}
                  <option value="unassigned">Unassigned ({allTasks.filter(t => !t.assigned_to).length})</option>
                </Select>
              </Box>

              <Box flex="1" minW="140px">
                <Text fontSize="xs" fontWeight="medium" mb={1} color="gray.600">
                  Status
                </Text>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="sm"
                  bg="white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="resolved">Resolved Only</option>
                </Select>
              </Box>

              <Box flex="1" minW="140px">
                <Text fontSize="xs" fontWeight="medium" mb={1} color="gray.600">
                  Priority
                </Text>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  size="sm"
                  bg="white"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </Box>

              <Box flex="1" minW="160px">
                <Text fontSize="xs" fontWeight="medium" mb={1} color="gray.600">
                  Category
                </Text>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  size="sm"
                  bg="white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category?.replace(/_/g, ' ')}
                    </option>
                  ))}
                </Select>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Tasks Table with Tabs */}
        <Box w="100%" overflow="hidden">
          <Tabs colorScheme="blue" w="100%">
            <TabList>
              <Tab>
                All Tasks
                <Badge ml={2} colorScheme="blue">{filteredTasks.length}</Badge>
              </Tab>
              <Tab>
                SLA Breached
                <Badge ml={2} colorScheme="red">{metrics.slaBreached}</Badge>
              </Tab>
              <Tab>
                At Risk
                <Badge ml={2} colorScheme="orange">{metrics.slaAtRisk}</Badge>
              </Tab>
              <Tab>
                Compliant
                <Badge ml={2} colorScheme="green">{metrics.slaCompliant}</Badge>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0} py={4}>
                <ManagerTasksTable
                  tasks={filteredTasks}
                  slas={slas}
                  schemeId={schemeId}
                />
              </TabPanel>
              <TabPanel px={0} py={4}>
                <ManagerTasksTable
                  tasks={filteredTasks.filter(task => {
                    // Filter to only breached tasks
                    return task.due_date && new Date(task.due_date) < new Date()
                      && task.status !== 'resolved' && task.status !== 'closed';
                  })}
                  slas={slas}
                  schemeId={schemeId}
                />
              </TabPanel>
              <TabPanel px={0} py={4}>
                <ManagerTasksTable
                  tasks={filteredTasks.filter(task =>
                    task.priority === 'urgent' || task.priority === 'high'
                  )}
                  slas={slas}
                  schemeId={schemeId}
                />
              </TabPanel>
              <TabPanel px={0} py={4}>
                <ManagerTasksTable
                  tasks={filteredTasks.filter(task =>
                    task.status !== 'resolved' && task.status !== 'closed' &&
                    (!task.due_date || new Date(task.due_date) >= new Date())
                  )}
                  slas={slas}
                  schemeId={schemeId}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        </VStack>
      </Container>
    </Box>
  );
}
