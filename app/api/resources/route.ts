import { createClient } from "@/lib/supabase/server";
import { requireCR } from "@/lib/supabase/auth";
import { getResources, createResource } from "@/lib/supabase/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const subject = searchParams.get("subject") ?? undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
  const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

  const { data, error } = await getResources(supabase, { subject, limit, offset });

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
  const { title, file_url, subject } = body;

  if (!title || !file_url || !subject) {
    return NextResponse.json({ error: "title, file_url, and subject are required" }, { status: 400 });
  }

  const { data, error } = await createResource(supabase, {
    title,
    file_url,
    subject,
    uploaded_by: auth.user.id,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
