import type { Hook } from 'payload'

import { getTenantIdFromRequest, getTenantIds } from '../access/tenants'

export const assignTenantFromUser: Hook = async ({ req, data }) => {
  if (!data) return

  const requestTenantId = await getTenantIdFromRequest(req)
  if (requestTenantId) {
    data.tenant = requestTenantId
    return data
  }

  if (!req.user) return data

  const [primaryTenant] = getTenantIds(req.user)
  if (!primaryTenant) return data

  if (!('tenant' in data) || data.tenant === null) {
    data.tenant = primaryTenant
  }

  return data
}
