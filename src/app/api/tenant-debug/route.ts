import { NextRequest, NextResponse } from 'next/server'

import { resolveTenant } from '@/utilities/resolveTenant'

export async function GET(req: NextRequest) {
  const host = req.headers.get('host')
  const tenant = await resolveTenant(host)
  return NextResponse.json({
    host,
    tenant,
    note: 'Utilise cette route pour confirmer que le middleware résout bien le tenant en fonction du Host.',
  })
}
