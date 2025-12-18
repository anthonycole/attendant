export type ID = string;
export type Timestamp = string; // ISO 8601

// Strata Scheme Types
export type StrataSchemeType = 'residential' | 'commercial' | 'mixed_use' | 'community_title';
export type SLATimeUnit = 'hours' | 'business_days' | 'calendar_days';
export type CommunicationChannel = 'email' | 'phone' | 'sms' | 'web' | 'internal';

// Core Strata Scheme Entity
export interface StrataScheme {
  id: ID;
  scheme_name: string;
  plan_number: string; // e.g., "SP 12345"
  scheme_type: StrataSchemeType;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  owners_corporation: {
    name: string;
    abn?: string;
    registration_number?: string;
    registered_office?: string;
  };
  total_lots: number;
  total_units?: number;
  established_date: Timestamp;
  strata_manager?: {
    company_name: string;
    license_number?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
  metadata?: Record<string, unknown>;
}

// Strata Manager Tags - Each strata scheme can have custom tags
export interface StrataManagerTag {
  id: ID;
  strata_scheme_id: ID;
  name: string;
  color?: string; // Hex color for display
  description?: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Service Level Agreements
export interface SLA {
  id: ID;
  strata_scheme_id: ID;
  name: string;
  description?: string;
  channel: CommunicationChannel;
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  response_time: number;
  response_time_unit: SLATimeUnit;
  resolution_time?: number;
  resolution_time_unit?: SLATimeUnit;
  escalation_time?: number;
  escalation_time_unit?: SLATimeUnit;
  business_hours_only: boolean;
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Extended types for UI
export interface StrataSchemeWithStats extends StrataScheme {
  active_tasks_count: number;
  total_tasks_count: number;
  residents_count: number;
  slas: SLA[];
  available_tags: StrataManagerTag[]; // Custom tags for this strata scheme
}

// Business hours configuration
export interface BusinessHours {
  id: ID;
  strata_scheme_id: ID;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_working_day: boolean;
}

// Public holidays configuration
export interface PublicHoliday {
  id: ID;
  strata_scheme_id: ID;
  name: string;
  date: string; // YYYY-MM-DD format
  recurring: boolean; // true for annual holidays
}