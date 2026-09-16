import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireCR } from "@/lib/supabase/auth";
import {
  createStudent,
  getStudentByPhone,
  getStudents,
} from "@/lib/supabase/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const auth = await requireCR(supabase);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const { name, phone_or_telegram } = body;

  if (!name || !phone_or_telegram) {
    return NextResponse.json({ error: "name and phone_or_telegram are required" }, { status: 400 });
  }

  const existing = await getStudentByPhone(supabase, phone_or_telegram);
  if (existing.data) {
    return NextResponse.json({ error: "Student with this phone/telegram already exists" }, { status: 409 });
  }

  const { data, error } = await createStudent(supabase, { name, phone_or_telegram });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const auth = await requireAdmin(supabase);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
  const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

  const { data, error } = await getStudents(supabase, { limit, offset });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}
