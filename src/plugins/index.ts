import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import type { Field } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { assignTenantFromUser } from '@/hooks/assignTenant'
import { requireTenantField } from '@/hooks/requireTenant'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { restrictToUserTenants, requireTenantRole } from '@/access/tenants'
import { superAdminOnly } from '@/access'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title}` : 'Template en cours de construction'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

const tenantFormRoles = ['admin', 'organizer']

const tenantFormField: Field = {
  name: 'tenant',
  type: 'relationship' as const,
  relationTo: 'tenants' as const,
  admin: {
    hidden: true,
  },
}

const s3StorageEnabled = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_KEY,
)

const storagePlugins: Plugin[] = [
  s3Storage({
    enabled: s3StorageEnabled,
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET || 'placeholder-bucket',
    config: {
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'placeholder-access-key',
        secretAccessKey: process.env.S3_SECRET_KEY || 'placeholder-secret-key',
      },
      ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
      ...(process.env.S3_FORCE_PATH_STYLE
        ? { forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true' }
        : {}),
    },
  }),
]

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      labels: {
        singular: 'Redirection',
        plural: 'Redirections',
      },
      access: {
        read: superAdminOnly,
        create: superAdminOnly,
        update: superAdminOnly,
        delete: superAdminOnly,
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      labels: {
        singular: 'Formulaire',
        plural: 'Formulaires',
      },
      fields: ({ defaultFields }) => {
        const updatedFields = defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })

        return [
          ...updatedFields,
          {
            ...tenantFormField,
          },
        ]
      },
      access: {
        read: (args) => {
          if (args.req.user) {
            return restrictToUserTenants(args, { field: 'tenant' })
          }
          return false
        },
        create: (args) => requireTenantRole(args, undefined, tenantFormRoles),
        update: (args) => requireTenantRole(args, undefined, tenantFormRoles),
        delete: (args) => requireTenantRole(args, undefined, tenantFormRoles),
      },
      hooks: {
        beforeValidate: [assignTenantFromUser, requireTenantField],
      },
    },
    formSubmissionOverrides: {
      labels: {
        singular: 'Soumission de formulaire',
        plural: 'Soumissions de formulaires',
      },
      access: {
        read: superAdminOnly,
        create: superAdminOnly,
        update: superAdminOnly,
        delete: superAdminOnly,
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      labels: {
        singular: 'Résultat de recherche',
        plural: 'Résultats de recherche',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  ...storagePlugins,
]
