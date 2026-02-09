import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { isSuperAdmin, restrictToUserTenants } from '../../access/tenants'
import { slugify } from '../../utilities/slugify'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: ({ req: { user } }) => Boolean(user && isSuperAdmin(user)),
    delete: (args) => restrictToUserTenants(args, { field: 'id', roles: ['admin'] }),
    read: anyone,
    update: (args) => restrictToUserTenants(args, { field: 'id', roles: ['admin'] }),
  },
  labels: {
    label: 'Organisateurs',
    singular: 'Organisateur',
    plural: 'Organisateurs',
  },
  admin: {
    defaultColumns: ['name', 'slug', 'region'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom de l’organisateur',
    },
    slugField({ generateFrom: 'name' }),
    {
      name: 'region',
      type: 'text',
      label: 'Région',
    },
    {
      name: 'type',
      type: 'text',
      label: 'Type d’organisation',
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Résumé',
    },
    {
      name: 'domains',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 5,
      label: 'Domaines autorisés',
      fields: [
        {
          name: 'host',
          type: 'text',
          required: true,
          label: 'Host (sous-domaine)',
        },
      ],
    },
    {
      name: 'branding',
      type: 'group',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
        },
        {
          name: 'cover',
          type: 'upload',
          relationTo: 'media',
          label: 'Image de couverture',
        },
        {
          name: 'colors',
          type: 'group',
          fields: [
            { name: 'primary', type: 'text', label: 'Couleur principale' },
            { name: 'accent', type: 'text', label: 'Couleur accent' },
          ],
        },
        {
          name: 'social',
          type: 'group',
          fields: [
            { name: 'instagram', type: 'text', label: 'Instagram' },
            { name: 'facebook', type: 'text', label: 'Facebook' },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return
        if (!data.slug && typeof data.name === 'string') {
          data.slug = slugify(data.name)
        }
        if (!data.slug) {
          data.slug = String(Date.now())
        }
        return data
      },
    ],
  },
}
