export interface Admin {
  id: string;
  name: string;
  role: string | null;
}

export interface Student {
  id: string;
  name: string;
  phone_or_telegram: string;
  joined_at: string | null;
}

export interface Post {
  id: string;
  title: string;
  body: string | null;
  priority: string;
  category: string | null;
  event_date: string | null;
  created_by: string | null;
  created_at: string | null;
}

export interface DailyLog {
  id: string;
  log_date: string;
  subject: string | null;
  summary: string | null;
  photo_urls: string[] | null;
  posted_by: string | null;
  created_at: string | null;
}

export interface Resource {
  id: string;
  title: string;
  file_url: string;
  subject: string;
  uploaded_by: string | null;
  created_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      admins: { Row: Admin };
      students: { Row: Student };
      posts: { Row: Post };
      daily_logs: { Row: DailyLog };
      resources: { Row: Resource };
    };
  };
}
