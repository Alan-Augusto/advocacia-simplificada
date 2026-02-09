export type Service = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  colorClass: string;
  highlight?: boolean;
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
