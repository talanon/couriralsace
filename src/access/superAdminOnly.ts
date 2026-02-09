import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

import { isSuperAdmin } from './tenants'

export const superAdminOnly = ({ req }: AccessArgs<User>) => {
  return Boolean(isSuperAdmin(req?.user))
}
