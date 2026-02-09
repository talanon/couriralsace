import type { GlobalConfig } from 'payload'

import { superAdminOnly } from '@/access'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  labels: {
    label: 'En-tête',
    singular: 'En-tête',
    plural: 'En-têtes',
  },
  access: {
    read: superAdminOnly,
    update: superAdminOnly,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
