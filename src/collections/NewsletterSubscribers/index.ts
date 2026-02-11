import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { getTenantIdFromRequest, isSuperAdmin, requireTenantRole, restrictToUserTenants } from '@/access/tenants'

const csvEscape = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  const escaped = stringValue.replace(/"/g, '""')
  return `"${escaped}"`
}

export const NewsletterSubscribers: CollectionConfig<'newsletter-subscribers'> = {
  slug: 'newsletter-subscribers',
  labels: {
    singular: 'Inscrit newsletter',
    plural: 'Inscrits newsletter',
  },
  access: {
    admin: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    create: anyone,
    delete: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    read: (args) => {
      if (!args.req.user) return false
      return restrictToUserTenants(args, { field: 'tenant', roles: ['admin', 'organizer'] })
    },
    update: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
  },
  admin: {
    defaultColumns: ['email', 'status', 'tenant', 'source', 'subscribedAt', 'createdAt'],
    useAsTitle: 'email',
    description:
      'Export CSV: utilisez l’URL /api/newsletter-subscribers/export (nécessite une session admin).',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Adresse email',
    },
    {
      name: 'emailKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        hidden: true,
      },
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'subscribed',
      options: [
        { label: 'Inscrit', value: 'subscribed' },
        { label: 'Désinscrit', value: 'unsubscribed' },
      ],
      label: 'Statut',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Source',
    },
    {
      name: 'sourcePath',
      type: 'text',
      label: 'Page source',
    },
    {
      name: 'subscribedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Date d’inscription',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: 'Organisateur',
      admin: {
        position: 'sidebar',
      },
      access: {
        create: ({ req }) => Boolean(req.user && isSuperAdmin(req.user)),
        read: ({ req }) => Boolean(req.user && isSuperAdmin(req.user)),
        update: ({ req }) => Boolean(req.user && isSuperAdmin(req.user)),
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data

        const incomingEmail = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
        if (incomingEmail) {
          data.email = incomingEmail
        }

        const tenantId =
          (typeof data.tenant === 'string' || typeof data.tenant === 'number'
            ? String(data.tenant)
            : null) ?? (await getTenantIdFromRequest(req))

        if (tenantId) {
          data.tenant = tenantId
        }

        if (incomingEmail) {
          data.emailKey = `${tenantId ?? 'global'}:${incomingEmail}`
        }

        if (!data.subscribedAt) {
          data.subscribedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const canExport = await requireTenantRole(
          {
            req,
          },
          undefined,
          ['admin', 'organizer'],
        )

        if (!canExport) {
          return Response.json({ error: 'Forbidden' }, { status: 403 })
        }

        const result = await req.payload.find({
          collection: 'newsletter-subscribers',
          depth: 1,
          limit: 10000,
          pagination: false,
          sort: '-subscribedAt',
          req,
          overrideAccess: false,
        })

        const docs = result.docs ?? []
        const header = ['email', 'status', 'tenant', 'source', 'sourcePath', 'subscribedAt', 'createdAt']
        const rows = docs.map((doc) => {
          const tenant = typeof doc.tenant === 'object' ? (doc.tenant?.name ?? doc.tenant?.id ?? '') : (doc.tenant ?? '')
          return [
            csvEscape(doc.email),
            csvEscape(doc.status),
            csvEscape(tenant),
            csvEscape(doc.source),
            csvEscape(doc.sourcePath),
            csvEscape(doc.subscribedAt),
            csvEscape(doc.createdAt),
          ].join(',')
        })
        const csvContent = [header.join(','), ...rows].join('\n')

        return new Response(csvContent, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
          },
          status: 200,
        })
      },
    },
  ],
  timestamps: true,
}
