import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'

import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import type { Event, Media as MediaType, Page } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { interpolateEventTemplate } from '@/utilities/interpolateEventTemplate'
import { resolveTenant } from '@/utilities/resolveTenant'
import { normalizeTenantId } from '@/access/tenants'
import { richTextToPlainText } from '@/utilities/richTextToPlainText'

const isMediaDocument = (value: unknown): value is MediaType => {
  return Boolean(value && typeof value === 'object' && 'url' in (value as Record<string, unknown>))
}

const isPageDocument = (value: unknown): value is Page => {
  return Boolean(value && typeof value === 'object' && 'layout' in (value as Record<string, unknown>))
}

const isRichTextValue = (value: unknown): value is { root: { children: unknown[] } } => {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'root' in (value as Record<string, unknown>) &&
      typeof (value as { root?: unknown }).root === 'object',
  )
}

const formatDate = (value?: string | null) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return events.docs.filter((event) => Boolean(event.slug)).map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function EventPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/evenements/${decodedSlug}`
  const [event, eventTemplate] = await Promise.all([
    queryEventBySlug({ slug: decodedSlug }),
    getCachedGlobal('eventTemplate', 0)(),
  ])

  if (!event) return <PayloadRedirects url={url} />

  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const tenant = await resolveTenant(host)
  const templatePage = await resolveTemplatePage({
    explicitTemplate: eventTemplate?.templatePage,
    tenantId: tenant?.id ? String(tenant.id) : undefined,
  })
  if (templatePage) {
    const interpolatedHero = interpolateEventTemplate(templatePage.hero, event)
    const interpolatedLayout = applyEventImageOverrides(interpolateEventTemplate(templatePage.layout, event), event)

    return (
      <article className="pb-24 bg-[#f2f2f2]">
        <PayloadRedirects disableNotFound url={url} />
        <RenderHero {...interpolatedHero} />
        <RenderBlocks blocks={interpolatedLayout} currentEvent={event} />
      </article>
    )
  }

  const image = isMediaDocument(event.image) ? event.image : null
  const templateContent = eventTemplate?.content
    ? interpolateEventTemplate(eventTemplate.content, event)
    : null

  return (
    <article className="py-12">
      <PayloadRedirects disableNotFound url={url} />

      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <h1 className="text-4xl font-extrabold uppercase leading-tight">{event.title}</h1>
            <p className="text-sm text-black/70">
              {formatDate(event.startDate)}
              {event.endDate && event.endDate !== event.startDate ? ` - ${formatDate(event.endDate)}` : ''}
              {event.location ? ` - ${event.location}` : ''}
            </p>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-[#e7edd8]">
            {image ? (
              <Media
                resource={image}
                className="absolute inset-0"
                fill
                imgClassName="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#dce7ce_20%,#f6f8f2_20%)]" />
            )}
          </div>
        </div>

        {templateContent ? (
          <section className="mt-10">
            <RichText className="max-w-[64rem]" data={templateContent} enableGutter={false} />
          </section>
        ) : (
          <>
            {isRichTextValue(event.description) && (
              <div className="mt-8">
                <RichText className="max-w-[64rem]" data={event.description} enableGutter={false} />
              </div>
            )}

            {event.registrationLink && (
              <a
                className="curve-top mt-6 inline-flex rounded-full border border-[var(--brand-green)] bg-[var(--brand-green)] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
                href={event.registrationLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                S'inscrire
              </a>
            )}

            {event.courses && event.courses.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 text-2xl font-bold uppercase">Courses</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {event.courses.map((course) => (
                    <article key={course.id || `${course.title}-${course.date}`} className="rounded-xl border border-black/10 bg-white p-4">
                      <h3 className="text-lg font-bold">{course.title}</h3>
                      <p className="mt-1 text-sm text-black/70">{formatDate(course.date)}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/75">
                        {course.type && <span>{course.type === 'trail' ? 'Trail' : 'Course'}</span>}
                        {course.distance != null && <span>{course.distance} km</span>}
                        {course.elevationGain != null && <span>{course.elevationGain} D+</span>}
                        {course.location && <span>{course.location}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const event = await queryEventBySlug({ slug: decodedSlug })

  if (!event) {
    return {
      title: 'Evenement introuvable',
    }
  }

  return {
    description:
      typeof event.description === 'string'
        ? event.description
        : richTextToPlainText(event.description) || undefined,
    title: event.title,
  }
}

const queryEventBySlug = cache(async ({ slug }: { slug: string }): Promise<Event | null> => {
  await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const applyEventImageOverrides = (layout: Page['layout'], event: Event): Page['layout'] => {
  return layout.map((block) => {
    if (block.blockType === 'imageText' && block.useEventImage) {
      return {
        ...block,
        image: event.image || block.image,
      }
    }

    if (block.blockType === 'mediaBlock' && block.useEventImage) {
      return {
        ...block,
        media: event.image || block.media,
      }
    }

    return block
  })
}

const resolveTemplatePage = async ({
  explicitTemplate,
  tenantId,
}: {
  explicitTemplate?: number | Page | null
  tenantId?: string
}): Promise<Page | null> => {
  if (explicitTemplate && isPageDocument(explicitTemplate)) return explicitTemplate

  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()

  if (typeof explicitTemplate === 'number') {
    const explicitPage = await payload.findByID({
      collection: 'pages',
      id: explicitTemplate,
      depth: 2,
      overrideAccess: true,
    })

    if (explicitPage) return explicitPage
  }

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
    depth: 2,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    sort: '-updatedAt',
    where: {
      and: [
        {
          template: {
            equals: 'event',
          },
        },
        tenantClause,
      ],
    },
  })

  const page = result.docs?.[0]
  if (page) return page

  const fallback = await payload.find({
    collection: 'pages',
    depth: 2,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    sort: '-updatedAt',
    where: {
      template: {
        equals: 'event',
      },
    },
  })

  const fallbackPage = fallback.docs?.[0]
  if (!fallbackPage) return null

  const pageTenant = normalizeTenantId(fallbackPage.tenant)
  if (tenantId && pageTenant && pageTenant !== tenantId) {
    return null
  }

  return fallbackPage
}
