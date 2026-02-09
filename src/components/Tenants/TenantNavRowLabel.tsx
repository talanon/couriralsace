'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import type { Tenant } from '@/payload-types'
import React from 'react'

export const TenantNavRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Tenant['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.link.label}`
    : 'Nav item'

  return <div>{label}</div>
}
