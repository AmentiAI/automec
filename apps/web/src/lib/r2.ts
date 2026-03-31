import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env['R2_ACCESS_KEY_ID']!,
    secretAccessKey: process.env['R2_SECRET_ACCESS_KEY']!,
  },
})

const BUCKET = process.env['R2_BUCKET_NAME'] ?? 'automec-files'
const PUBLIC_URL = process.env['R2_PUBLIC_URL'] ?? 'https://files.automec.io'

export async function getUploadUrl(key: string, contentType: string, expiresIn = 3600) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType })
  const url = await getSignedUrl(r2, command, { expiresIn })
  return { uploadUrl: url, publicUrl: `${PUBLIC_URL}/${key}` }
}

export async function deleteFile(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

export function getFileKey(type: 'tune' | 'part-image' | 'dyno' | 'import', id: string, filename: string) {
  return `${type}/${id}/${Date.now()}-${filename}`
}
