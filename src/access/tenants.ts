import type { AccessArgs, Where, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'
import { resolveTenant } from '@/utilities/resolveTenant'

type TenantRelationship = string | { id?: string | null }
type TenantMembership = {
  tenant?: TenantRelationship
  role?: string
}

const membershipCacheKey = '__courirTenantMemberships'
const tenantRequestCacheKey = '__courirTenantIdFromRequest'
const tenantHeaderKey = 'x-courir-tenant-id'

export const getTenantMembershipsFromRequest = async (req: AccessArgs['req']): Promise<TenantMembership[]> => {
  if (!req.payload || !req.user) return []

  const cached = (req as any)[membershipCacheKey]
  const userDoc = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
    depth: 1,
    overrideAccess: true,
  })

  const memberships = Array.isArray(userDoc?.tenantMemberships) ? userDoc.tenantMemberships : []
  ;(req as any)[membershipCacheKey] = memberships
  return memberships
}

export const normalizeTenantId = (value: TenantRelationship | undefined | null): string | null => {
  if (!value) return null
  if (typeof value === 'string' && value.length) return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    const objectId = (value as { id?: string | number | null }).id ??
      (value as { value?: string | number | null }).value
    if (typeof objectId === 'string' && objectId.length) return objectId
    if (typeof objectId === 'number') return String(objectId)
  }
  return null
}

const normalizeRoles = (roles?: string | string[]) =>
  Array.isArray(roles) ? roles.filter(Boolean) : roles ? [roles] : []

const membershipTenantIds = (memberships: TenantMembership[] = []) =>
  memberships
    .map((membership) => normalizeTenantId(membership?.tenant))
    .filter((id): id is string => Boolean(id))

export const getTenantIdsFromMemberships = (memberships: TenantMembership[] = []) =>
  membershipTenantIds(memberships)

const getMemberships = (user?: User): TenantMembership[] => {
  const memberships = Array.isArray(user?.tenantMemberships) ? user?.tenantMemberships : []
  return memberships
}

export const getTenantIds = (user?: User): string[] => {
  const membershipIds = membershipTenantIds(getMemberships(user))
  const legacyIds = Array.isArray(user?.tenants) ? membershipTenantIds(user.tenants as TenantRelationship[]) : []

  const ids = Array.from(new Set([...membershipIds, ...legacyIds]))
  return ids
}

export const getTenantMembership = (user?: User, tenantId?: string): TenantMembership | null => {
  if (!tenantId) return null
  return (
    getMemberships(user).find((membership) => normalizeTenantId(membership?.tenant) === tenantId) || null
  )
}

const findMembershipByTenant = (tenantId: string | undefined | null, memberships: TenantMembership[]) => {
  if (!tenantId) return null
  for (const membership of memberships) {
    const normalized = normalizeTenantId(membership?.tenant)
    if (normalized === tenantId) {
      return membership
    }
  }
  return null
}

export const hasTenantRole = (
  user: User | undefined,
  tenantId: string | undefined,
  roles?: string | string[],
  memberships?: TenantMembership[],
  context: 'isAllowed' | 'requireTenantRole' | 'unknown' = 'unknown',
) => {
  if (!tenantId) return false
  const allowedRoles = normalizeRoles(roles)
  if (!allowedRoles.length) return false

  const membership = memberships
    ? findMembershipByTenant(tenantId, memberships)
    : getTenantMembership(user, tenantId)

  if (!membership) {
    return false
  }

  if (!membership.role) {
    return false
  }
  return allowedRoles.includes(membership.role)
}


export const isSuperAdmin = (user?: User) => Boolean(user?.roles?.includes('super-admin'))

const getTenantFieldValue = (value: TenantRelationship | undefined | null) => normalizeTenantId(value)

const tenantHeaderFromReq = (req: AccessArgs['req']) =>
  typeof req.headers?.get === 'function' ? req.headers.get('x-courir-tenant-id') : null

