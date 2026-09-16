import { createClient } from "@/lib/supabase/client";
import type { Post, DailyLog, Resource, Student } from "@/lib/supabase/types";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) _supabase = createClient();
  return _supabase;
}

async function getUser() {
  const { data } = await getSupabase().auth.getUser();
  return data.user;
}

async function getRole(): Promise<string | null> {
  const user = await getUser();
  if (!user) return null;
  const { data } = await getSupabase()
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return data?.role ?? null;
}

// ── Posts ──────────────────────────────────────────────────────────

export async function fetchPosts(options?: {
  category?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Post[] | null; error: string | null }> {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.priority) params.set("priority", options.priority);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const res = await fetch(`/api/posts?${params.toString()}`);
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to fetch posts" };
  return { data: json.data, error: null };
}

export async function fetchPostById(
  id: string,
): Promise<{ data: Post | null; error: string | null }> {
  const res = await fetch(`/api/posts/${id}`);
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Post not found" };
  return { data: json.data, error: null };
}

export async function createPost(data: {
  title: string;
  body?: string;
  priority: string;
  category?: string;
  event_date?: string;
}): Promise<{ data: Post | null; error: string | null }> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to create post" };
  return { data: json.data, error: null };
}

export async function updatePost(
  id: string,
  data: Partial<Pick<Post, "title" | "body" | "priority" | "category" | "event_date">>,
): Promise<{ data: Post | null; error: string | null }> {
  const res = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to update post" };
  return { data: json.data, error: null };
}

export async function deletePost(
  id: string,
): Promise<{ error: string | null }> {
  const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) return { error: json.error || "Failed to delete post" };
  return { error: null };
}

// ── Resources ──────────────────────────────────────────────────────

export async function fetchResources(options?: {
  subject?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Resource[] | null; error: string | null }> {
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const res = await fetch(`/api/resources?${params.toString()}`);
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to fetch resources" };
  return { data: json.data, error: null };
}

export async function fetchResourceById(
  id: string,
): Promise<{ data: Resource | null; error: string | null }> {
  const res = await fetch(`/api/resources/${id}`);
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Resource not found" };
  return { data: json.data, error: null };
}

export async function createResource(data: {
  title: string;
  file_url: string;
  subject: string;
}): Promise<{ data: Resource | null; error: string | null }> {
  const res = await fetch("/api/resources", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to create resource" };
  return { data: json.data, error: null };
}

export async function deleteResource(
  id: string,
): Promise<{ error: string | null }> {
  const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) return { error: json.error || "Failed to delete resource" };
  return { error: null };
}

// ── Daily Logs ─────────────────────────────────────────────────────

export async function fetchDailyLogs(options?: {
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: DailyLog[] | null; error: string | null }> {
  const params = new URLSearchParams();
  if (options?.from) params.set("from", options.from);
  if (options?.to) params.set("to", options.to);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const res = await fetch(`/api/daily-logs?${params.toString()}`);
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to fetch daily logs" };
  return { data: json.data, error: null };
}

export async function fetchDailyLogById(
  id: string,
): Promise<{ data: DailyLog | null; error: string | null }> {
  const res = await fetch(`/api/daily-logs/${id}`);
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Daily log not found" };
  return { data: json.data, error: null };
}

export async function createDailyLog(data: {
  log_date: string;
  subject?: string;
  summary?: string;
  photo_urls?: string[];
}): Promise<{ data: DailyLog | null; error: string | null }> {
  const res = await fetch("/api/daily-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to create daily log" };
  return { data: json.data, error: null };
}

export async function updateDailyLog(
  id: string,
  data: Partial<Pick<DailyLog, "log_date" | "subject" | "summary" | "photo_urls">>,
): Promise<{ data: DailyLog | null; error: string | null }> {
  const res = await fetch(`/api/daily-logs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to update daily log" };
  return { data: json.data, error: null };
}

export async function deleteDailyLog(
  id: string,
): Promise<{ error: string | null }> {
  const res = await fetch(`/api/daily-logs/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) return { error: json.error || "Failed to delete daily log" };
  return { error: null };
}

// ── Students ───────────────────────────────────────────────────────

export async function fetchStudents(options?: {
  limit?: number;
  offset?: number;
}): Promise<{ data: Student[] | null; error: string | null }> {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const res = await fetch(`/api/students?${params.toString()}`);
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to fetch students" };
  return { data: json.data, error: null };
}

export async function createStudent(data: {
  name: string;
  phone_or_telegram: string;
}): Promise<{ data: Student | null; error: string | null }> {
  const res = await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error || "Failed to create student" };
  return { data: json.data, error: null };
}

// ── Auth ───────────────────────────────────────────────────────────

export async function fetchUserRole(): Promise<string | null> {
  return getRole();
}

export async function fetchCurrentUser() {
  return getUser();
}
