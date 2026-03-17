import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// One-time setup route — creates admin@edmento.in in Supabase Auth
// Call GET /api/setup-admin to create the user (only needed once)
export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!, // service_role key
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Check if user already exists first
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const existing = users.find(u => u.email === 'admin@edmento.in');
  if (existing) {
    return NextResponse.json({ message: 'User admin@edmento.in already exists.', id: existing.id });
  }

  // Create the user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@edmento.in',
    password: 'Edmento@2024',
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Admin user created successfully!',
    email: data.user?.email,
    id: data.user?.id,
    note: 'Default password: Edmento@2024 — change it immediately.',
  });
}
