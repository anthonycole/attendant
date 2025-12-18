// User types for directory management

export type UserRole = 
  | 'owner'
  | 'tenant'
  | 'committee_member'
  | 'proxy'
  | 'agent'
  | 'contractor'
  | 'manager'
  | 'other';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  unit_number?: string;
  lot_number?: string;
  entitlement?: number;
  role: UserRole;
  status: UserStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  preferred_contact?: 'email' | 'phone' | 'sms';
}

export interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  unit_number?: string;
  lot_number?: string;
  entitlement?: number;
  role: UserRole;
  notes?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  preferred_contact?: 'email' | 'phone' | 'sms';
}

export interface UserFilters {
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  unit?: string;
  search?: string;
}