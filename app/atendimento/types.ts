export type Service = {
  id?: string; // UUID from database
  code?: string; // Service code (01-09)
  title: string;
  description: string;
  tags: string[];
  icon: string;
  colorClass?: string; // Legacy field
  color_class?: string; // Database field
  highlight?: boolean;
  is_active?: boolean;
  order?: number;
  initial_message?: string;
  created_at?: string;
  updated_at?: string;
};

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  hidden?: boolean;
};

export type Step = "selection" | "contact" | "chat";

export interface ContactInfo {
  name: string;
  phone: string;
}
