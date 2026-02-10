import type { CollectionConfig } from 'payload'

import { isSuperAdmin, restrictToUserTenants, requireTenantRole } from '../../access/tenants'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { HomeHero } from '../../blocks/HomeHero/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { assignTenantFromUser } from '../../hooks/assignTenant'
import { ensureUniquePageSlug } from '../../hooks/ensureUniquePageSlug'
import { requireTenantField } from '../../hooks/requireTenant'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  access: {
    create: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    delete: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
    read: (args) => {
      if (args.req.user) {
        return restrictToUserTenants(args, { field: 'tenant' })
      }
      return {
        _status: {
          equals: 'published',
        },
      }
    },
    update: (args) => requireTenantRole(args, undefined, ['admin', 'organizer']),
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    {
      name: 'template',
      type: 'select',
      label: 'Template',
      required: true,
      options: [
        {
          label: 'Standard',
          value: 'default',
        },
        {
          label: 'Hero (no chrome)',
          value: 'hero',
        },
      ],
      defaultValue: 'default',
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [HomeHero, CallToAction, Content, MediaBlock, Archive, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Contenu',
        },
        {
          name: 'meta',
          label: 'SEO',
            fields: [
              OverviewField({
                titlePath: 'meta.title',
                descriptionPath: 'meta.description',
                imagePath: 'meta.image',
              }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      label: 'Date de publication',
    },
    slugField({
      overrides: (field) => ({
        ...field,
        fields: [
          field.fields[0],
          {
            ...field.fields[1],
            unique: false,
          },
        ],
      }),
    }),
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
    beforeChange: [populatePublishedAt, assignTenantFromUser, ensureUniquePageSlug],
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
