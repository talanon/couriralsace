import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

const toNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function GET(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const payload = await getPayload({ config, req })
  const { tenantId } = await params

  if (!req.headers.get('cookie')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (!tenantId) {
    return NextResponse.json({ docs: [] })
  }

  const searchParams = req.nextUrl.searchParams
  const limit = toNumber(searchParams.get('limit'), 200)
  const depth = toNumber(searchParams.get('depth'), 0)
  const sort = searchParams.get('sort') || 'name'

  const result = await payload.find({
    collection: 'users',
    depth,
    limit,
    sort,
    where: {
      'tenantMemberships.tenant': {
        equals: tenantId,
      },
    },
    req,
    overrideAccess: true,
  })

  return NextResponse.json(result)
}
