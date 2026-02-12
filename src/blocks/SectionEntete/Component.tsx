import configPromise from '@payload-config'
import { Carrot, Footprints, MapPin, Medal, Mountain, MountainSnow, RulerDimensionLine } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'
import type { Event, Media as MediaType, Page, SectionEnteteBlock as SectionEnteteBlockProps } from '@/payload-types'

const isMediaDocument = (value: unknown): value is MediaType => {
  return Boolean(value && typeof value === 'object' && 'id' in (value as Record<string, unknown>))
}

const isEventDocument = (value: unknown): value is Event => {
  return Boolean(value && typeof value === 'object' && 'title' in (value as Record<string, unknown>))
}

const isPageDocument = (value: unknown): value is Page => {
  return Boolean(value && typeof value === 'object' && 'slug' in (value as Record<string, unknown>))
}

const renderStyledText = (value?: string | null) => {
  if (!value) return null

  const source = value.replace(/<br\s*\/?>/gi, '\n')
  const lines = source.split('\n')

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(<green>[\s\S]*?<\/green>)/gi).filter(Boolean)

    return (
      <React.Fragment key={`line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          const match = part.match(/^<green>([\s\S]*?)<\/green>$/i)
          if (match) {
            return (
              <span className="text-[var(--brand-green)]" key={`part-${lineIndex}-${partIndex}`}>
                {match[1]}
              </span>
            )
          }

          return <span key={`part-${lineIndex}-${partIndex}`}>{part}</span>
        })}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    )
  })
}

const formatDate = (value?: string | null) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

type ButtonGroup = SectionEnteteBlockProps['leftButton']

const resolveButtonHref = async (button?: ButtonGroup | null): Promise<string | null> => {
  if (!button) return null
  if (button.type === 'custom') return button.url || null

  const reference = button.reference
  if (!reference) return null

  if (isPageDocument(reference)) {
    return reference.slug === 'home' ? '/' : `/${reference.slug}`
  }

  if (typeof reference === 'number' || typeof reference === 'string') {
    const payload = await getPayload({ config: configPromise })
    const page = await payload.findByID({
      collection: 'pages',
      id: String(reference),
      depth: 0,
      overrideAccess: true,
    })

    if (!page?.slug) return null
    return page.slug === 'home' ? '/' : `/${page.slug}`
  }

  return null
}

const resolveFeaturedEvent = async (
  value: SectionEnteteBlockProps['featuredEvent'],
): Promise<Event | null> => {
  if (!value) return null
  if (isEventDocument(value)) return value
  if (typeof value !== 'number' && typeof value !== 'string') return null

  const payload = await getPayload({ config: configPromise })
  const event = await payload.findByID({
    collection: 'events',
    id: String(value),
    depth: 2,
    overrideAccess: true,
  })

  return event || null
}

const pickFeaturedCourse = (event: Event) => {
  if (!event.courses?.length) return null

  return [...event.courses]
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER
      const bTime = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER
      return aTime - bTime
    })[0]
}

export const SectionEnteteBlock = async ({
  featuredEvent,
  leftButton,
  leftDescription,
  leftTitle,
  rightButton,
  rightDescription,
  rightImage,
  rightTitle,
}: SectionEnteteBlockProps) => {
  const [resolvedEvent, leftHref, rightHref] = await Promise.all([
    resolveFeaturedEvent(featuredEvent),
    resolveButtonHref(leftButton),
    resolveButtonHref(rightButton),
  ])
  const featuredCourse = resolvedEvent ? pickFeaturedCourse(resolvedEvent) : null
  const rightImageResource = isMediaDocument(rightImage) ? rightImage : null
  const courseDate = formatDate(featuredCourse?.date || resolvedEvent?.startDate)
  const courseLocation = featuredCourse?.location || resolvedEvent?.location
  const courseType = featuredCourse?.type === 'course' ? 'Course' : featuredCourse?.type === 'trail' ? 'Trail' : null
  const isOfficial = featuredCourse?.official !== false
  const officialLabel = featuredCourse ? (isOfficial ? 'Officielle' : 'Non officielle') : null

  return (
    <section className="relative overflow-hidden bg-[#f2f2f2] py-6 md:py-8">
      <div className="container relative z-30">
        <div className="grid grid-cols-2 gap-3 rounded-[28px] p-3 md:gap-6 md:p-6 lg:grid-cols-3 lg:items-stretch">
          <div className="flex flex-col justify-center gap-4 md:gap-6 lg:row-span-2">
            <h2 className="text-2xl leading-[1.02] font-extrabold uppercase md:text-4xl">{renderStyledText(leftTitle)}</h2>
            {leftDescription && <p className="max-w-sm text-xs leading-relaxed text-black/75 md:text-sm">{renderStyledText(leftDescription)}</p>}
            {leftButton?.label && leftHref && (
              <Link
                className="curve-top inline-flex w-fit rounded-full border border-[var(--brand-green)] bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-black hover:text-white md:px-6 md:py-2.5 md:text-sm"
                href={leftHref}
              >
                {leftButton.label}
              </Link>
            )}
          </div>

          <article className="relative min-h-[220px] overflow-hidden rounded-[22px] bg-black md:min-h-[320px] lg:row-span-2 lg:min-h-[340px]">
            {rightImageResource ? (
              <Media
                resource={rightImageResource}
                className="absolute inset-0"
                fill
                imgClassName="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#1f1f1f]" />
            )}
            <div className="absolute inset-0 bg-[var(--brand-green)] mix-blend-color" />
          </article>

          <article className="curve-top rounded-2xl border-2 border-[var(--brand-green)] bg-white p-[30px]">
            <div className="absolute right-4 top-4 z-10 h-16 w-16 md:h-[72px] md:w-[72px]">
              <img alt="A la Une" className="h-full w-full object-contain" src="/a-la-une-badge.svg" />
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {officialLabel && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    isOfficial ? 'bg-[var(--brand-green)] text-black' : 'bg-black text-white'
                  }`}
                >
                  {isOfficial ? <Medal size={10} /> : <Carrot size={10} />}
                  {officialLabel}
                </span>
              )}
              {courseType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  {courseType === 'Trail' ? <MountainSnow size={10} /> : <Footprints size={10} />}
                  {courseType}
                </span>
              )}
            </div>

            {courseDate && <p className="text-xs font-semibold text-black/65">{courseDate}</p>}

            {resolvedEvent?.title && (
              resolvedEvent.slug ? (
                <Link
                  className="mt-2 inline-block text-xs font-extrabold uppercase tracking-wide text-[var(--brand-green)] transition-colors hover:text-black"
                  href={`/evenements/${resolvedEvent.slug}`}
                >
                  {resolvedEvent.title}
                </Link>
              ) : (
                <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-[var(--brand-green)]">
                  {resolvedEvent.title}
                </p>
              )
            )}

            <h3 className="mt-2 text-xl font-bold leading-tight text-black">
              {featuredCourse?.title || resolvedEvent?.title || 'Course a la une'}
            </h3>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-black/65">
              {featuredCourse?.distance != null && (
                <span className="inline-flex items-center gap-1.5">
                  <RulerDimensionLine size={14} />
                  {featuredCourse.distance} km
                </span>
              )}
              {featuredCourse?.elevationGain != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Mountain size={14} />
                  {featuredCourse.elevationGain} D+
                </span>
              )}
              {courseLocation && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {courseLocation}
                </span>
              )}
            </div>
          </article>

          <article className="rounded-[22px] bg-black p-[30px] text-white">
            <h3 className="text-lg leading-tight font-extrabold uppercase md:text-xl">{renderStyledText(rightTitle)}</h3>
            {rightDescription && <p className="mt-3 text-xs leading-relaxed text-white/75 md:text-sm">{renderStyledText(rightDescription)}</p>}
            {rightButton?.label && rightHref && (
              <Link
                className="curve-top mt-4 inline-flex rounded-full bg-[var(--brand-green)] px-4 py-2 text-xs font-semibold text-black transition-colors hover:brightness-95 md:mt-5 md:px-5 md:py-2.5 md:text-sm"
                href={rightHref}
              >
                {rightButton.label}
              </Link>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}
