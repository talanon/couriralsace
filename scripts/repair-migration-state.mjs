import fs from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg

const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.warn('[migrations] DATABASE_URL/NETLIFY_DATABASE_URL is missing, skipping migration state repair.')
  process.exit(0)
}

const requiredTable = 'pages_blocks_home_hero'
const migrationsDir = path.resolve(process.cwd(), 'src', 'migrations')

const client = new Client({ connectionString })

try {
  await client.connect()

  const requiredTableQuery = await client.query(`SELECT to_regclass($1) AS exists`, [requiredTable])
  const hasRequiredTable = Boolean(requiredTableQuery.rows?.[0]?.exists)

  if (hasRequiredTable) {
    console.log('[migrations] Required table exists, skipping migration state repair.')
    process.exit(0)
  }

  const migrationFiles = await fs.readdir(migrationsDir)
  const migrationNames = migrationFiles
    .filter((file) => /^\d+.*\.ts$/.test(file))
    .map((file) => file.replace(/\.ts$/, ''))

  if (migrationNames.length === 0) {
    console.log('[migrations] No migration files found, skipping migration state repair.')
    process.exit(0)
  }

  const result = await client.query(
    `
      DELETE FROM payload_migrations
      WHERE name = ANY($1::text[])
    `,
    [migrationNames],
  )

  console.log(
    `[migrations] Required table is missing. Removed ${result.rowCount ?? 0} migration record(s): ${migrationNames.join(', ')}`,
  )
} catch (error) {
  const relationMissing = error && typeof error === 'object' && error.code === '42P01'

  if (relationMissing) {
    console.log('[migrations] payload_migrations table does not exist yet, nothing to repair.')
  } else {
    throw error
  }
} finally {
  await client.end().catch(() => {})
}
