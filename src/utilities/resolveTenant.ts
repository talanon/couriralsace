import { getPayload } from 'payload'
import config from '@payload-config'
import type { Tenant as PayloadTenant } from '@/payload-types'

const HUB_HOSTS = new Set([
  'couriralsace.fr',
  'www.couriralsace.fr',
  'couriralsace.localhost',
  'localhost',
  '127.0.0.1',
  '::1',
])

export type Tenant = PayloadTenant

const tenantCache = new Map<string, Tenant | null>()

const normalizeHost = (host: string | null) => {
  if (!host) return ''
  const hostWithoutPort = host.split(':')[0].toLowerCase().trim()
  return hostWithoutPort.replace(/\.$/, '')
}

export const isHubHost = (host: string | null) => {
  return HUB_HOSTS.has(normalizeHost(host))
}

export const resolveTenant = async (host: string | null) => {
  const normalizedHost = normalizeHost(host)
  if (!normalizedHost || isHubHost(normalizedHost)) {
    return null
  }

  if (tenantCache.has(normalizedHost)) {
    return tenantCache.get(normalizedHost) || null
  }

  const fetchTenant = async (hostKey: string) => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'tenants',
      depth: 0,
      limit: 1,
      where: {
        'domains.host': {
          equals: hostKey,
        },
      },
      overrideAccess: true,
    })

    const tenant = result.docs?.[0]
    if (tenant) {
      tenantCache.set(hostKey, tenant as Tenant)
      return tenant as Tenant
    }

    return null
  }
  let tenant = await fetchTenant(normalizedHost)
  if (!tenant && normalizedHost.includes('.')) {
    const [maybeSubdomain] = normalizedHost.split('.')
    if (maybeSubdomain && !isHubHost(maybeSubdomain)) {
      tenant = await fetchTenant(maybeSubdomain)
      if (tenant) {
        tenantCache.set(normalizedHost, tenant)
        return tenant
      }
    }
  }

  tenantCache.set(normalizedHost, tenant)
  return tenant
}
