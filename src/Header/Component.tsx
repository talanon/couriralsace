import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedTenantNav } from '@/utilities/getTenantNav'
import React from 'react'

import type { Tenant } from '@/payload-types'

type HeaderProps = {
  tenant?: Tenant | null
}

export async function Header({ tenant }: HeaderProps) {
  const [headerData, tenantNav] = await Promise.all([
    getCachedGlobal('header', 1)(),
    tenant ? getCachedTenantNav(tenant.id)() : Promise.resolve(null),
  ])

  const navItems = tenantNav?.navItems ?? headerData?.navItems

  return <HeaderClient navItems={navItems} />
}
