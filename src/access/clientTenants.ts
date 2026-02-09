'use client'

import type { User } from '@/payload-types'

type TenantRelationship = string | { id?: string | null }

const resolveTenantId = (value: TenantRelationship | undefined | null): string | null => {
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

export const normalizeTenantId = (value: TenantRelationship | undefined | null): string | null =>
  resolveTenantId(value)

export const isSuperAdmin = (user?: User): boolean => Boolean(user?.roles?.includes('super-admin'))
