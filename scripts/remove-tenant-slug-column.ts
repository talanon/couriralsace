import { Client } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = new Client({ connectionString: process.env.DATABASE_URL })

const run = async () => {
  try {
    await client.connect()
    await client.query('ALTER TABLE tenants DROP COLUMN IF EXISTS slug;')
    console.log('Dropped slug column from tenants table')
  } finally {
    await client.end()
  }
}

void run()
