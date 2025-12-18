'use client';

import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Card,
  CardBody,
  Badge,
  Flex,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiInbox,
  FiMessageSquare,
  FiUsers,
  FiBarChart2,
  FiTool,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTasksByCategory } from '@/hooks/useData';
import { useStrataScheme } from '@/contexts/StrataSchemeContext';
import { CommandBar } from './CommandBar';
import { useCommandBar } from '@/providers/CommandBarProvider';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  badge?: string | number;
}

export function HomePage() {
  const router = useRouter();
  const { currentScheme } = useStrataScheme();
  const { data: allTasks } = useTasksByCategory(currentScheme?.id || null, 'all');
  const { isOpen, open, close } = useCommandBar();

  // Calculate quick stats
  const openTasks = allTasks?.filter(t => t.status !== 'resolved' && t.status !== 'closed').length || 0;
  const urgentTasks = allTasks?.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length || 0;
  const overdueTasks = allTasks?.filter(t =>
    t.due_date &&
    new Date(t.due_date) < new Date() &&
    t.status !== 'resolved' &&
    t.status !== 'closed'
  ).length || 0;

  const quickActions: QuickAction[] = [
    {
      id: 'tasks',
      label: 'Tasks',
      description: 'View and manage all tasks',
      icon: FiInbox,
      href: '/tasks',
      color: 'blue',
      badge: openTasks > 0 ? openTasks : undefined,
    },
    {
      id: 'managers',
      label: 'Manager Dashboard',
      description: 'SLA tracking and metrics',
      icon: FiBarChart2,
      href: '/managers',
      color: 'purple',
      badge: urgentTasks > 0 ? urgentTasks : undefined,
    },
    {
      id: 'communications',
      label: 'Communications',
      description: 'Messages and emails',
      icon: FiMessageSquare,
      href: '/communications',
      color: 'green',
    },
    {
      id: 'trades',
      label: 'Trades',
      description: 'Contractor directory',
      icon: FiTool,
      href: '/trades',
      color: 'orange',
    },
    {
      id: 'owners',
      label: 'Owners',
      description: 'Resident directory',
      icon: FiUsers,
      href: '/owners',
      color: 'teal',
    },
  ];

  const handleQuickActionClick = (href: string) => {
    router.push(href);
  };

  return (
    <Box w="100%" minH="100%" bg="gray.50">
      <Container maxW="container.xl" py={8} px={{ base: 4, md: 6 }}>
        <VStack spacing={8} align="stretch">
          {/* Hero Section */}
          <VStack spacing={4} align="center" pt={8} pb={4}>
            <Heading size="2xl" textAlign="center" color="gray.800">
              Welcome back
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              What would you like to do today?
            </Text>

            {/* Command Bar Trigger */}
            <Box w="100%" maxW="600px" pt={4}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search or type a command..."
                  bg="white"
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'lg' }}
                  onClick={open}
                  cursor="pointer"
                  readOnly
                />
              </InputGroup>
              <HStack justify="center" mt={2} spacing={1}>
                <Text fontSize="xs" color="gray.500">
                  Press
                </Text>
                <Badge variant="outline" fontSize="xs" px={2}>⌘K</Badge>
                <Text fontSize="xs" color="gray.500">
                  to open command palette
                </Text>
              </HStack>
            </Box>
          </VStack>

          {/* Stats Summary */}
          {currentScheme && allTasks && allTasks.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Card
                bg="white"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                shadow="sm"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <CardBody>
                  <HStack spacing={3}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg="blue.50"
                    >
                      <Icon as={FiInbox} boxSize={6} color="blue.600" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {openTasks}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Open Tasks
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

              <Card
                bg="white"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                shadow="sm"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <CardBody>
                  <HStack spacing={3}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg={urgentTasks > 0 ? 'red.50' : 'green.50'}
                    >
                      <Icon
                        as={urgentTasks > 0 ? FiAlertCircle : FiCheckCircle}
                        boxSize={6}
                        color={urgentTasks > 0 ? 'red.600' : 'green.600'}
                      />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {urgentTasks}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Urgent Tasks
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

              <Card
                bg="white"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                shadow="sm"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <CardBody>
                  <HStack spacing={3}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg={overdueTasks > 0 ? 'orange.50' : 'gray.50'}
                    >
                      <Icon
                        as={FiClock}
                        boxSize={6}
                        color={overdueTasks > 0 ? 'orange.600' : 'gray.600'}
                      />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {overdueTasks}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Overdue Tasks
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Quick Actions */}
          <Box>
            <Heading size="md" mb={4} color="gray.800">
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {quickActions.map((action) => (
                <Card
                  key={action.id}
                  bg="white"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  shadow="sm"
                  cursor="pointer"
                  onClick={() => handleQuickActionClick(action.href)}
                  _hover={{
                    shadow: 'lg',
                    transform: 'translateY(-4px)',
                    borderColor: `${action.color}.300`,
                  }}
                  transition="all 0.2s"
                  position="relative"
                >
                  <CardBody>
                    <Flex justify="space-between" align="start" mb={3}>
                      <Box
                        p={3}
                        borderRadius="lg"
                        bg={`${action.color}.50`}
                      >
                        <Icon as={action.icon} boxSize={6} color={`${action.color}.600`} />
                      </Box>
                      {action.badge !== undefined && (
                        <Badge
                          colorScheme={action.color}
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </Flex>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                        {action.label}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {action.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Tips */}
          <Card
            bg="blue.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="blue.200"
            mt={4}
          >
            <CardBody>
              <HStack spacing={3} align="start">
                <Icon as={FiSearch} boxSize={5} color="blue.600" mt={0.5} />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold" color="blue.900">
                    Pro tip: Use keyboard shortcuts
                  </Text>
                  <Text fontSize="sm" color="blue.800">
                    Press <Badge variant="solid" colorScheme="blue" mx={1}>⌘K</Badge> or
                    <Badge variant="solid" colorScheme="blue" mx={1}>Ctrl+K</Badge> to quickly
                    access any feature in the app. Navigate with arrow keys, select with Enter.
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Command Bar */}
      <CommandBar isOpen={isOpen} onClose={close} />
    </Box>
  );
}
