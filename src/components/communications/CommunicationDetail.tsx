'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  IconButton,
  Textarea,
  Select,
  Icon,
} from '@chakra-ui/react';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
} from '@/components/ui/popover';
import {
  FiX,
  FiCheckCircle,
  FiLink,
  FiPlus,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiGlobe,
  FiFileText,
  FiArrowDown,
  FiArrowUp,
  FiUser,
  FiClock,
  FiRefreshCw,
  FiAlertCircle,
} from 'react-icons/fi';
import { useCommunications } from '@/contexts/CommunicationsContext';
import { useTasksByCategory, useCreateTask } from '@/hooks/useData';
import { useStrataScheme } from '@/contexts/StrataSchemeContext';
import type { CommunicationChannel } from '@/types/schema';
import { CreateIssueDrawer, type NewIssueData } from '@/components/CreateIssueDrawer';

function getChannelIcon(channel: CommunicationChannel) {
  switch (channel) {
    case 'email':
      return FiMail;
    case 'phone':
      return FiPhone;
    case 'sms':
      return FiMessageSquare;
    case 'web':
      return FiGlobe;
    case 'internal':
      return FiFileText;
    default:
      return FiMail;
  }
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CommunicationDetail() {
  const router = useRouter();
  const { selectedCommunication, selectCommunication, markAsTriaged, linkToTask } =
    useCommunications();
  const { currentScheme } = useStrataScheme();
  const { data: tasks = [] } = useTasksByCategory(currentScheme?.id || null, 'all');
  const createTask = useCreateTask(currentScheme?.id || '');

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isLinkingToTask, setIsLinkingToTask] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedReassignTaskId, setSelectedReassignTaskId] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);

  const handleClose = () => {
    selectCommunication(null);
    router.push('/communications');
  };

  if (!selectedCommunication) {
    return null;
  }

  const comm = selectedCommunication;
  const ChannelIcon = getChannelIcon(comm.channel);

  const handleMarkAsTriaged = async () => {
    await markAsTriaged(comm.id);
  };

  const handleLinkToTask = async () => {
    if (selectedTaskId) {
      setIsLinkingToTask(true);
      try {
        await linkToTask(comm.id, selectedTaskId);
        setSelectedTaskId('');
      } finally {
        setIsLinkingToTask(false);
      }
    }
  };

  const handleCreateTask = async (newTask: NewIssueData) => {
    try {
      // Create the task with customer info from the communication
      const task = await createTask.mutateAsync({
        subject: newTask.subject,
        description: newTask.description,
        priority: newTask.priority,
        category: newTask.category,
        customer_email: comm.customer?.email || '',
        customer_name: comm.customer ? `${comm.customer.first_name} ${comm.customer.last_name}` : '',
        customer_unit: comm.customer?.unit_number,
      });

      // Link the communication to the new task
      await linkToTask(comm.id, task.id);

      setIsCreateTaskOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleReassignToTask = async () => {
    if (selectedReassignTaskId) {
      setIsReassigning(true);
      try {
        await linkToTask(comm.id, selectedReassignTaskId);
        setSelectedReassignTaskId('');
      } finally {
        setIsReassigning(false);
      }
    }
  };

  // Filter tasks to only show those for the same customer or unassigned
  const availableTasks = tasks.filter(
    (task) => !comm.task_id || task.id !== comm.task_id
  );

  return (
    <Box h="100%" display="flex" flexDirection="column" bg="white">
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <HStack justify="space-between" mb={2}>
          <HStack spacing={3}>
            <Icon as={ChannelIcon} boxSize={5} color="blue.500" />
            <Text fontSize="lg" fontWeight="600">
              Communication Details
            </Text>
            {comm.triaged && (
              <Badge colorScheme="green" variant="subtle">
                <HStack spacing={1}>
                  <Icon as={FiCheckCircle} boxSize={3} />
                  <Text>Triaged</Text>
                </HStack>
              </Badge>
            )}
          </HStack>
          <IconButton
            aria-label="Close"
            size="sm"
            variant="ghost"
            onClick={handleClose}
          >
            <FiX />
          </IconButton>
        </HStack>

        {/* Quick Actions */}
        {!comm.triaged && (
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme="green"
              leftIcon={<FiCheckCircle />}
              onClick={handleMarkAsTriaged}
            >
              Mark as Triaged
            </Button>

            <PopoverRoot>
              <PopoverTrigger>
                <Button size="sm" variant="outline" leftIcon={<FiLink />}>
                  Link to Task
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Link to Existing Task</PopoverHeader>
                <PopoverBody>
                  <VStack align="stretch" spacing={3}>
                    <Select
                      placeholder="Select task..."
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                      size="sm"
                    >
                      {availableTasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          #{task.id.split('-')[1]} - {task.subject}
                        </option>
                      ))}
                    </Select>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={handleLinkToTask}
                      isDisabled={!selectedTaskId || isLinkingToTask}
                      isLoading={isLinkingToTask}
                    >
                      Link & Mark Triaged
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiPlus />}
              onClick={() => setIsCreateTaskOpen(true)}
            >
              Create New Task
            </Button>
          </HStack>
        )}
      </Box>

      {/* Content */}
      <Box flex={1} overflow="auto" p={6}>
        <VStack align="stretch" spacing={4}>
          {/* Metadata Section */}
          <Box p={4} bg="gray.50" borderRadius="md">
            <VStack align="stretch" spacing={3}>
              <HStack spacing={6}>
                <HStack spacing={2}>
                  <Icon
                    as={comm.direction === 'inbound' ? FiArrowDown : FiArrowUp}
                    boxSize={4}
                    color={comm.direction === 'inbound' ? 'orange.500' : 'blue.500'}
                  />
                  <Text fontSize="sm" fontWeight="600" textTransform="capitalize">
                    {comm.direction}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiClock} boxSize={4} color="gray.500" />
                  <Text fontSize="sm" color="gray.600">
                    {formatTimestamp(comm.timestamp)}
                  </Text>
                </HStack>
              </HStack>

              {comm.customer && (
                <HStack spacing={2}>
                  <Icon as={FiUser} boxSize={4} color="gray.500" />
                  <Text fontSize="sm">
                    {comm.customer.first_name} {comm.customer.last_name}
                    {comm.customer.unit_number && ` - Unit ${comm.customer.unit_number}`}
                  </Text>
                </HStack>
              )}

              {comm.channel === 'phone' && comm.duration && (
                <HStack spacing={2}>
                  <Icon as={FiPhone} boxSize={4} color="gray.500" />
                  <Text fontSize="sm">
                    Duration: {Math.floor(comm.duration / 60)}m {comm.duration % 60}s
                  </Text>
                </HStack>
              )}

              {comm.from && (
                <HStack spacing={2}>
                  <Text fontSize="sm" fontWeight="500">
                    From:
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {comm.from}
                  </Text>
                </HStack>
              )}

              {comm.to && (
                <HStack spacing={2}>
                  <Text fontSize="sm" fontWeight="500">
                    To:
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {comm.to}
                  </Text>
                </HStack>
              )}
            </VStack>
          </Box>

          {/* Triage Recommendation */}
          {comm.triage_recommendation && (
            <Box p={4} bg="cyan.50" borderRadius="md" borderLeft="4px" borderLeftColor="cyan.400">
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Icon as={FiAlertCircle} boxSize={4} color="cyan.600" />
                  <Text fontSize="sm" fontWeight="600" color="cyan.900">
                    Triage Recommendation
                  </Text>
                </HStack>
                <Text fontSize="sm" color="cyan.800" whiteSpace="pre-wrap">
                  {comm.triage_recommendation}
                </Text>
              </VStack>
            </Box>
          )}

          {/* Linked Task */}
          {comm.task && (
            <Box p={4} bg="purple.50" borderRadius="md" borderLeft="4px" borderLeftColor="purple.400">
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiLink} boxSize={4} color="purple.600" />
                    <Text fontSize="sm" fontWeight="600" color="purple.900">
                      Linked to Task
                    </Text>
                  </HStack>
                  {/* Re-assign button */}
                  <PopoverRoot>
                    <PopoverTrigger>
                      <Button size="xs" variant="ghost" colorScheme="purple" leftIcon={<FiRefreshCw />}>
                        Re-assign
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverHeader>Re-assign to Different Task</PopoverHeader>
                      <PopoverBody>
                        <VStack align="stretch" spacing={3}>
                          <Select
                            placeholder="Select task..."
                            value={selectedReassignTaskId}
                            onChange={(e) => setSelectedReassignTaskId(e.target.value)}
                            size="sm"
                          >
                            {tasks.map((task) => (
                              <option key={task.id} value={task.id}>
                                #{task.id.split('-')[1]} - {task.subject}
                              </option>
                            ))}
                          </Select>
                          <Button
                            size="sm"
                            colorScheme="purple"
                            onClick={handleReassignToTask}
                            isDisabled={!selectedReassignTaskId || isReassigning}
                            isLoading={isReassigning}
                          >
                            Re-assign
                          </Button>
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </PopoverRoot>
                </HStack>
                <Text fontSize="sm" color="purple.800">
                  #{comm.task.id.split('-')[1]} - {comm.task.subject}
                </Text>
                <Badge
                  size="sm"
                  colorScheme="purple"
                  variant="subtle"
                  w="fit-content"
                  textTransform="capitalize"
                >
                  {comm.task.status.replace(/_/g, ' ')}
                </Badge>
              </VStack>
            </Box>
          )}

          {/* Subject */}
          {comm.subject && (
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                Subject
              </Text>
              <Text fontSize="md" fontWeight="500">
                {comm.subject}
              </Text>
            </Box>
          )}

          {/* Body/Content */}
          {comm.body && (
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                Message
              </Text>
              <Box
                p={4}
                bg="white"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
                whiteSpace="pre-wrap"
              >
                <Text fontSize="sm">{comm.body}</Text>
              </Box>
            </Box>
          )}

          {/* Notes (for phone calls, etc.) */}
          {comm.notes && (
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                Notes
              </Text>
              <Box
                p={4}
                bg="yellow.50"
                borderRadius="md"
                border="1px"
                borderColor="yellow.200"
                whiteSpace="pre-wrap"
              >
                <Text fontSize="sm">{comm.notes}</Text>
              </Box>
            </Box>
          )}

          {/* Triage Info */}
          {comm.triaged && comm.triaged_at && (
            <Box p={4} bg="green.50" borderRadius="md" borderLeft="4px" borderLeftColor="green.400">
              <VStack align="stretch" spacing={1}>
                <HStack>
                  <Icon as={FiCheckCircle} boxSize={4} color="green.600" />
                  <Text fontSize="sm" fontWeight="600" color="green.900">
                    Triaged
                  </Text>
                </HStack>
                <Text fontSize="xs" color="green.700">
                  {formatTimestamp(comm.triaged_at)}
                  {comm.triaged_by && ` by ${comm.triaged_by}`}
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Create Task Drawer */}
      <CreateIssueDrawer
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        linkedCommunication={{
          channel: comm.channel,
          customerName: comm.customer ? `${comm.customer.first_name} ${comm.customer.last_name}` : undefined,
          subject: comm.subject,
          timestamp: comm.timestamp,
        }}
      />
    </Box>
  );
}
