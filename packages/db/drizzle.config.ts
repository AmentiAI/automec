import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
import path from 'path'

// Load .env from repo root
config({ path: path.resolve(process.cwd(), '../../.env') })

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
  verbose: true,
  strict: true,
})
