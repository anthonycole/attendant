'use client';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Icon,
  HStack,
  Avatar,
  Tooltip,
  Link
} from '@chakra-ui/react';
import { useMemo } from 'react';
import NextLink from 'next/link';
import type { Task, TaskWithDetails, SLA } from '@/types/schema';
import { SLAStatusBadge } from './SLAStatusBadge';
import { calculateSLAStatus, getSLAForTask } from '@/lib/slaUtils';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from '@/lib/taskOptions';

interface ManagerTasksTableProps {
  tasks: TaskWithDetails[];
  slas: SLA[];
  schemeId: string;
}

export function ManagerTasksTable({ tasks, slas, schemeId }: ManagerTasksTableProps) {
  // Sort tasks by SLA status (breached first, then at risk, then by due date)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const slaA = getSLAForTask(a, slas);
      const slaB = getSLAForTask(b, slas);
      const statusA = calculateSLAStatus(a, slaA);
      const statusB = calculateSLAStatus(b, slaB);

      // Breached tasks first
      if (statusA.isBreached && !statusB.isBreached) return -1;
      if (!statusA.isBreached && statusB.isBreached) return 1;

      // At risk tasks second
      if (statusA.isAtRisk && !statusB.isAtRisk) return -1;
      if (!statusA.isAtRisk && statusB.isAtRisk) return 1;

      // Then by remaining time (least time first)
      return statusA.remainingTime - statusB.remainingTime;
    });
  }, [tasks, slas]);

  const getStatusConfig = (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];
  };

  const getPriorityConfig = (priority: string) => {
    return PRIORITY_OPTIONS.find(opt => opt.value === priority) || PRIORITY_OPTIONS[1];
  };

  const getCategoryConfig = (category?: string) => {
    return CATEGORY_OPTIONS.find(opt => opt.value === category);
  };

  if (tasks.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Text color="gray.500">No tasks found for this manager</Text>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
      w="100%"
      shadow="sm"
    >
      <Box overflowX="auto" w="100%">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th
                w="35%"
                py={3}
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="gray.600"
                borderColor="gray.200"
              >
                Task
              </Th>
              <Th
                w="20%"
                py={3}
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="gray.600"
                borderColor="gray.200"
              >
                Customer
              </Th>
              <Th
                w="12%"
                py={3}
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="gray.600"
                borderColor="gray.200"
              >
                Priority
              </Th>
              <Th
                w="20%"
                py={3}
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="gray.600"
                borderColor="gray.200"
              >
                SLA Status
              </Th>
              <Th
                w="13%"
                py={3}
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wide"
                color="gray.600"
                borderColor="gray.200"
              >
                Due Date
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedTasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              const priorityConfig = getPriorityConfig(task.priority);
              const categoryConfig = getCategoryConfig(task.category);
              const sla = getSLAForTask(task, slas);
              const slaStatus = calculateSLAStatus(task, sla);

              return (
                <Tr
                  key={task.id}
                  _hover={{ bg: 'blue.50', transform: 'scale(1.001)' }}
                  transition="all 0.15s ease"
                  cursor="pointer"
                  borderColor="gray.100"
                >
                  <Td py={4} borderColor="gray.100">
                    <Box>
                      <Link
                        as={NextLink}
                        href={`/tasks/${task.id}`}
                        color="gray.900"
                        fontWeight="semibold"
                        fontSize="sm"
                        _hover={{ color: 'blue.600', textDecoration: 'none' }}
                        display="block"
                        mb={1.5}
                      >
                        {task.subject}
                      </Link>
                      <HStack spacing={1.5} flexWrap="wrap">
                        <Badge
                          colorScheme={statusConfig.colorScheme}
                          variant="subtle"
                          fontSize="2xs"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          fontWeight="medium"
                        >
                          {statusConfig.label}
                        </Badge>
                        {categoryConfig && (
                          <Badge
                            colorScheme={categoryConfig.colorScheme}
                            variant="outline"
                            fontSize="2xs"
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontWeight="medium"
                          >
                            {categoryConfig.label}
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  </Td>
                  <Td py={4} borderColor="gray.100">
                    {task.customer ? (
                      <HStack spacing={2.5}>
                        <Avatar
                          size="sm"
                          name={`${task.customer.first_name} ${task.customer.last_name}`}
                          bg="blue.500"
                        />
                        <Box minW={0}>
                          <Text fontSize="sm" fontWeight="medium" noOfLines={1} color="gray.900">
                            {task.customer.first_name} {task.customer.last_name}
                          </Text>
                          {task.customer.unit_number && (
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              Unit {task.customer.unit_number}
                            </Text>
                          )}
                        </Box>
                      </HStack>
                    ) : (
                      <Text fontSize="sm" color="gray.400" fontStyle="italic">
                        Unknown
                      </Text>
                    )}
                  </Td>
                  <Td py={4} borderColor="gray.100">
                    <HStack spacing={1.5}>
                      <Icon as={priorityConfig.icon} color={`${priorityConfig.colorScheme}.500`} boxSize={3.5} />
                      <Badge
                        colorScheme={priorityConfig.colorScheme}
                        variant="subtle"
                        fontSize="2xs"
                        px={2.5}
                        py={1}
                        borderRadius="md"
                        fontWeight="semibold"
                      >
                        {priorityConfig.label}
                      </Badge>
                    </HStack>
                  </Td>
                  <Td py={4} borderColor="gray.100">
                    <SLAStatusBadge status={slaStatus} showTime={true} />
                  </Td>
                  <Td py={4} borderColor="gray.100">
                    {task.due_date ? (
                      <Tooltip
                        label={new Date(task.due_date).toLocaleString()}
                        placement="top"
                        hasArrow
                      >
                        <Text fontSize="sm" whiteSpace="nowrap" fontWeight="medium" color="gray.700">
                          {new Date(task.due_date).toLocaleDateString()}
                        </Text>
                      </Tooltip>
                    ) : (
                      <Text fontSize="sm" color="gray.300" fontWeight="medium">
                        —
                      </Text>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
