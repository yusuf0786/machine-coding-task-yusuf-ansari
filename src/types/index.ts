// src/types/index.ts

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'LinkedIn'
  | 'Cold Call'
  | 'Email Campaign'
  | 'Trade Show'
  | 'Other';

export interface TimelineEvent {
  date: string; // ISO 8601
  label: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  createdDate: string; // ISO 8601
  timeline: TimelineEvent[];
}

export type LeadFormData = Omit<Lead, 'id' | 'createdDate' | 'timeline'>;

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
