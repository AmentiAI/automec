import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUploadUrl, getFileKey } from '@/lib/r2'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, id, filename, contentType } = body

  if (!type || !id || !filename || !contentType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const key = getFileKey(type, id, filename)
  const { uploadUrl, publicUrl } = await getUploadUrl(key, contentType)

  return NextResponse.json({ uploadUrl, publicUrl, key })
}
