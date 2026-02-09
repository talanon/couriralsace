import type { GlobalConfig } from 'payload'

import { superAdminOnly } from '@/access'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  labels: {
    label: 'Pied de page',
    singular: 'Pied de page',
    plural: 'Pieds de page',
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
