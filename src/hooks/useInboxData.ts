'use client';

import { useState, useMemo } from 'react';
import type { TaskCategory, TaskPriority, TaskWithDetails } from '@/types/schema';
import { useTasksByCategory, useTask } from '@/hooks/useData';
import { useStrataScheme } from '@/contexts/StrataSchemeContext';

export interface InboxData {
  tasks: TaskWithDetails[];
  selectedTask: TaskWithDetails | null;
  loadingTasks: boolean;
  loadingTask: boolean;
  error: Error | null;
}

export function useInboxData(
  selectedCategory: TaskCategory | 'all',
  selectedTaskId: string | null,
  selectedPriorities: TaskPriority[]
): InboxData {
  const { currentScheme } = useStrataScheme();
  const [error, setError] = useState<Error | null>(null);

  // Fetch tasks by category
  const { 
    data: tasks = [], 
    isLoading: loadingTasks, 
    error: tasksError 
  } = useTasksByCategory(currentScheme?.id || null, selectedCategory);

  // Fetch selected task
  const { 
    data: selectedTask = null, 
    isLoading: loadingTask, 
    error: taskError 
  } = useTask(currentScheme?.id || null, selectedTaskId);

  // Filter tasks by priority
  const filteredTasks = useMemo(() => {
    if (selectedPriorities.length === 0) {
      return tasks;
    }
    return tasks.filter(task => selectedPriorities.includes(task.priority));
  }, [tasks, selectedPriorities]);

  // Combine errors
  const combinedError = error || tasksError || taskError;

  return {
    tasks: filteredTasks,
    selectedTask,
    loadingTasks,
    loadingTask,
    error: combinedError,
  };
}