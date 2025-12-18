'use client';

import { useState } from 'react';
import type { TaskStatus, TaskPriority, TaskCategory, TaskWithDetails } from '@/types/schema';

export function useTaskUpdates(task: TaskWithDetails) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticTask, setOptimisticTask] = useState<TaskWithDetails>(task);

  const updateTaskField = async (
    field: 'status' | 'priority' | 'category',
    value: string
  ) => {
    if (isUpdating) return;

    setIsUpdating(true);

    // Optimistic update
    const updatedTask = { ...optimisticTask, [field]: value };
    setOptimisticTask(updatedTask);

    try {
      // In a real app, this would make an API call
      console.log(`Updating task ${task.id} ${field} to:`, value);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, we'll just keep the optimistic update
      // In a real app, you'd update the task in your data store/cache
      
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticTask(task);
      console.error(`Failed to update task ${field}:`, error);
      // You could show a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const updateStatus = (status: string) => updateTaskField('status', status);
  const updatePriority = (priority: string) => updateTaskField('priority', priority);  
  const updateCategory = (category: string) => updateTaskField('category', category);

  return {
    task: optimisticTask,
    isUpdating,
    updateStatus,
    updatePriority,
    updateCategory,
  };
}