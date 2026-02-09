import type { CollectionBeforeChangeHook } from 'payload'

import type { Page } from '@/payload-types'

const resolveTenantId = (tenant?: Page['tenant']) => {
  if (typeof tenant === 'number') {
    return tenant
  }
  if (typeof tenant === 'string') {
    const parsed = Number(tenant)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return typeof tenant?.id === 'number'
    ? tenant.id
    : typeof tenant?.id === 'string'
    ? Number(tenant.id)
    : undefined
}

export const ensureUniquePageSlug: CollectionBeforeChangeHook<Page> = async ({
  data,
  originalDoc,
  req,
}) => {
  const slug = data?.slug ?? originalDoc?.slug
  if (!slug || !req) {
    return data
  }

  const tenantField = data?.tenant ?? originalDoc?.tenant
  const tenantId = resolveTenantId(tenantField)
  if (!tenantId) {
    return data
  }

  const result = await req.payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
      tenant: {
        equals: tenantId,
      },
    },
    overrideAccess: true,
    req,
  })

  const conflict = result.docs?.[0]
  if (conflict && conflict.id !== originalDoc?.id) {
    throw new Error(`Le slug "${slug}" est déjà utilisé pour ce tenant`)
  }

  return data
}
