import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Tenant } from '@/payload-types'

async function getTenantNav(tenantId: number) {
  if (!tenantId) {
    return null
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const tenant = await payload.findByID({
      collection: 'tenants',
      depth: 2,
      id: tenantId.toString(),
    })

    return tenant ? { navItems: tenant.navItems } : null
  } catch (error) {
    return null
  }
}

export const getCachedTenantNav = (tenantId: number) =>
  unstable_cache(async () => getTenantNav(tenantId), [tenantId.toString()], {
    tags: [`tenant_nav_${tenantId}`],
  })
