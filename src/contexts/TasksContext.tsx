'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { TaskWithDetails, TaskCategory, TaskPriority } from '@/types/schema';
import { useInboxNavigation } from '@/hooks/useInboxNavigation';
import { useInboxData } from '@/hooks/useInboxData';
import { useStrataScheme } from '@/contexts/StrataSchemeContext';
import tasksData from '@/data/tasks.json';

interface TasksContextType {
  // Navigation
  selectedTaskId: string | null;
  navigateToTask: (taskId: string, tab?: 'summary' | 'timeline') => void;
  navigateToTab: (tab: 'summary' | 'timeline') => void;
  navigateToInbox: () => void;

  // Profile
  profileOpen: boolean;
  toggleProfile: (open: boolean) => void;

  // Compose
  composeOpen: boolean;
  toggleCompose: (open: boolean) => void;

  // Filters
  selectedCategory: TaskCategory | 'all';
  selectedPriorities: TaskPriority[];
  setSelectedCategory: (category: TaskCategory | 'all') => void;
  setSelectedPriorities: (priorities: TaskPriority[]) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;

  // Data
  tasks: TaskWithDetails[];
  selectedTask: TaskWithDetails | null;
  loadingTasks: boolean;
  loadingTask: boolean;

  // Current tab info
  currentTab: 'summary' | 'timeline';
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

interface TasksProviderProps {
  children: ReactNode;
  initialTaskId?: string;
  initialTab?: 'summary' | 'timeline';
  initialProfileOpen?: boolean;
  initialComposeOpen?: boolean;
}

export function TasksProvider({
  children,
  initialTaskId,
  initialTab = 'summary',
  initialProfileOpen = false,
  initialComposeOpen = false
}: TasksProviderProps) {
  const { currentScheme, switchScheme } = useStrataScheme();
  const { currentRoute, navigateToTask, navigateToTab, navigateToInbox, toggleProfile, updateFilters } = useInboxNavigation(
    initialTaskId,
    initialTab,
    initialProfileOpen
  );

  // Compose state
  const [composeOpen, setComposeOpen] = useState(initialComposeOpen);

  // Local state for filters (synced with URL)
  const [selectedCategory, setSelectedCategoryState] = useState<TaskCategory | 'all'>(currentRoute.category);
  const [selectedPriorities, setSelectedPrioritiesState] = useState<TaskPriority[]>(currentRoute.priorities);
  
  // Get data based on current filters and selection
  const { tasks, selectedTask, loadingTasks, loadingTask } = useInboxData(
    selectedCategory,
    currentRoute.taskId,
    selectedPriorities
  );
  
  // Sync local filter state with URL
  useEffect(() => {
    setSelectedCategoryState(currentRoute.category);
    setSelectedPrioritiesState(currentRoute.priorities);
  }, [currentRoute.category, currentRoute.priorities]);
  
  // Handle task selection with scheme switching
  const handleNavigateToTask = (taskId: string, tab?: 'summary' | 'timeline') => {
    // Check if task belongs to different scheme
    const task = tasksData.find((t: any) => t.id === taskId);
    if (task && task.strata_scheme_id && task.strata_scheme_id !== currentScheme?.id) {
      switchScheme(task.strata_scheme_id);
    }
    navigateToTask(taskId, tab);
  };
  
  // Update filters with URL sync
  const setSelectedCategory = (category: TaskCategory | 'all') => {
    setSelectedCategoryState(category);
    updateFilters(category, selectedPriorities);
    // Clear task selection when changing category
    if (category !== selectedCategory) {
      navigateToInbox();
    }
  };
  
  const setSelectedPriorities = (priorities: TaskPriority[]) => {
    setSelectedPrioritiesState(priorities);
    updateFilters(selectedCategory, priorities);
  };
  
  const clearAllFilters = () => {
    setSelectedCategoryState('all');
    setSelectedPrioritiesState([]);
    updateFilters('all', []);
    navigateToInbox();
  };

  const toggleCompose = (open: boolean) => {
    setComposeOpen(open);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedPriorities.length > 0;

  return (
    <TasksContext.Provider
      value={{
        // Navigation
        selectedTaskId: currentRoute.taskId,
        navigateToTask: handleNavigateToTask,
        navigateToTab,
        navigateToInbox,

        // Profile
        profileOpen: currentRoute.profileOpen,
        toggleProfile,

        // Compose
        composeOpen,
        toggleCompose,

        // Filters
        selectedCategory,
        selectedPriorities,
        setSelectedCategory,
        setSelectedPriorities,
        hasActiveFilters,
        clearAllFilters,

        // Data
        tasks,
        selectedTask,
        loadingTasks,
        loadingTask,

        // Current tab
        currentTab: currentRoute.tab,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}

// Backward compatibility alias - will be removed in future
/** @deprecated Use useTasks instead */
export const useInbox = useTasks;