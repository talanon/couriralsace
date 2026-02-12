import type { GlobalConfig } from 'payload'

import { superAdminOnly } from '@/access'
import { link } from '@/fields/link'
import { navLucideIconOptions } from './lucideIcons'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'En-tête',
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
        {
          name: 'icon',
          type: 'select',
          label: 'Icone Lucide',
          options: [...navLucideIconOptions],
          admin: {
            description: 'Icone optionnelle affichee a gauche du libelle.',
            components: {
              Field: '@/components/fields/LucideIconSelectField',
            },
          },
        },
        {
          name: 'style',
          type: 'select',
          label: 'Style',
          defaultValue: 'link',
          options: [
            {
              label: 'Lien',
              value: 'link',
            },
            {
              label: 'Bouton vert arrondi',
              value: 'green-pill',
            },
          ],
        },
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
