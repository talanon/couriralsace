import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'

import { assignTenantFromUser } from '../hooks/assignTenant'
import { requireTenantField } from '../hooks/requireTenant'
import { getTenantIdFromRequest, restrictToUserTenants, requireTenantRole } from '../access/tenants'

const getUploadStaticDir = () => {
  // Netlify/AWS Lambda file systems are ephemeral and only /tmp is writable.
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return '/tmp/payload-media'
  }

  return path.resolve(process.cwd(), 'public/media')
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Média',
    plural: 'Médias',
  },
  folders: true,
  access: {
    create: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    delete: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    read: async (args) => {
      const requestURL = args.req?.url ?? ''
      if (requestURL.includes('/api/media/file/')) {
        // Public asset delivery route must stay accessible for website rendering.
        return true
      }

      if (args.req.user) {
        return restrictToUserTenants(args, { field: 'tenant' })
      }
      const tenantId = await getTenantIdFromRequest(args.req)
      if (!tenantId) return false
      return {
        tenant: {
          equals: tenantId,
        },
      }
    },
    update: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
      label: 'Texte alternatif',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: 'Légende',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [requireTenantField],
    beforeChange: [assignTenantFromUser],
  },
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: getUploadStaticDir(),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
