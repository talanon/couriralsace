import { URL } from 'url'
import type { AccessArgs, CollectionConfig } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { getTenantIdsFromMemberships, requireTenantRole, isSuperAdmin } from '../../access/tenants'

const canReadOrUpdateSelf = ({ req, id }: AccessArgs): boolean => {
  if (!req?.user) return false

  if (id === 'me') return true
  if (id && req.user.id === id) return true

  return isSuperAdmin(req.user)
}

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
    read: (args) => canReadOrUpdateSelf(args),
    update: (args) => canReadOrUpdateSelf(args),
  },
  auth: {
    verify: {
      generateEmailSubject: ({ req }) => req.t('authentication:verifyYourEmail'),
      generateEmailHTML: async ({ req, token }) => {
        const protocol = new URL(req.url!).protocol
        const host = req.headers.get('host')
        const serverURL =
          req.payload.config.serverURL && req.payload.config.serverURL.length
            ? req.payload.config.serverURL
            : host
            ? `${protocol}//${host}`
            : 'http://localhost:3000'

        const verificationURL = formatAdminURL({
          adminRoute: req.payload.config.routes.admin,
          path: `/users/verify/${token}`,
          serverURL,
        })

        return `<p>${req.t('authentication:verifyYourEmail')}</p><p><a href="${verificationURL}">${verificationURL}</a></p>`
      },
    },
  },
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
