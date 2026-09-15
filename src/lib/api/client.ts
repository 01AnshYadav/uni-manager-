import { Post, Resource, DailyLog, Student } from './types';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetcher<T>(url: string): Promise<T> {
  // Since the backend is on another branch and might not be fully merged yet, 
  // we could potentially hit 404s. We handle standard fetch mechanics here.
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new ApiError(res.status, 'Unauthorized access');
      }
      throw new ApiError(res.status, `API Error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError && err.status !== 404) {
      throw err;
    }
    // Fallback to mock data for development UI visualization
    console.warn(`[Mock Fallback] Failed to fetch ${url}. Returning mock data.`);
    return getMockDataForUrl(url) as unknown as T;
  }
}

// Temporary mock data generator
function getMockDataForUrl(url: string): any[] {
  if (url.includes('/api/posts')) {
    return [
      { id: '1', title: 'Midterm Exam Schedule', body: 'Exams start next week.', priority: 'urgent', category: 'exam', created_by: 'Admin', created_at: new Date().toISOString() },
      { id: '2', title: 'Guest Lecture', body: 'AI lecture on Friday.', priority: 'normal', category: 'event', created_by: 'Admin', created_at: new Date().toISOString() }
    ];
  }
  if (url.includes('/api/resources')) {
    return [
      { id: '1', title: 'Mechanics Slides', file_url: '#', subject: 'Mechanics', uploaded_by: 'Admin', created_at: new Date().toISOString() }
    ];
  }
  if (url.includes('/api/daily-logs')) {
    return [
      { id: '1', log_date: new Date().toISOString().split('T')[0], subject: 'Math', summary: 'Covered calculus.', photo_urls: [], posted_by: 'Admin', created_at: new Date().toISOString() }
    ];
  }
  return [];
}

export const apiClient = {
  async getPosts(params?: { priority?: string; category?: string }): Promise<Post[]> {
    const url = new URL('/api/posts', window.location.origin);
    if (params?.priority) url.searchParams.append('priority', params.priority);
    if (params?.category) url.searchParams.append('category', params.category);
    return fetcher<Post[]>(url.toString());
  },

  async getResources(params?: { subject?: string }): Promise<Resource[]> {
    const url = new URL('/api/resources', window.location.origin);
    if (params?.subject) url.searchParams.append('subject', params.subject);
    return fetcher<Resource[]>(url.toString());
  },

  async getDailyLogs(params?: { date?: string }): Promise<DailyLog[]> {
    const url = new URL('/api/daily-logs', window.location.origin);
    if (params?.date) url.searchParams.append('date', params.date);
    return fetcher<DailyLog[]>(url.toString());
  },

  async getStudents(): Promise<Student[]> {
    return fetcher<Student[]>('/api/students');
  }
};
