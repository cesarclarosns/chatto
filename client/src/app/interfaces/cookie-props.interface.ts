export interface CookieProps {
  id: number;
  email: string;
  jwt?: string;
}

export interface Email {
  user_id: string;
  record_id: string;
  message_id: string;
}
