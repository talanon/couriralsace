import type { Hook } from 'payload'

import {
  getTenantIdFromRequest,
  getTenantIds,
  getTenantIdsFromMemberships,
  getTenantMembershipsFromRequest,
  normalizeTenantId,
} from '../access/tenants'

const coerceTenantId = (value?: string | number | null) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }

  const normalized = normalizeTenantId(value as Parameters<typeof normalizeTenantId>[0])
  if (!normalized) return null

  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const hasTenantValue = (data?: Record<string, unknown>) => {
  if (!data || !('tenant' in data)) return false
  const value = (data as { tenant?: unknown }).tenant
  if (value === null || value === undefined) return false
  if (typeof value === 'string' && value.trim() === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  return true
}

export const assignTenantFromUser: Hook = async ({ req, data }) => {
  if (!data) return

  const requestTenantId = coerceTenantId(await getTenantIdFromRequest(req))
  if (requestTenantId) {
    data.tenant = requestTenantId
    return data
  }

  if (!req.user) return data

  const memberships = await getTenantMembershipsFromRequest(req)
  const primaryTenantFromMemberships = getTenantIdsFromMemberships(memberships)
    .map((value) => coerceTenantId(value))
    .find((id) => Boolean(id))
  if (primaryTenantFromMemberships) {
    if (!hasTenantValue(data)) {
      data.tenant = primaryTenantFromMemberships
    }
    return data
  }

  const primaryTenantFromUser = getTenantIds(req.user)
    .map((value) => coerceTenantId(value))
    .find((id) => Boolean(id))
  if (!primaryTenantFromUser) return data

  if (!hasTenantValue(data)) {
    data.tenant = primaryTenantFromUser
  }

  return data
}
