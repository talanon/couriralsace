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
import { DecorativeCurves } from '@/components/DecorativeCurves'
import { cn } from '@/utilities/ui'
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
      breadcrumbs: true,
      slug: true,
    },
  })

  const params = pages.docs
    .map((doc) => {
      const lastBreadcrumb = doc.breadcrumbs?.[doc.breadcrumbs.length - 1]
      const breadcrumbURL = typeof lastBreadcrumb?.url === 'string' ? lastBreadcrumb.url : null

      if (breadcrumbURL) {
        const segments = breadcrumbURL.split('/').filter(Boolean)
        if (segments.length === 0 || (segments.length === 1 && segments[0] === 'home')) {
          return null
        }

        return { slug: segments }
      }

      if (doc.slug === 'home') {
        return null
      }

      return { slug: [doc.slug] }
    })
    .filter((param): param is { slug: string[] } => Boolean(param))

  return params
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: slugSegments } = await paramsPromise
  const decodedSegments = (slugSegments ?? []).map((segment) => decodeURIComponent(segment))
  const url = decodedSegments.length > 0 ? `/${decodedSegments.join('/')}` : '/'
  const resolvedSlug = decodedSegments.length > 0 ? decodedSegments[decodedSegments.length - 1] : 'home'
  let page: RequiredDataFromCollectionSlug<'pages'> | null
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const tenant = await resolveTenant(host)

  page = await queryPageByPath({
    path: url,
    slug: resolvedSlug,
    tenantId: tenant?.id ? String(tenant.id) : undefined,
  })

  // Remove this code once your website is seeded
  if (!page && url === '/') {
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

  const { hero, layout, template = 'default' } = page
  const useStandardChrome = template === 'default'
  const headerBlocks = useStandardChrome
    ? layout.filter((block) => block.blockType === 'sectionEntete')
    : []
  const remainingBlocks = useStandardChrome
    ? layout.filter((block) => block.blockType !== 'sectionEntete')
    : layout

  return (
    <article className={cn('', useStandardChrome && 'relative isolate overflow-hidden bg-[#f2f2f2]')}>
      <PageClient template={template} />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {useStandardChrome && (
        <div className="pointer-events-none absolute inset-0 z-20 mix-blend-multiply">
          <DecorativeCurves opacity="opacity-80" position="right" variant="light" className="!-translate-y-0 !top-[120px]" />
          <DecorativeCurves
            opacity="opacity-80"
            position="left"
            variant="light"
            className="!-translate-y-0 !top-[620px] md:!top-[680px]"
          />
        </div>
      )}

      <div className={cn(useStandardChrome && 'relative')}>
        <RenderHero {...hero} />
        {headerBlocks.length > 0 && <RenderBlocks blocks={headerBlocks} />}
      </div>

      {useStandardChrome && (
        <div className="pointer-events-none absolute inset-0 z-50 mix-blend-color">
          <DecorativeCurves opacity="opacity-80" position="right" variant="light" className="!-translate-y-0 !top-[120px]" />
          <DecorativeCurves
            opacity="opacity-80"
            position="left"
            variant="light"
            className="!-translate-y-0 !top-[620px] md:!top-[680px]"
          />
        </div>
      )}

      <div className={cn(useStandardChrome && 'relative')}>
        <RenderBlocks blocks={remainingBlocks} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: slugSegments } = await paramsPromise
  const decodedSegments = (slugSegments ?? []).map((segment) => decodeURIComponent(segment))
  const url = decodedSegments.length > 0 ? `/${decodedSegments.join('/')}` : '/'
  const resolvedSlug = decodedSegments.length > 0 ? decodedSegments[decodedSegments.length - 1] : 'home'
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const tenant = await resolveTenant(host)
  const page = await queryPageByPath({
    path: url,
    slug: resolvedSlug,
    tenantId: tenant?.id ? String(tenant.id) : undefined,
  })

  const normalizedPageTenantId = normalizeTenantId(page?.tenant)
  const normalizedTenantId = tenant?.id ? String(tenant.id) : undefined
  if (!page || (normalizedPageTenantId && normalizedTenantId && normalizedPageTenantId !== normalizedTenantId)) {
    return generateMeta({ doc: null })
  }

  return generateMeta({ doc: page })
}

const queryPageByPath = cache(
  async ({ path, slug, tenantId }: { path: string; slug?: string; tenantId?: string | null }) => {
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
      depth: 2,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        and: [
          {
            or: [
              {
                'breadcrumbs.url': {
                  equals: path,
                },
              },
              ...(slug
                ? [
                    {
                      slug: {
                        equals: slug,
                      },
                    },
                  ]
                : []),
            ],
          },
          tenantClause,
        ],
      },
    })

    return result.docs?.[0] || null
  },
)
