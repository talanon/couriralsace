import { NextRequest, NextResponse } from 'next/server'

import { isHubHost, resolveTenant } from '@/utilities/resolveTenant'

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host')

  if (!host || isHubHost(host)) {
    return NextResponse.next()
  }

  const tenant = await resolveTenant(host)
  if (!tenant) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  response.headers.set('x-courir-tenant-id', tenant.id)
  response.headers.set('x-courir-tenant-slug', tenant.slug)
  response.headers.set('x-courir-tenant-name', tenant.name ?? '')

  return response
}

export const config = {
  matcher: ['/((?!api|_next|static|payload).*)'],
}
