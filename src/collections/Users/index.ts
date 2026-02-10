import { URL } from 'url'
import type { AccessArgs, CollectionConfig } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { getTenantIdsFromMemberships, requireTenantRole, isSuperAdmin } from '../../access/tenants'

type UserAccessArgs = Omit<AccessArgs, 'id'> & {
  id?: number | 'me'
}

const canReadOrUpdateSelf = ({ req, id }: UserAccessArgs): boolean => {
  if (!req?.user) return false

  if (id === 'me') return true
  if (typeof id === 'number' && req.user.id === id) return true

  return isSuperAdmin(req.user)
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
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
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data

        const requestURL = req?.url ?? ''
        const isFirstRegister = requestURL.includes('/api/users/first-register')

        if (isFirstRegister) {
          req.payload.logger.info({
            msg: 'users.beforeValidate(first-register): incoming payload',
            tenantMembershipsType: typeof data.tenantMemberships,
            tenantMembershipsIsArray: Array.isArray(data.tenantMemberships),
            roles: Array.isArray(data.roles) ? data.roles : [],
            hasEmail: typeof data.email === 'string' && data.email.length > 0,
            hasPassword: typeof data.password === 'string' && data.password.length > 0,
          })
        }

        // Payload first-register can submit empty array fields as `0`.
        if (data.tenantMemberships === 0) {
          data.tenantMemberships = []
        } else if (
          typeof data.tenantMemberships !== 'undefined' &&
          !Array.isArray(data.tenantMemberships)
        ) {
          data.tenantMemberships = []
        }

        if (isFirstRegister) {
          req.payload.logger.info({
            msg: 'users.beforeValidate(first-register): normalized payload',
            tenantMembershipsType: typeof data.tenantMemberships,
            tenantMembershipsIsArray: Array.isArray(data.tenantMemberships),
            tenantMembershipsLength: Array.isArray(data.tenantMemberships) ? data.tenantMemberships.length : null,
          })
        }

        return data
      },
    ],
    beforeChange: [
      ({ data, req }) => {
        if (!data) return
        if (Array.isArray(data.tenantMemberships)) {
          data.tenants = Array.from(new Set(getTenantIdsFromMemberships(data.tenantMemberships)))
        }

        if ((req?.url ?? '').includes('/api/users/first-register')) {
          req.payload.logger.info({
            msg: 'users.beforeChange(first-register): computed tenant ids',
            tenantsLength: Array.isArray((data as any).tenants) ? (data as any).tenants.length : 0,
          })
        }
        return data
      },
    ],
  },
  timestamps: true,
}
