// src/types/index.ts

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'Social Media'
  | 'Email Campaign'
  | 'Cold Call'
  | 'Event'
  | 'Partner'
  | 'Other';

export interface TimelineEvent {
  date: string; // ISO 8601
  label: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  assignedTo: string | null;
  assignedToUser?: Pick<User, '_id' | 'name' | 'email'>;
  createdDate?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export type LeadFormData = Omit<Lead, '_id' | 'createdAt' | 'updatedAt' | 'timeline' | 'createdBy'>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ApiResponse<T> = PaginatedResponse<T>;

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface StatusConfig {
  color: string;
  bg: string;
  border: string;
  dot: string;
  icon: string;
}

export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}