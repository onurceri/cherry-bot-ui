export interface ApiResponse<T> {
  data: T;
  status: string;
}

export interface AppearanceConfig {
  primary_color: string;
  background_color: string;
  chat_bubble_user: string;
  chat_bubble_user_text: string;
  chat_bubble_bot: string;
  chat_bubble_bot_text: string;
  font_family: string;
  logo_url?: string;
  launcher_icon: string;
  position: 'bottom-right' | 'bottom-left';
  auto_open: boolean;
}

export interface Bot {
  id: string;
  user_id: string;
  name: string;
  google_store_id?: string;
  system_instruction?: string;
  welcome_message?: string;
  is_active: boolean;
  appearance_config?: AppearanceConfig;
  created_at: string;
}

export interface Source {
  id: string;
  source_type: 'url' | 'file' | 'text';
  source_name: string;
  char_count: number;
  status: 'pending' | 'processing' | 'ready' | 'error';
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  is_handoff: boolean;
}

export interface User {
  id: string;
  email: string;
  plan_type: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
