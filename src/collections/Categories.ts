import type { CollectionConfig } from 'payload'

import { superAdminOnly } from '../access'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Catégorie',
    plural: 'Catégories',
  },
  access: {
    create: superAdminOnly,
    delete: superAdminOnly,
    read: superAdminOnly,
    update: superAdminOnly,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
