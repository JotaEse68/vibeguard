import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'VibeguARD by Jota!', ts: new Date().toISOString() })
}
