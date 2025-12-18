// Consolidated and cleaned schema types for Steward Task Management

// Base types
export type ID = string;
export type Timestamp = string; // ISO timestamp
export type JSONObject = Record<string, unknown>;

// Import strata types
export * from './strata';

// Customer types
export type CustomerType = 'owner' | 'tenant' | 'committee_member' | 'proxy' | 'agent' | 'contractor' | 'other';

export interface Customer {
  id: ID;
  strata_scheme_id: ID; // Reference to strata scheme
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  unit_number?: string;
  lot_number?: string; // For strata properties
  entitlement?: number; // Unit entitlement for voting
  customer_type?: CustomerType;
  created_at: Timestamp;
  updated_at: Timestamp;
  notes?: string;
  metadata?: JSONObject;
}

// Task types (previously Ticket)
export type TaskStatus =
  | 'open'
  | 'in_progress' 
  | 'waiting_on_customer'
  | 'waiting_on_committee'
  | 'resolved'
  | 'closed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory =
  | 'maintenance'
  | 'repairs'
  | 'noise_complaint'
  | 'parking'
  | 'pets'
  | 'common_property'
  | 'levy_inquiry'
  | 'insurance'
  | 'by_laws'
  | 'meeting_inquiry'
  | 'other';

export interface Task {
  id: ID;
  strata_scheme_id: ID; // Reference to strata scheme
  customer_id: ID;
  subject: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: TaskCategory;
  assigned_to?: ID;
  assigned_at?: Timestamp;
  resolved_at?: Timestamp;
  closed_at?: Timestamp;
  resolution_notes?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  due_date?: Timestamp;
  tags?: string[];
  summary?: string;
  sla_id?: ID; // Reference to applicable SLA
  metadata?: JSONObject;
}

// Communication types
export type CommunicationChannel = 'email' | 'phone' | 'sms' | 'web' | 'internal';
export type CommunicationDirection = 'inbound' | 'outbound';

export interface Communication {
  id: ID;
  strata_scheme_id: ID; // Reference to strata scheme
  task_id?: ID; // Optional - communication may not be linked to a task yet
  customer_id?: ID;
  channel: CommunicationChannel;
  direction: CommunicationDirection;
  timestamp: Timestamp;
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
  notes?: string;
  duration?: number; // For phone calls, in seconds
  created_by?: ID;
  created_at: Timestamp;
  triaged?: boolean; // Whether this communication has been processed/triaged
  triaged_at?: Timestamp; // When it was triaged
  triaged_by?: ID; // Who triaged it
  triage_recommendation?: string; // AI or manual recommendation for handling this communication
  metadata?: JSONObject;
}

// Extended types for UI
export interface TaskWithDetails extends Task {
  customer?: Customer;
  communications?: Communication[];
  communication_count?: number;
  latest_communication?: Communication;
}

// API Response types
export interface TaskCategoryOption {
  value: TaskCategory | 'all';
  label: string;
  count: number;
}

export interface CustomerWithTasks extends Customer {
  task_count?: number;
  latest_task?: Task;
}

// Form data types
export interface CreateTaskData {
  subject: string;
  description?: string;
  priority: TaskPriority;
  category?: TaskCategory;
  customer_email: string;
  customer_name?: string;
  customer_unit?: string;
  due_date?: Timestamp;
  tags?: string[];
}

export interface CreateCommunicationData {
  task_id: ID;
  channel: CommunicationChannel;
  direction: CommunicationDirection;
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
  notes?: string;
  duration?: number;
}

// Filter and query types
export interface TaskFilters {
  category?: TaskCategory | 'all';
  priority?: TaskPriority[];
  status?: TaskStatus[];
  assigned_to?: ID;
  customer_id?: ID;
}

export interface CommunicationFilters {
  task_id?: ID;
  channel?: CommunicationChannel | 'all';
  direction?: CommunicationDirection | 'all';
  date_from?: Timestamp;
  date_to?: Timestamp;
  triaged?: boolean | 'all';
  needs_response?: boolean; // Inbound communications without a task
}

// Extended communication type with customer and task details
export interface CommunicationWithDetails extends Communication {
  customer?: Customer;
  task?: Task;
}