import pg from 'pg'

const { Client } = pg

const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error('[schema] DATABASE_URL/NETLIFY_DATABASE_URL is missing.')
  process.exit(1)
}

const requiredTables = ['pages', 'pages_blocks_home_hero', 'payload_migrations']

const client = new Client({ connectionString })

try {
  await client.connect()

  const missing = []

  for (const tableName of requiredTables) {
    const { rows } = await client.query(
      `SELECT to_regclass($1) AS exists`,
      [tableName],
    )

    if (!rows?.[0]?.exists) {
      missing.push(tableName)
    }
  }

  if (missing.length > 0) {
    console.error(`[schema] Missing required table(s): ${missing.join(', ')}`)
    process.exit(1)
  }

  console.log('[schema] Required tables are present.')
} finally {
  await client.end().catch(() => {})
}
