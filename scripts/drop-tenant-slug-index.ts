import { Client } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = new Client({ connectionString: process.env.DATABASE_URL })

const run = async () => {
  try {
    await client.connect()
    await client.query('DROP INDEX IF EXISTS tenants_slug_idx;')
    console.log('Dropped tenants_slug_idx')
  } finally {
    await client.end()
  }
}

void run()
