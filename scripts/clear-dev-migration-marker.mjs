import pg from 'pg'

const { Client } = pg

const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.warn('[migrations] DATABASE_URL/NETLIFY_DATABASE_URL is missing, skipping dev marker cleanup.')
  process.exit(0)
}

const client = new Client({ connectionString })

try {
  await client.connect()

  const result = await client.query(
    `
      DELETE FROM payload_migrations
      WHERE batch = -1 OR name = 'dev'
    `,
  )

  console.log(`[migrations] Removed ${result.rowCount ?? 0} dev migration marker(s).`)
} catch (error) {
  const relationMissing = error && typeof error === 'object' && error.code === '42P01'

  if (relationMissing) {
    console.log('[migrations] payload_migrations table does not exist yet, nothing to clean.')
  } else {
    throw error
  }
} finally {
  await client.end().catch(() => {})
}
