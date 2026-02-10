import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { User } from '@/payload-types'

const validRoles = ['admin', 'organizer', 'viewer'] as const
type Role = (typeof validRoles)[number]

const normalizeRole = (raw: unknown): Role | null => {
  if (typeof raw !== 'string') return null
  if (validRoles.includes(raw as Role)) {
    return raw as Role
  }
  return null
}

const parseTenantIdValue = (value: string) => {
  const numeric = Number(value)
  if (Number.isFinite(numeric) && String(numeric) === value) {
    return numeric
  }
  return value
}

const buildMemberships = (
  current: Array<{
    tenant?: string | number | null
    role?: string | null
  }>,
  tenantIdentifier: string | number,
  role: Role,
) => {
  const tenantKey = String(tenantIdentifier)
  const next = current ?? []

  const existing = next.find(
    (membership) => String(membership?.tenant ?? '') === tenantKey,
  )

  if (existing) {
    existing.role = role
    return [...next]
  }

  return [...next, { tenant: tenantIdentifier, role }]
}

export async function POST(req: NextRequest, context: any) {
  const payload = await getPayload({ config })
  const { params } = context
  const { tenantId } = params

  if (!tenantId) {
    return NextResponse.json(
      { error: 'Tenant id is required' },
      { status: 400 },
    )
  }

  if (!req.headers.get('cookie')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : ''
  const role = normalizeRole(body.role)

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  if (!role) {
    return NextResponse.json({ error: 'Role is required' }, { status: 400 })
  }

  const userCollection = payload.config.collections.find((collection) => collection.slug === 'users')
  if (!userCollection) {
    return NextResponse.json({ error: 'Users collection not configured' }, { status: 500 })
  }

  const normalizedTenantValue = parseTenantIdValue(tenantId)
  const existingResult = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
    req,
    overrideAccess: true,
    depth: 0,
    limit: 1,
  })
  const existingUser = existingResult.docs[0]

  if (existingUser) {
    const updatedMemberships = buildMemberships(
      existingUser.tenantMemberships as any,
      normalizedTenantValue,
      role,
    )

    const updated = await payload.update({
      collection: 'users',
      id: existingUser.id,
      data: {
        tenantMemberships: updatedMemberships as User['tenantMemberships'],
      },
      req,
      overrideAccess: true,
    })

    return NextResponse.json({ user: updated })
  }

  const generatedPassword = crypto.randomBytes(8).toString('hex')
  const formattedName = body.name?.trim() || email.split('@')[0] || email
  const globalRole: typeof validRoles[number] = validRoles.includes(role) ? role : 'viewer'
  let newUser
  try {
    newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        name: formattedName,
        password: generatedPassword,
        roles: [globalRole],
        tenantMemberships: [{ tenant: normalizedTenantValue, role }] as User['tenantMemberships'],
      },
      req,
      overrideAccess: true,
    })
  } catch (error) {
    console.error('tenant invite user create failure', error)
    throw error
  }

  if (!newUser) {
    return NextResponse.json({ error: 'Unable to create user' }, { status: 500 })
  }

  return NextResponse.json({ user: newUser })
}
