import { createClient } from "@/lib/supabase/server";
import { requireCR } from "@/lib/supabase/auth";
import { getDailyLogs, createDailyLog } from "@/lib/supabase/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
  const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

  const { data, error } = await getDailyLogs(supabase, { from, to, limit, offset });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const auth = await requireCR(supabase);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const { log_date, subject, summary, photo_urls } = body;

  if (!log_date) {
    return NextResponse.json({ error: "log_date is required" }, { status: 400 });
  }

  const { data, error } = await createDailyLog(supabase, {
    log_date,
    subject,
    summary,
    photo_urls,
    posted_by: auth.user.id,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
