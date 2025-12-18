import { 
  FiTool, 
  FiZap, 
  FiHome, 
  FiLayers,
  FiUmbrella,
  FiDroplet,
  FiShield,
  FiSettings,
  FiMoreHorizontal,
  FiActivity,
  FiHeart
} from 'react-icons/fi';
import type { TradeType, TradeStatus } from '@/types/trades';

export const TRADE_TYPE_OPTIONS = [
  {
    value: 'plumbing' as TradeType,
    label: 'Plumbing',
    icon: FiDroplet,
    colorScheme: 'blue'
  },
  {
    value: 'electrical' as TradeType,
    label: 'Electrical',
    icon: FiZap,
    colorScheme: 'yellow'
  },
  {
    value: 'hvac' as TradeType,
    label: 'HVAC',
    icon: FiActivity,
    colorScheme: 'cyan'
  },
  {
    value: 'painting' as TradeType,
    label: 'Painting',
    icon: FiLayers,
    colorScheme: 'orange'
  },
  {
    value: 'carpentry' as TradeType,
    label: 'Carpentry',
    icon: FiSettings,
    colorScheme: 'brown'
  },
  {
    value: 'roofing' as TradeType,
    label: 'Roofing',
    icon: FiUmbrella,
    colorScheme: 'gray'
  },
  {
    value: 'cleaning' as TradeType,
    label: 'Cleaning',
    icon: FiHome,
    colorScheme: 'green'
  },
  {
    value: 'landscaping' as TradeType,
    label: 'Landscaping',
    icon: FiHeart,
    colorScheme: 'green'
  },
  {
    value: 'pest_control' as TradeType,
    label: 'Pest Control',
    icon: FiActivity,
    colorScheme: 'red'
  },
  {
    value: 'security' as TradeType,
    label: 'Security',
    icon: FiShield,
    colorScheme: 'purple'
  },
  {
    value: 'general_maintenance' as TradeType,
    label: 'General Maintenance',
    icon: FiTool,
    colorScheme: 'teal'
  },
  {
    value: 'other' as TradeType,
    label: 'Other',
    icon: FiMoreHorizontal,
    colorScheme: 'gray'
  }
];

export const TRADE_STATUS_OPTIONS = [
  {
    value: 'active' as TradeStatus,
    label: 'Active',
    colorScheme: 'green'
  },
  {
    value: 'inactive' as TradeStatus,
    label: 'Inactive',
    colorScheme: 'gray'
  },
  {
    value: 'pending' as TradeStatus,
    label: 'Pending',
    colorScheme: 'orange'
  }
];

export const getTradeTypeOption = (tradeType: TradeType) => {
  return TRADE_TYPE_OPTIONS.find(option => option.value === tradeType);
};

export const getTradeStatusOption = (status: TradeStatus) => {
  return TRADE_STATUS_OPTIONS.find(option => option.value === status);
};