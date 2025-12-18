// TypeScript types based on schema.sql

export type CustomerType = 'owner' | 'committee_member' | 'contractor' | 'other';

export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  unit_number?: string;
  strata_plan_id?: string;
  customer_type?: CustomerType;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  notes?: string;
  metadata: Record<string, unknown>;
}

export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'waiting_on_customer'
  | 'waiting_on_committee'
  | 'resolved'
  | 'closed'
  | 'merged';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory =
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

export interface Ticket {
  id: string;
  customer_id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: TicketCategory;
  assigned_to?: string;
  assigned_at?: string;
  resolved_at?: string;
  closed_at?: string;
  resolution_notes?: string;
  merged_into_ticket_id?: string;
  merged_at?: string;
  merged_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  first_response_at?: string;
  due_date?: string;
  tags?: string[];
  metadata: Record<string, unknown>;
}

export type ChannelType = 'email' | 'web' | 'internal' | 'phone' | 'sms';
export type ThreadDirection = 'inbound' | 'outbound';
export type ThreadStatus = 'received' | 'processing' | 'processed' | 'failed' | 'sent';

export interface Thread {
  id: string;
  ticket_id: string;
  channel_type: ChannelType;
  external_thread_id?: string;
  external_message_id?: string;
  from_address?: string;
  to_addresses?: string[];
  cc_addresses?: string[];
  subject?: string;
  body_text?: string;
  body_html?: string;
  direction?: ThreadDirection;
  status: ThreadStatus;
  received_at: string;
  processed_at?: string;
  sent_at?: string;
  created_at: string;
  is_visible_to_customer: boolean;
  created_by?: string;
  headers: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface ThreadAttachment {
  id: string;
  thread_id: string;
  filename: string;
  content_type?: string;
  file_size_bytes?: number;
  storage_url: string;
  storage_key?: string;
  is_inline: boolean;
  content_id?: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface PrivateComment {
  id: string;
  ticket_id: string;
  comment_text: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  parent_comment_id?: string;
  metadata: Record<string, unknown>;
}

export interface TicketActivity {
  id: string;
  ticket_id: string;
  activity_type: string;
  description?: string;
  actor_id?: string;
  actor_type?: string;
  old_value?: string;
  new_value?: string;
  related_ticket_id?: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface TicketMerge {
  id: string;
  source_ticket_id: string;
  target_ticket_id: string;
  merged_by: string;
  merge_reason?: string;
  merged_at: string;
  metadata: Record<string, unknown>;
}

// Communication activity types
export interface CommunicationActivity {
  id: string;
  ticket_id: string;
  customer_id?: string;
  activity_type: 'phone' | 'sms' | 'email' | 'web' | 'internal';
  direction: 'inbound' | 'outbound';
  timestamp: string;
  duration?: number; // For phone calls, in seconds
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
  notes?: string;
  created_by?: string;
  metadata?: Record<string, unknown>;
}

// Extended types for UI
export interface TicketWithDetails extends Ticket {
  customer?: Customer;
  threads?: Thread[];
  thread_count?: number;
  latest_thread?: Thread;
  summary?: string; // Issue summary
  communications?: CommunicationActivity[]; // All communication activities
}
