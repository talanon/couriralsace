import type { CollectionConfig } from 'payload'

import { getTenantIdsFromMemberships, requireTenantRole, isSuperAdmin } from '../../access/tenants'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    label: 'Utilisateurs',
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
  },
  access: {
    admin: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    create: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    delete: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    read: (args) => {
      const { req, id } = args
      if (req?.user) {
        if (id && req.user.id === id) {
          return true
        }
        if (id === 'me') {
          return true
        }
      }
      if (isSuperAdmin(req?.user)) {
        return true
      }
      return requireTenantRole(args, undefined, ['admin', 'organizer'])
    },
    update: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
  },
  auth: true,
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom complet',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      label: 'Rôles',
      options: [
        {
          label: 'Super administrateur',
          value: 'super-admin',
        },
        {
          label: 'Administrateur du tenant',
          value: 'admin',
        },
        {
          label: 'Organisateur',
          value: 'organizer',
        },
        {
          label: 'Visiteur',
          value: 'viewer',
        },
      ],
      defaultValue: ['organizer'],
    },
    {
      name: 'tenantMemberships',
      type: 'array',
      label: 'Affiliations aux organisateurs',
      admin: {
        description: 'Aucun tenant n’est requis, mais ajoute une affiliation pour gérer un site spécifique.',
      },
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          label: 'Organisateur',
        },
        {
          name: 'role',
          type: 'select',
          defaultValue: 'organizer',
          options: [
            { label: 'Administrateur (permet de gérer événements/pages)', value: 'admin' },
            { label: 'Organisateur (édition limitée)', value: 'organizer' },
            { label: 'Visiteur (lecture seule)', value: 'viewer' },
          ],
          label: 'Rôle sur ce tenant',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return
        if (Array.isArray(data.tenantMemberships)) {
          data.tenants = Array.from(new Set(getTenantIdsFromMemberships(data.tenantMemberships)))
        }
        return data
      },
    ],
  },
  timestamps: true,
}
