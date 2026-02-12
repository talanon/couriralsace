import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

import type { AlsaceEventsMapBlock as AlsaceEventsMapBlockProps, Event } from '@/payload-types'
import { resolveTenant } from '@/utilities/resolveTenant'
import { AlsaceEventsMapClient } from './Map.client'
import { richTextToPlainText } from '@/utilities/richTextToPlainText'

type MarkerPoint = {
  x: number
  y: number
}

const cityCoordinates: Record<string, MarkerPoint> = {
  strasbourg: { x: 260, y: 180 },
  haguenau: { x: 270, y: 150 },
  obernai: { x: 252, y: 215 },
  selestat: { x: 246, y: 260 },
  ribeauville: { x: 238, y: 282 },
  kaysersberg: { x: 234, y: 300 },
  colmar: { x: 240, y: 320 },
  guebwiller: { x: 242, y: 360 },
  mulhouse: { x: 245, y: 400 },
  altkirch: { x: 238, y: 438 },
}

const computeFallbackPoint = (index: number, total: number): MarkerPoint => {
  const spread = Math.max(total - 1, 1)
  const y = 120 + Math.round((index / spread) * 300)
  const x = 245 + (index % 2 === 0 ? -10 : 10)
  return { x, y }
}

const getMarkerPoint = (location: string | null | undefined, index: number, total: number): MarkerPoint => {
  if (!location) return computeFallbackPoint(index, total)

  const normalizedLocation = location.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  for (const [city, marker] of Object.entries(cityCoordinates)) {
    if (normalizedLocation.includes(city)) {
      return marker
    }
  }

  return computeFallbackPoint(index, total)
}

export const AlsaceEventsMapBlock: React.FC<
  AlsaceEventsMapBlockProps & {
    id?: string
  }
> = async ({ id, maxEvents, monthsAhead, subtitle, title }) => {
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const tenant = await resolveTenant(host)

  const eventsResult = await payload.find({
    collection: 'events',
    depth: 0,
    limit: maxEvents || 200,
    overrideAccess: true,
    pagination: false,
    sort: 'startDate',
    ...(tenant?.id
      ? {
          where: {
            tenant: {
              equals: String(tenant.id),
            },
          },
        }
      : {}),
  })

  const docs = (eventsResult.docs || []) as Event[]
  const markers = docs
    .filter((doc) => Boolean(doc?.startDate))
    .map((doc, index, source) => {
      const courseLocation = doc.courses?.[0]?.location
      const markerLocation = courseLocation || doc.location
      const point = getMarkerPoint(markerLocation, index, source.length)

      return {
        id: String(doc.id),
        title: doc.title,
        date: doc.startDate as string,
        location: markerLocation,
        description:
          typeof doc.description === 'string'
            ? doc.description
            : richTextToPlainText(doc.description),
        x: point.x,
        y: point.y,
      }
    })

  return (
    <div id={id ? `block-${id}` : undefined}>
      <AlsaceEventsMapClient
        events={markers}
        monthsAhead={monthsAhead || 12}
        subtitle={subtitle}
        title={title || 'Evenements en Alsace'}
      />
    </div>
  )
}
