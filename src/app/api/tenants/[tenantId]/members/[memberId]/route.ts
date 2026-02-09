import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { tenantId: string; memberId: string } },
) {
  const payload = await getPayload({ config, req })
  const { tenantId, memberId } = await params

  if (!req.headers.get('cookie')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!memberId) {
    return NextResponse.json({ errors: [{ message: 'Member id is required' }] }, { status: 400 })
  }

  const data = await req.json()

  const result = await payload.update({
    collection: 'users',
    id: memberId,
    data,
    req,
    overrideAccess: true,
  })

  return NextResponse.json(result)
}
