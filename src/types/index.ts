export type AnnouncementCategory = 'exam' | 'assignment' | 'event' | 'general';
export type AnnouncementPriority = 'urgent' | 'normal';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  created_at: string;
  admin_id?: string;
}

export interface Resource {
  id: string;
  title: string;
  subject_tag: string;
  file_url: string;
  created_at: string;
  admin_id?: string;
}

export interface DailyLog {
  id: string;
  log_date: string;
  subject: string;
  description: string;
  photo_urls: string[];
  created_at: string;
  admin_id?: string;
}

// Mock Data
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Midterm Exam Schedule Released',
    content: 'The schedule for the upcoming midterm exams has been posted. Please review it carefully. Exams begin next week.',
    category: 'exam',
    priority: 'urgent',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Guest Lecture: Intro to AI',
    content: 'Join us this Friday in the main auditorium for a guest lecture by Dr. Smith on the future of Artificial Intelligence.',
    category: 'event',
    priority: 'normal',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Physics Lab Report Deadline Extended',
    content: 'Due to equipment issues, the deadline for the Physics lab report has been extended to Monday.',
    category: 'assignment',
    priority: 'normal',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Engineering Mechanics - Chapter 1 Slides',
    subject_tag: 'Engineering Mechanics',
    file_url: '#',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Calculus Cheat Sheet',
    subject_tag: 'Mathematics',
    file_url: '#',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Physics Formuale PDF',
    subject_tag: 'Physics',
    file_url: '#',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const mockDailyLogs: DailyLog[] = [
  {
    id: '1',
    log_date: new Date().toISOString().split('T')[0],
    subject: 'Engineering Mechanics',
    description: "Covered Newton's Laws of Motion. We discussed the theoretical aspects and solved 3 numerical problems from the textbook.",
    photo_urls: ['https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    log_date: new Date().toISOString().split('T')[0],
    subject: 'Mathematics',
    description: 'Introduction to differential equations. Homework assigned: problems 1-10 on page 42.',
    photo_urls: [],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    log_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    subject: 'Physics',
    description: 'Lab session on pendulum motion. All groups completed the experiment.',
    photo_urls: [],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];
