import { NextResponse } from 'next/server'
import { getMakes } from '@automec/db'

export async function GET() {
  const makes = await getMakes()
  return NextResponse.json(makes)
}
