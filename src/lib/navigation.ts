import { IconType } from 'react-icons';
import { FiInbox, FiMessageSquare, FiTool, FiBarChart2, FiStar } from 'react-icons/fi';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: IconType;
  description?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'tasks',
    label: 'Tasks',
    href: '/tasks',
    icon: FiInbox,
    description: 'Task management and inbox'
  },
  {
    id: 'managers',
    label: 'Managers',
    href: '/managers',
    icon: FiBarChart2,
    description: 'Manager dashboard with SLA tracking'
  },
  {
    id: 'communications',
    label: 'Communications',
    href: '/communications',
    icon: FiMessageSquare,
    description: 'Communication management'
  },
  {
    id: 'trades',
    label: 'Trades Directory',
    href: '/trades',
    icon: FiTool,
    description: 'Contractor and trade management'
  },
  {
    id: 'features',
    label: 'Features',
    href: '/features',
    icon: FiStar,
    description: 'Platform features overview'
  }
];

export const getActiveNavigationItem = (pathname: string): NavigationItem | null => {
  // Handle exact matches first
  const exactMatch = NAVIGATION_ITEMS.find(item => item.href === pathname);
  if (exactMatch) return exactMatch;
  
  // Handle path prefixes (e.g., /tasks/123 should match /tasks)
  const prefixMatch = NAVIGATION_ITEMS.find(item => 
    pathname.startsWith(item.href + '/') || pathname === item.href
  );
  
  return prefixMatch || null;
};