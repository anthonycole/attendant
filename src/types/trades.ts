// Trade types for directory management

export type TradeType = 
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'painting'
  | 'carpentry'
  | 'roofing'
  | 'cleaning'
  | 'landscaping'
  | 'pest_control'
  | 'security'
  | 'general_maintenance'
  | 'other';

export type TradeStatus = 'active' | 'inactive' | 'pending';

export interface Trade {
  id: string;
  company_name: string;
  trade_type: TradeType;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  abn?: string;
  insurance_expiry?: string;
  license_number?: string;
  hourly_rate?: number;
  callout_fee?: number;
  status: TradeStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  rating?: number; // 1-5 star rating
  preferred?: boolean; // Mark as preferred trade
}

export interface CreateTradeData {
  company_name: string;
  trade_type: TradeType;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  abn?: string;
  insurance_expiry?: string;
  license_number?: string;
  hourly_rate?: number;
  callout_fee?: number;
  notes?: string;
  rating?: number;
  preferred?: boolean;
}

export interface TradeFilters {
  trade_type?: TradeType | 'all';
  status?: TradeStatus | 'all';
  preferred?: boolean;
  search?: string;
}