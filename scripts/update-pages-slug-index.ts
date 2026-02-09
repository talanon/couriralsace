import { Client } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = new Client({ connectionString: process.env.DATABASE_URL })

const run = async () => {
  try {
    await client.connect()
    await client.query('DROP INDEX IF EXISTS pages_slug_idx')
    await client.query('DROP INDEX IF EXISTS pages_slug_tenant_idx')
    await client.query(
      'CREATE UNIQUE INDEX pages_slug_tenant_idx ON pages (slug, tenant_id)',
    )
    console.log('Ensured pages_slug_tenant_idx exists (slug + tenant_id)')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to recreate slug index for pages', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

void run()
