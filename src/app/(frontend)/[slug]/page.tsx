import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { normalizeTenantId } from '@/access/tenants'
import { resolveTenant } from '@/utilities/resolveTenant'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const tenant = await resolveTenant(host)

  page = await queryPageBySlug({
    slug: decodedSlug,
    tenantId: tenant?.id ? String(tenant.id) : undefined,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  const normalizedPageTenantId = normalizeTenantId(page?.tenant)
  const normalizedTenantId = tenant?.id ? String(tenant.id) : undefined
  const tenantMismatch = Boolean(
    normalizedPageTenantId && normalizedTenantId && normalizedPageTenantId !== normalizedTenantId,
  )

  if (!page || tenantMismatch) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const tenant = await resolveTenant(host)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    tenantId: tenant?.id ? String(tenant.id) : undefined,
  })

  const normalizedPageTenantId = normalizeTenantId(page?.tenant)
  const normalizedTenantId = tenant?.id ? String(tenant.id) : undefined
  if (!page || (normalizedPageTenantId && normalizedTenantId && normalizedPageTenantId !== normalizedTenantId)) {
    return generateMeta({ doc: null })
  }

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(
  async ({ slug, tenantId }: { slug: string; tenantId?: string | null }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const tenantClause =
      tenantId != null
        ? {
            tenant: {
              equals: tenantId,
            },
          }
        : {
            tenant: {
              exists: false,
            },
          }

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
        ...tenantClause,
      },
    })

    return result.docs?.[0] || null
  },
)
