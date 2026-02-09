import type { Hook } from 'payload'

import { isSuperAdmin } from '@/access/tenants'

export const requireTenantField: Hook = ({ data, req }) => {
  if (isSuperAdmin(req?.user)) return data
  if (!data) return data
  if (!data.tenant) {
    throw new Error('Le tenant est requis sauf pour les super-admins')
  }
  return data
}
