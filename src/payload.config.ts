import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import {
  buildConfig,
  type AccessArgs,
  type CollectionConfig,
  type Field,
  PayloadRequest,
} from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

type MailerConfig = {
  defaultFromAddress: string
  defaultFromName: string
  transport: ReturnType<typeof nodemailer['createTransport']>
}

import { Categories } from './collections/Categories'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import {
  getTenantIdFromRequest,
  isSuperAdmin,
  requireTenantRole,
  restrictToUserTenants,
} from './access/tenants'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const folderEditorRoles = ['admin', 'organizer']

const assignTenantToFolder = async ({
  data,
  req,
}: {
  data?: Record<string, unknown>
  req?: PayloadRequest
}) => {
  if (!data || !req) {
    return data
  }

  const tenantId = await getTenantIdFromRequest(req)
  if (!tenantId) {
    return data
  }

  ;(data as Record<string, unknown>).tenant = tenantId
  return data
}

type FolderCollectionOverride = (args: {
  collection: Omit<CollectionConfig, 'trash'>
}) => Omit<CollectionConfig, 'trash'> | Promise<Omit<CollectionConfig, 'trash'>>

const folderCollectionOverrides: FolderCollectionOverride[] = [
  ({ collection }) => {
  const tenantField: Field = {
    name: 'tenant',
    type: 'relationship',
    relationTo: 'tenants' as const,
      admin: {
        description: 'Tenant propriétaire du dossier (assigné automatiquement).',
        position: 'sidebar' as const,
        condition: (_data: unknown, _siblingData: unknown, { user }: { user?: PayloadRequest['user'] }) =>
          Boolean(user && isSuperAdmin(user)),
      },
      access: {
        create: ({ req }) => Boolean(req?.user && isSuperAdmin(req.user)),
        update: ({ req }) => Boolean(req?.user && isSuperAdmin(req.user)),
      },
    }

    const folderReadAccess = (args: AccessArgs) => {
      if (isSuperAdmin(args.req?.user)) {
        return true
      }
      return restrictToUserTenants(args, { field: 'tenant' })
    }

    const collectionAccess = {
      ...collection.access,
      create: (args: AccessArgs) => requireTenantRole(args, undefined, folderEditorRoles),
      read: folderReadAccess,
      readVersions: folderReadAccess,
      update: (args: AccessArgs) => requireTenantRole(args, undefined, folderEditorRoles),
      delete: (args: AccessArgs) => requireTenantRole(args, undefined, folderEditorRoles),
    }

    const beforeValidate = [
      ...(collection.hooks?.beforeValidate ?? []),
      assignTenantToFolder,
    ]

    return {
      ...collection,
      access: collectionAccess,
      fields: [...collection.fields, tenantField],
      hooks: {
        ...(collection.hooks ?? {}),
        beforeValidate,
      },
    }
  },
]

const mailerDsn = process.env.MAILER_DSN
const defaultFromAddress = process.env.MAILER_FROM ?? 'no-reply@couriralsace.local'
const defaultFromName = process.env.MAILER_FROM_NAME ?? 'Courir Alsace'
const mailerIsMasked = (value?: string | null) => {
  if (!value) {
    return true
  }
  const trimmed = value.trim()
  return !trimmed || trimmed === '****' || trimmed.includes('****')
}

const mailerTransport =
  mailerDsn && mailerDsn.length && !mailerIsMasked(mailerDsn)
    ? nodemailer.createTransport(mailerDsn, {
        tls: {
          rejectUnauthorized: process.env.MAILER_TLS_REJECT !== '0',
        },
      })
    : null


export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
      Nav: '@/components/Nav',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: {
      en,
      fr,
    },
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || '',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Tenants, Events],
  folders: {
    collectionOverrides: folderCollectionOverrides,
  },
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  hooks: {
    afterError: [
      async ({ error, req }) => {
        const requestURL = req?.url ?? ''

        if (requestURL.includes('/api/users/first-register')) {
          req.payload.logger.error({
            msg: 'first-register request failed',
            method: req?.method,
            url: requestURL,
            errorName: error instanceof Error ? error.name : 'UnknownError',
            errorMessage: error instanceof Error ? error.message : String(error),
          })
        }
      },
    ],
  },
  plugins,
  email:
    mailerTransport !== null
      ? () => ({
          name: 'smtp',
          defaultFromAddress: defaultFromAddress,
          defaultFromName: defaultFromName,
          async sendEmail(message) {
            const normalizedFrom = message.from ?? `${defaultFromName} <${defaultFromAddress}>`
            await mailerTransport.sendMail({
              ...message,
              from: normalizedFrom,
            })
          },
        })
      : undefined,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