export const getTenantIdFromArgs = (args: AccessArgs): string | null => {
  const { doc, data, req } = args
  const headerTenant = tenantHeaderFromReq(req)
  if (headerTenant) {
    return normalizeTenantId(headerTenant)
  }

  const fromDoc =
    getTenantFieldValue((doc as { tenant?: TenantRelationship | null })?.tenant) ||
    getTenantFieldValue((doc as { tenant?: { id?: string | null } })?.tenant)
  if (fromDoc) return fromDoc

  const fromData =
    getTenantFieldValue((data as { tenant?: TenantRelationship | null })?.tenant) ||
    getTenantFieldValue((data as { tenant?: { id?: string | null } })?.tenant)
  if (fromData) return fromData

  const bodyTenant = (req as { body?: any })?.body?.tenant ?? (req as { body?: any })?.body?.data?.tenant
  if (bodyTenant) {
    return normalizeTenantId(bodyTenant)
  }

  return null
}

export const getTenantIdFromRequest = async (req?: PayloadRequest): Promise<string | null> => {
  if (!req) return null

  const cached = (req as any)[tenantRequestCacheKey]
  if (cached !== undefined) {
    return cached
  }

  if (typeof req.headers?.get === 'function') {
    const headerTenant = req.headers.get(tenantHeaderKey)
    if (headerTenant) {
      const normalizedHeader = normalizeTenantId(headerTenant)
      ;(req as any)[tenantRequestCacheKey] = normalizedHeader
      return normalizedHeader
    }
  }

  const host = typeof req.headers?.get === 'function' ? req.headers.get('host') : null
  const tenant = await resolveTenant(host)
  const tenantId = tenant?.id ?? null
  const normalizedTenantId = normalizeTenantId(tenantId)
  ;(req as any)[tenantRequestCacheKey] = normalizedTenantId
  return normalizedTenantId
}

const isAllowed = ({ req: { user } }: AccessArgs, field: string | void, allowedRoles?: string | string[]) => {
  if (!user) return false

  if (isSuperAdmin(user)) {
    return true
  }

  const tenantIds = getTenantIds(user)
  if (!tenantIds.length) {
    return false
  }

  if (allowedRoles) {
    // ensure user has required role for at least one of their tenants
    const satisfiesRole = tenantIds.some((tenantId) =>
      hasTenantRole(user, tenantId, allowedRoles, undefined, 'isAllowed'),
    )
    if (!satisfiesRole) {
      return false
    }
  }

  if (!field) return true

  return {
    [field]: {
      in: tenantIds,
    },
  }
}

export const restrictToUserTenants = (
  args: AccessArgs,
  options?: { field?: string; roles?: string | string[] },
): Where | boolean => {
  const clause = isAllowed(args, options?.field, options?.roles)
  return clause
}

export const requireTenantMembership = (args: AccessArgs): boolean => {
  const { req: { user } } = args
  if (!user) return false

  if (isSuperAdmin(user)) {
    return true
  }

  return Boolean(getTenantIds(user).length)
}

export const requireTenantRole = async (
  args: AccessArgs,
  tenantId?: string,
  roles?: string | string[],
): Promise<boolean> => {
  const { req: { user } } = args

  if (isSuperAdmin(user)) {
    return true
  }

  if (!user) {
    return false
  }

  const memberships = await getTenantMembershipsFromRequest(args.req)

  if (!roles || !roles.length) {
    return Boolean(memberships.length || getTenantIds(user).length)
  }

  const requestTenantId = await getTenantIdFromRequest(args.req)
  const resolvedTenantId = tenantId || requestTenantId || getTenantIdFromArgs(args)
  const normalizedResolvedTenantId = normalizeTenantId(resolvedTenantId)

  if (normalizedResolvedTenantId) {
    const allowed = hasTenantRole(user, normalizedResolvedTenantId, roles, memberships, 'requireTenantRole')
    return allowed
  }

  const allowedRoles = normalizeRoles(roles)
  const fallback = memberships.some((membership) => membership?.role && allowedRoles.includes(membership.role))
  return fallback
}
