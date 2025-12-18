import {
  FiCircle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiPause,
  FiPlay,
  FiAlertTriangle,
  FiZap,
  FiFlag,
  FiMinus,
  FiTag
} from 'react-icons/fi';
import type { TaskStatus, TaskPriority } from '@/types/schema';

// Status icon mapping with filled variants
export const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'open':
      return FiCircle;
    case 'in_progress':
      return FiPlay;
    case 'waiting_on_customer':
      return FiClock;
    case 'waiting_on_committee':
      return FiPause;
    case 'resolved':
      return FiCheckCircle;
    case 'closed':
      return FiXCircle;
    default:
      return FiCircle;
  }
};

// Priority icon mapping with filled variants
export const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case 'low':
      return FiMinus;
    case 'medium':
      return FiFlag;
    case 'high':
      return FiAlertTriangle;
    case 'urgent':
      return FiZap;
    default:
      return FiFlag;
  }
};

// Category icon
export const getCategoryIcon = () => FiTag;

// Status color mapping
export const getStatusColorScheme = (status: TaskStatus): string => {
  switch (status) {
    case 'resolved':
    case 'closed':
      return 'green';
    case 'in_progress':
      return 'blue';
    case 'waiting_on_customer':
      return 'orange';
    case 'waiting_on_committee':
      return 'purple';
    case 'open':
    default:
      return 'gray';
  }
};

// Priority color mapping
export const getPriorityColorScheme = (priority: TaskPriority): string => {
  switch (priority) {
    case 'low':
      return 'gray';
    case 'medium':
      return 'blue';
    case 'high':
      return 'orange';
    case 'urgent':
      return 'red';
    default:
      return 'gray';
  }
};