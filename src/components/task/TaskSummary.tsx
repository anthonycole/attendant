'use client';

import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  IconButton,
  Textarea,
  Button,
  Select,
  Input,
  Checkbox,
  Badge,
} from '@chakra-ui/react';
import { FiEdit2, FiCheck, FiX, FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';
import { useInbox } from '@/contexts/TasksContext';
import type { TaskWithDetails } from '@/types/schema';

// Task Action types
interface TaskAction {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  assigned_to?: string;
  created_at: string;
  completed_at?: string;
}

interface TaskActionListProps {
  taskId: string;
  actions: TaskAction[];
  onUpdateAction: (actionId: string, updates: Partial<TaskAction>) => void;
  onAddAction: (action: Omit<TaskAction, 'id' | 'created_at'>) => void;
  onDeleteAction: (actionId: string) => void;
}

interface TaskSummaryProps {
  task: TaskWithDetails;
}

export function TaskSummary({ task }: TaskSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(task.summary || '');
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    due_date: '',
    assigned_to: ''
  });

  // Mock task actions - in real app this would come from API
  const [taskActions, setTaskActions] = useState<TaskAction[]>([
    {
      id: 'action-1',
      title: 'Contact upstairs neighbor (Unit 401)',
      description: 'Send initial notice about noise complaints',
      completed: true,
      due_date: '2024-11-12',
      assigned_to: 'Building Manager',
      created_at: '2024-11-10T10:00:00Z',
      completed_at: '2024-11-11T14:30:00Z'
    },
    {
      id: 'action-2', 
      title: 'Schedule mediation meeting',
      description: 'Arrange meeting between complainant and neighbor',
      completed: false,
      due_date: '2024-11-15',
      assigned_to: 'Property Manager',
      created_at: '2024-11-11T09:00:00Z'
    },
    {
      id: 'action-3',
      title: 'Document policy violation',
      description: 'Create formal record if behavior continues',
      completed: false,
      assigned_to: 'Strata Committee',
      created_at: '2024-11-11T09:15:00Z'
    }
  ]);

  const currentSummary = summary || task.summary || 'No summary available. Click edit to add a summary for this task.';

  const handleSave = () => {
    // TODO: Implement API call to save summary
    console.log('Saving summary:', summary);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSummary(task.summary || '');
    setIsEditing(false);
  };

  const handleUpdateAction = (actionId: string, updates: Partial<TaskAction>) => {
    setTaskActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, ...updates, ...(updates.completed ? { completed_at: new Date().toISOString() } : { completed_at: undefined }) }
        : action
    ));
  };

  const handleAddAction = () => {
    if (!newAction.title.trim()) return;
    
    const action: TaskAction = {
      id: `action-${Date.now()}`,
      title: newAction.title,
      description: newAction.description || undefined,
      completed: false,
      due_date: newAction.due_date || undefined,
      assigned_to: newAction.assigned_to || undefined,
      created_at: new Date().toISOString()
    };
    
    setTaskActions(prev => [...prev, action]);
    setNewAction({ title: '', description: '', due_date: '', assigned_to: '' });
    setIsAddingAction(false);
  };

  const handleDeleteAction = (actionId: string) => {
    setTaskActions(prev => prev.filter(action => action.id !== actionId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <VStack align="stretch" spacing={4}>
      {/* Task Summary Section */}
      <Box p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="blue.400">
        <HStack justify="space-between" mb={2}>
          <Text fontSize="sm" fontWeight="600" color="blue.900">
            Task Summary
          </Text>
          {!isEditing && (
            <IconButton
              aria-label="Edit summary"
              size="xs"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit2 />
            </IconButton>
          )}
        </HStack>
        {isEditing ? (
          <VStack align="stretch" spacing={2}>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter a summary of this task..."
              size="sm"
              rows={3}
              bg="white"
            />
            <HStack spacing={2}>
              <Button
                size="xs"
                colorScheme="blue"
                leftIcon={<FiCheck />}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<FiX />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <Text fontSize="sm" color="gray.700" fontStyle={!task.summary && !summary ? 'italic' : 'normal'}>
            {currentSummary}
          </Text>
        )}
      </Box>

      {/* Task Actions List Section - only show if there are actions */}
      {taskActions.length > 0 && (
        <Box p={4} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
          <HStack justify="space-between" mb={3}>
            <HStack>
              <Text fontSize="sm" fontWeight="600" color="green.900">
                Action Items
              </Text>
              <Badge variant="subtle" colorScheme="green" size="sm">
                {taskActions.filter(a => a.completed).length}/{taskActions.length} Complete
              </Badge>
            </HStack>
            <Button
              size="xs"
              variant="ghost"
              leftIcon={<FiPlus />}
              onClick={() => setIsAddingAction(true)}
              colorScheme="green"
            >
              Add Action
            </Button>
          </HStack>

          <VStack align="stretch" spacing={2}>
            {taskActions.map((action) => (
              <Box
                key={action.id}
                p={3}
                bg="white"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <HStack spacing={3} align="start">
                  <Checkbox
                    isChecked={action.completed}
                    onChange={(e) => handleUpdateAction(action.id, { completed: e.target.checked })}
                    colorScheme="green"
                    mt={1}
                  />
                  <VStack align="stretch" spacing={1} flex={1}>
                    <HStack justify="space-between" align="start">
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        textDecoration={action.completed ? 'line-through' : 'none'}
                        color={action.completed ? 'gray.500' : 'gray.900'}
                      >
                        {action.title}
                      </Text>
                      <IconButton
                        aria-label="Delete action"
                        size="xs"
                        variant="ghost"
                        icon={<FiTrash2 />}
                        onClick={() => handleDeleteAction(action.id)}
                        colorScheme="red"
                      />
                    </HStack>
                    {action.description && (
                      <Text fontSize="xs" color="gray.600">
                        {action.description}
                      </Text>
                    )}
                    <HStack spacing={4} fontSize="xs" color="gray.500">
                      {action.due_date && (
                        <HStack spacing={1}>
                          <FiCalendar />
                          <Text>Due: {formatDate(action.due_date)}</Text>
                        </HStack>
                      )}
                      {action.assigned_to && (
                        <Text>Assigned: {action.assigned_to}</Text>
                      )}
                      {action.completed_at && (
                        <Text>Completed: {formatDate(action.completed_at)}</Text>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            ))}

            {/* Add new action form */}
            {isAddingAction && (
              <Box p={3} bg="gray.50" borderRadius="md" border="1px dashed" borderColor="gray.300">
                <VStack align="stretch" spacing={2}>
                  <Input
                    placeholder="Action title..."
                    value={newAction.title}
                    onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                    size="sm"
                    bg="white"
                  />
                  <Textarea
                    placeholder="Description (optional)..."
                    value={newAction.description}
                    onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                    size="sm"
                    rows={2}
                    bg="white"
                  />
                  <HStack spacing={2}>
                    <Input
                      placeholder="Assigned to (optional)..."
                      value={newAction.assigned_to}
                      onChange={(e) => setNewAction(prev => ({ ...prev, assigned_to: e.target.value }))}
                      size="sm"
                      bg="white"
                      flex={1}
                    />
                    <Input
                      type="date"
                      value={newAction.due_date}
                      onChange={(e) => setNewAction(prev => ({ ...prev, due_date: e.target.value }))}
                      size="sm"
                      bg="white"
                      w="140px"
                    />
                  </HStack>
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      colorScheme="green"
                      onClick={handleAddAction}
                      isDisabled={!newAction.title.trim()}
                    >
                      Add Action
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingAction(false);
                        setNewAction({ title: '', description: '', due_date: '', assigned_to: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>
      )}


    </VStack>
  );
}