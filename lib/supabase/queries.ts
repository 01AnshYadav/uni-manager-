import { type SupabaseClient } from "@supabase/supabase-js";
import type { Post, DailyLog, Resource, Student, Admin } from "./types";

type SupabaseDB = SupabaseClient<any, "public", any>;

// ── Posts (Announcements) ──────────────────────────────────────────

export async function getPosts(
  supabase: SupabaseDB,
  options?: { category?: string; priority?: string; limit?: number; offset?: number },
): Promise<{ data: Post[] | null; error: string | null }> {
  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.category) query = query.eq("category", options.category);
  if (options?.priority) query = query.eq("priority", options.priority);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getPostById(
  supabase: SupabaseDB,
  id: string,
): Promise<{ data: Post | null; error: string | null }> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function createPost(
  supabase: SupabaseDB,
  post: Pick<Post, "title" | "body" | "priority" | "category" | "event_date" | "created_by">,
): Promise<{ data: Post | null; error: string | null }> {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updatePost(
  supabase: SupabaseDB,
  id: string,
  updates: Partial<Pick<Post, "title" | "body" | "priority" | "category" | "event_date">>,
): Promise<{ data: Post | null; error: string | null }> {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deletePost(
  supabase: SupabaseDB,
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Daily Logs ─────────────────────────────────────────────────────

export async function getDailyLogs(
  supabase: SupabaseDB,
  options?: { from?: string; to?: string; limit?: number; offset?: number },
): Promise<{ data: DailyLog[] | null; error: string | null }> {
  let query = supabase
    .from("daily_logs")
    .select("*")
    .order("log_date", { ascending: false });

  if (options?.from) query = query.gte("log_date", options.from);
  if (options?.to) query = query.lte("log_date", options.to);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getDailyLogById(
  supabase: SupabaseDB,
  id: string,
): Promise<{ data: DailyLog | null; error: string | null }> {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function createDailyLog(
  supabase: SupabaseDB,
  log: Pick<DailyLog, "log_date" | "subject" | "summary" | "photo_urls" | "posted_by">,
): Promise<{ data: DailyLog | null; error: string | null }> {
  const { data, error } = await supabase
    .from("daily_logs")
    .insert(log)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateDailyLog(
  supabase: SupabaseDB,
  id: string,
  updates: Partial<Pick<DailyLog, "log_date" | "subject" | "summary" | "photo_urls">>,
): Promise<{ data: DailyLog | null; error: string | null }> {
  const { data, error } = await supabase
    .from("daily_logs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deleteDailyLog(
  supabase: SupabaseDB,
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("daily_logs").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Resources ──────────────────────────────────────────────────────

export async function getResources(
  supabase: SupabaseDB,
  options?: { subject?: string; limit?: number; offset?: number },
): Promise<{ data: Resource[] | null; error: string | null }> {
  let query = supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.subject) query = query.eq("subject", options.subject);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getResourceById(
  supabase: SupabaseDB,
  id: string,
): Promise<{ data: Resource | null; error: string | null }> {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function createResource(
  supabase: SupabaseDB,
  resource: Pick<Resource, "title" | "file_url" | "subject" | "uploaded_by">,
): Promise<{ data: Resource | null; error: string | null }> {
  const { data, error } = await supabase
    .from("resources")
    .insert(resource)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deleteResource(
  supabase: SupabaseDB,
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Students ───────────────────────────────────────────────────────

export async function getStudents(
  supabase: SupabaseDB,
  options?: { limit?: number; offset?: number },
): Promise<{ data: Student[] | null; error: string | null }> {
  let query = supabase
    .from("students")
    .select("*")
    .order("joined_at", { ascending: false });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function createStudent(
  supabase: SupabaseDB,
  student: Pick<Student, "name" | "phone_or_telegram">,
): Promise<{ data: Student | null; error: string | null }> {
  const { data, error } = await supabase
    .from("students")
    .insert(student)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getStudentByPhone(
  supabase: SupabaseDB,
  phoneOrTelegram: string,
): Promise<{ data: Student | null; error: string | null }> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("phone_or_telegram", phoneOrTelegram)
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

// ── Admin check ────────────────────────────────────────────────────

export async function getAdminByUserId(
  supabase: SupabaseDB,
  userId: string,
): Promise<{ data: Admin | null; error: string | null }> {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
