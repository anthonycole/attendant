'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { TaskCategory, TaskPriority } from '@/types/schema';

export interface InboxRoute {
  taskId: string | null;
  tab: 'summary' | 'timeline';
  profileOpen: boolean;
  category: TaskCategory | 'all';
  priorities: TaskPriority[];
}

export function useInboxNavigation(
  initialTaskId?: string,
  initialTab?: 'summary' | 'timeline',
  initialProfileOpen?: boolean
) {
  const router = useRouter();
  const pathname = usePathname();

  // Parse current route from pathname
  const currentRoute = useMemo((): InboxRoute => {
    // Check if we're on a task detail route: /tasks/[taskId] or /tasks/[taskId]/communications or /tasks/[taskId]/profile
    const taskMatch = pathname?.match(/\/tasks\/([^\/]+)/);
    const taskId = taskMatch ? taskMatch[1] : initialTaskId || null;

    // Check if we're on communications tab
    const isCommTab = pathname?.includes('/communications');
    const tab: 'summary' | 'timeline' = isCommTab ? 'timeline' : (initialTab || 'summary');

    // Check if profile is open
    const profileOpen = pathname?.includes('/profile') || initialProfileOpen || false;

    // For now, keep filters in state (could move to query params if needed)
    const category: TaskCategory | 'all' = 'all';
    const priorities: TaskPriority[] = [];

    return { taskId, tab, profileOpen, category, priorities };
  }, [pathname, initialTaskId, initialTab, initialProfileOpen]);

  // Navigation functions
  const navigateToTask = useCallback((taskId: string, tab?: 'summary' | 'timeline') => {
    if (tab === 'timeline') {
      router.push(`/tasks/${taskId}/communications`);
    } else {
      router.push(`/tasks/${taskId}`);
    }
  }, [router]);

  const navigateToTab = useCallback((tab: 'summary' | 'timeline') => {
    if (!currentRoute.taskId) return;

    if (tab === 'timeline') {
      router.push(`/tasks/${currentRoute.taskId}/communications`);
    } else {
      router.push(`/tasks/${currentRoute.taskId}`);
    }
  }, [router, currentRoute.taskId]);

  const toggleProfile = useCallback((open: boolean) => {
    if (!currentRoute.taskId) return;

    if (open) {
      router.push(`/tasks/${currentRoute.taskId}/profile`);
    } else {
      // Return to main task view
      router.push(`/tasks/${currentRoute.taskId}`);
    }
  }, [router, currentRoute.taskId]);

  const updateFilters = useCallback((category: TaskCategory | 'all', priorities: TaskPriority[]) => {
    // Filters stay on tasks list page - just navigate there with state
    router.push('/tasks');
  }, [router]);

  const navigateToInbox = useCallback(() => {
    router.push('/tasks');
  }, [router]);

  return {
    currentRoute,
    navigateToTask,
    navigateToTab,
    toggleProfile,
    updateFilters,
    navigateToInbox,
  };
}
