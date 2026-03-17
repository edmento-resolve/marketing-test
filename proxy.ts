import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No route protection — auth lives only on the main page (/)
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: [] };
