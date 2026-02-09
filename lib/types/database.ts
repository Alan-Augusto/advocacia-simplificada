export type LeadStatus =
  | 'em_andamento'
  | 'quente'
  | 'frio'
  | 'contatado'
  | 'fechado'
  | 'perdido';

export type MessageRole = 'user' | 'assistant' | 'system';

export type PromptType = 'base' | 'service';

export interface Lead {
  id: string;
  code: string;
  name: string;
  phone: string;
  service_id: string;
  service_title: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  lead_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface Service {
  id: string;
  code: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  color_class: string;
  is_active: boolean;
  order: number;
  initial_message: string;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  type: PromptType;
  service_code: string | null;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// Formatted types for API responses
export interface LeadWithMessages extends Lead {
  messages?: Message[];
}

export interface LeadStats {
  total: number;
  quente: number;
  em_andamento: number;
  conversao: number;
}
