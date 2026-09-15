export interface Post {
  id: string;
  title: string;
  body: string;
  priority: 'urgent' | 'normal';
  category: 'exam' | 'assignment' | 'event' | 'general';
  event_date?: string;
  created_by: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  file_url: string;
  subject: string;
  uploaded_by: string;
  created_at: string;
}

export interface DailyLog {
  id: string;
  log_date: string;
  subject: string;
  summary: string;
  photo_urls: string[];
  posted_by: string;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  phone_or_telegram?: string;
  joined_at: string;
}
