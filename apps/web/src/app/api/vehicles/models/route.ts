import { NextResponse, type NextRequest } from 'next/server'
import { getModelsByMake } from '@automec/db'

export async function GET(req: NextRequest) {
  const makeId = req.nextUrl.searchParams.get('makeId')
  if (!makeId) return NextResponse.json({ error: 'makeId required' }, { status: 400 })
  const models = await getModelsByMake(makeId)
  return NextResponse.json(models)
}
