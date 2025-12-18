import { 
  FiClock, 
  FiPlay, 
  FiPause, 
  FiCheckCircle, 
  FiXCircle,
  FiAlertTriangle,
  FiArrowUp,
  FiMinus,
  FiArrowDown,
  FiTool,
  FiHome,
  FiVolume2,
  FiHeart,
  FiSquare,
  FiUsers,
  FiDollarSign,
  FiShield,
  FiFileText,
  FiCalendar,
  FiMoreHorizontal
} from 'react-icons/fi';
import type { TaskStatus, TaskPriority, TaskCategory } from '@/types/schema';

export const STATUS_OPTIONS = [
  {
    value: 'open' as TaskStatus,
    label: 'Open',
    icon: FiClock,
    colorScheme: 'orange'
  },
  {
    value: 'in_progress' as TaskStatus,
    label: 'In Progress',
    icon: FiPlay,
    colorScheme: 'blue'
  },
  {
    value: 'waiting_on_committee' as TaskStatus,
    label: 'With Committee',
    icon: FiUsers,
    colorScheme: 'purple'
  },
  {
    value: 'waiting_on_customer' as TaskStatus,
    label: 'Waiting on Customer',
    icon: FiClock,
    colorScheme: 'cyan'
  },
  {
    value: 'on_hold' as TaskStatus,
    label: 'On Hold',
    icon: FiPause,
    colorScheme: 'yellow'
  },
  {
    value: 'resolved' as TaskStatus,
    label: 'Resolved',
    icon: FiCheckCircle,
    colorScheme: 'green'
  },
  {
    value: 'closed' as TaskStatus,
    label: 'Closed',
    icon: FiXCircle,
    colorScheme: 'gray'
  }
];

export const PRIORITY_OPTIONS = [
  {
    value: 'low' as TaskPriority,
    label: 'Low',
    icon: FiArrowDown,
    colorScheme: 'green'
  },
  {
    value: 'normal' as TaskPriority,
    label: 'Normal',
    icon: FiMinus,
    colorScheme: 'blue'
  },
  {
    value: 'high' as TaskPriority,
    label: 'High',
    icon: FiArrowUp,
    colorScheme: 'orange'
  },
  {
    value: 'urgent' as TaskPriority,
    label: 'Urgent',
    icon: FiAlertTriangle,
    colorScheme: 'red'
  }
];

export const CATEGORY_OPTIONS = [
  {
    value: 'maintenance' as TaskCategory,
    label: 'Maintenance',
    icon: FiTool,
    colorScheme: 'blue'
  },
  {
    value: 'repairs' as TaskCategory,
    label: 'Repairs',
    icon: FiTool,
    colorScheme: 'orange'
  },
  {
    value: 'noise_complaint' as TaskCategory,
    label: 'Noise Complaint',
    icon: FiVolume2,
    colorScheme: 'red'
  },
  {
    value: 'parking' as TaskCategory,
    label: 'Parking',
    icon: FiSquare,
    colorScheme: 'purple'
  },
  {
    value: 'pets' as TaskCategory,
    label: 'Pets',
    icon: FiHeart,
    colorScheme: 'pink'
  },
  {
    value: 'common_property' as TaskCategory,
    label: 'Common Property',
    icon: FiUsers,
    colorScheme: 'teal'
  },
  {
    value: 'levy_inquiry' as TaskCategory,
    label: 'Levy Inquiry',
    icon: FiDollarSign,
    colorScheme: 'green'
  },
  {
    value: 'insurance' as TaskCategory,
    label: 'Insurance',
    icon: FiShield,
    colorScheme: 'blue'
  },
  {
    value: 'by_laws' as TaskCategory,
    label: 'By-Laws',
    icon: FiFileText,
    colorScheme: 'gray'
  },
  {
    value: 'meeting_inquiry' as TaskCategory,
    label: 'Meeting Inquiry',
    icon: FiCalendar,
    colorScheme: 'cyan'
  },
  {
    value: 'other' as TaskCategory,
    label: 'Other',
    icon: FiMoreHorizontal,
    colorScheme: 'gray'
  }
];