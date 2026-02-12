import Link from 'next/link'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Carrot, Footprints, MapPin, Medal, Mountain, MountainSnow, RulerDimensionLine } from 'lucide-react'

import { Media } from '@/components/Media'
import type { Event, EventGridBlock as EventGridBlockProps, Media as MediaType } from '@/payload-types'
import { textWithBreaks } from '@/utilities/textWithBreaks'

const isEventDocument = (value: unknown): value is Event => {
  return Boolean(value && typeof value === 'object' && 'title' in (value as Record<string, unknown>))
}

const isMediaDocument = (value: unknown): value is MediaType => {
  return Boolean(value && typeof value === 'object' && 'url' in (value as Record<string, unknown>))
}

type CardData = {
  dateValue?: string | null
  dateLabel: string
  distanceLabel?: string | null
  elevationLabel?: string | null
  eventLabel?: string | null
  eventSlug?: string | null
  image?: MediaType | null
  locationLabel?: string | null
  isOfficial?: boolean | null
  officialLabel?: string | null
  typeLabel?: string | null
  title: string
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

const toCardsFromEvent = (event: Event): CardData[] => {
  if (!event.courses?.length) return []

  return event.courses.map((course) => {
    const cardImage = isMediaDocument(course.image) ? course.image : isMediaDocument(event.image) ? event.image : null
    const cardDate = course.date || event.startDate

    return {
      dateValue: cardDate,
      dateLabel: formatDate(cardDate),
      distanceLabel: course.distance != null ? `${course.distance} km` : null,
      elevationLabel: course.elevationGain != null ? `${course.elevationGain} D+` : null,
      eventLabel: event.title,
      eventSlug: event.slug || null,
      image: cardImage,
      locationLabel: course.location || event.location,
      isOfficial: course.official !== false,
      officialLabel: course.official === false ? 'Non officielle' : 'Officielle',
      typeLabel: course.type === 'course' ? 'Course' : course.type === 'trail' ? 'Trail' : null,
      title: course.title,
    }
  })
}

const getUpcomingCards = async ({
  excludeEventId,
}: {
  excludeEventId?: number
} = {}): Promise<CardData[]> => {
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()

  const result = await payload.find({
    collection: 'events',
    depth: 2,
    limit: 100,
    overrideAccess: true,
    sort: 'startDate',
    where: excludeEventId
      ? {
          and: [
            {
              startDate: {
                greater_than_equal: now,
              },
            },
            {
              id: {
                not_equals: excludeEventId,
              },
            },
          ],
        }
      : {
          startDate: {
            greater_than_equal: now,
          },
        },
  })

  return result.docs
    .flatMap((event) => toCardsFromEvent(event as Event))
    .filter((card) => Boolean(card.dateValue))
    .sort((a, b) => {
      const aDate = new Date(a.dateValue as string).getTime()
      const bDate = new Date(b.dateValue as string).getTime()
      return aDate - bDate
    })
    .slice(0, 4)
}

type Props = EventGridBlockProps & {
  currentEvent?: Event | null
}

export const EventGridBlock = async ({
  ctaLink,
  ctaText,
  eventSourceMode,
  events,
  manualEvents,
  title,
  currentEvent,
}: Props) => {
  const relationCards: CardData[] = (events || [])
    .flatMap((event): CardData[] => {
      if (!isEventDocument(event)) return []

      return toCardsFromEvent(event)
    })
    .sort((a, b) => {
      const aDate = a.dateValue ? new Date(a.dateValue).getTime() : Number.MAX_SAFE_INTEGER
      const bDate = b.dateValue ? new Date(b.dateValue).getTime() : Number.MAX_SAFE_INTEGER
      return aDate - bDate
    })

  const manualCards: CardData[] = (manualEvents || []).map((item) => ({
    dateLabel: item.dateLabel,
    distanceLabel: item.distanceLabel,
    elevationLabel: item.elevationLabel,
    eventLabel: null,
    eventSlug: null,
    image: isMediaDocument(item.image) ? item.image : null,
    locationLabel: item.locationLabel,
    isOfficial: null,
    title: item.title,
  }))

  let cards: CardData[] = []

  if (eventSourceMode === 'currentEventCourses') {
    cards = currentEvent ? toCardsFromEvent(currentEvent) : []
  } else if (eventSourceMode === 'otherEventsCourses') {
    cards = await getUpcomingCards({
      excludeEventId: currentEvent?.id,
    })
  } else {
    cards = manualCards.length > 0 ? manualCards : relationCards
  }

  if (!cards.length) {
    cards = await getUpcomingCards({
      excludeEventId: eventSourceMode === 'otherEventsCourses' ? currentEvent?.id : undefined,
    })
  }

  if (!cards.length) return null

  return (
    <section className="relative overflow-hidden bg-[#f2f2f2]">
      <div className="container relative">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-4xl font-bold uppercase leading-none">{textWithBreaks(title)}</h2>
          {ctaText && (
            <Link
              className="curve-top inline-flex rounded-full border border-[var(--brand-green)] bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[var(--brand-green)]"
              href={ctaLink || '#'}
            >
              {textWithBreaks(ctaText)}
            </Link>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <article
              className="curve-top group overflow-hidden rounded-2xl border-2 border-[var(--brand-green)] bg-white transition-transform duration-300 hover:-translate-y-1"
              key={`${card.title}-${index}`}
            >
              <div className="relative h-40 overflow-hidden bg-[#e7edd8]">
                {card.image ? (
                  <Media
                    resource={card.image}
                    className="absolute inset-0"
                    fill
                    imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#dce7ce_20%,#f6f8f2_20%)]" />
                )}
                <div className="absolute left-3 top-3 flex gap-2">
                  {card.officialLabel && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        card.isOfficial === false ? 'bg-black text-white' : 'bg-[var(--brand-green)] text-black'
                      }`}
                    >
                      {card.isOfficial === false ? <Carrot size={10} /> : <Medal size={10} />}
                      {card.officialLabel}
                    </span>
                  )}
                  {card.typeLabel && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      {card.typeLabel === 'Trail' ? <MountainSnow size={10} /> : <Footprints size={10} />}
                      {card.typeLabel}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold text-black/65">{card.dateLabel}</p>
                {card.eventLabel && (
                  card.eventSlug ? (
                    <Link
                      className="text-xs font-extrabold uppercase tracking-wide text-[var(--brand-green)] transition-colors hover:text-black"
                      href={`/evenements/${card.eventSlug}`}
                    >
                      {textWithBreaks(card.eventLabel)}
                    </Link>
                  ) : (
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--brand-green)]">
                      {textWithBreaks(card.eventLabel)}
                    </p>
                  )
                )}
                <h3 className="text-xl font-bold leading-tight text-black">{textWithBreaks(card.title)}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-black/65">
                  {card.distanceLabel && (
                    <span className="inline-flex items-center gap-1.5">
                      <RulerDimensionLine size={14} />
                      {card.distanceLabel}
                    </span>
                  )}
                  {card.elevationLabel && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mountain size={14} />
                      {card.elevationLabel}
                    </span>
                  )}
                  {card.locationLabel && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {card.locationLabel}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
