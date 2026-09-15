import { createClient } from "@/lib/supabase/server";
import { requireCR } from "@/lib/supabase/auth";
import { getPosts, createPost } from "@/lib/supabase/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") ?? undefined;
  const priority = searchParams.get("priority") ?? undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
  const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

  const { data, error } = await getPosts(supabase, { category, priority, limit, offset });

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
  const { title, body: postBody, priority, category, event_date } = body;

  if (!title || !priority) {
    return NextResponse.json({ error: "title and priority are required" }, { status: 400 });
  }

  const { data, error } = await createPost(supabase, {
    title,
    body: postBody,
    priority,
    category,
    event_date,
    created_by: auth.user.id,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
