'use client'

import React, { useMemo, useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { textWithBreaks } from '@/utilities/textWithBreaks'

type MarkerEvent = {
  id: string
  title: string
  date: string
  location?: string | null
  description?: string | null
  x: number
  y: number
}

type ResolvedEvent = MarkerEvent & {
  eventDate: Date
}

const alsaceRegion = {
  path: 'M 250 50 L 280 80 L 290 120 L 300 180 L 295 240 L 285 300 L 275 350 L 265 400 L 255 450 L 240 480 L 220 450 L 210 400 L 200 350 L 195 300 L 190 240 L 195 180 L 205 120 L 220 80 Z',
}

export const AlsaceEventsMapClient = ({
  events,
  monthsAhead,
  subtitle,
  title,
}: {
  events: MarkerEvent[]
  monthsAhead: number
  subtitle?: string | null
  title: string
}) => {
  const safeMonthsAhead = Math.max(3, Math.min(24, monthsAhead || 12))

  const [startMonth, setStartMonth] = useState(0)
  const [endMonth, setEndMonth] = useState(Math.min(2, safeMonthsAhead - 1))
  const [hoveredEvent, setHoveredEvent] = useState<ResolvedEvent | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<ResolvedEvent | null>(null)
  const [isDraggingStart, setIsDraggingStart] = useState(false)
  const [isDraggingEnd, setIsDraggingEnd] = useState(false)

  const months = useMemo(() => {
    const today = new Date()
    const monthsList: { value: number; label: string; date: Date }[] = []

    for (let i = 0; i < safeMonthsAhead; i += 1) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
      monthsList.push({
        value: i,
        label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        date,
      })
    }

    return monthsList
  }, [safeMonthsAhead])

  const normalizedEvents = useMemo<ResolvedEvent[]>(() => {
    return events
      .map((event) => {
        const eventDate = new Date(event.date)
        if (Number.isNaN(eventDate.getTime())) {
          return null
        }

        return {
          ...event,
          eventDate,
        }
      })
      .filter((event): event is ResolvedEvent => Boolean(event))
  }, [events])

  const visibleEvents = useMemo(() => {
    const startDate = months[startMonth]?.date
    const endDate = months[endMonth]?.date

    if (!startDate || !endDate) return []

    const rangeStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const rangeEnd = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0, 23, 59, 59)

    return normalizedEvents.filter((event) => {
      return event.eventDate >= rangeStart && event.eventDate <= rangeEnd
    })
  }, [endMonth, months, normalizedEvents, startMonth])

  return (
    <section className="mx-auto w-full max-w-[1200px]">
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }

        .range-slider-start::-webkit-slider-thumb,
        .range-slider-end::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--brand-green);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px var(--brand-green), 0 2px 8px rgba(0, 0, 0, 0.15);
          pointer-events: auto;
        }

        .range-slider-start::-moz-range-thumb,
        .range-slider-end::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--brand-green);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px var(--brand-green), 0 2px 8px rgba(0, 0, 0, 0.15);
          pointer-events: auto;
        }
      `}</style>

      <div className="mb-6">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--brand-green)' }}>
          {textWithBreaks(title)}
        </h2>
        <p className="text-sm text-gray-600">
          {visibleEvents.length} evenement(s)
          {subtitle ? ' · ' : null}
          {subtitle ? textWithBreaks(subtitle) : null}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div className="relative min-h-[300px] min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 md:min-h-[420px]">
          <svg viewBox="0 0 500 550" className="relative z-10 mx-auto h-[240px] w-full max-w-[320px] md:h-[340px] md:max-w-[420px]">
            <defs>
              <linearGradient id="alsaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--brand-green)', stopOpacity: 0.15 }} />
                <stop offset="100%" style={{ stopColor: 'var(--brand-green)', stopOpacity: 0.05 }} />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path d={alsaceRegion.path} fill="url(#alsaceGradient)" stroke="none" />
            <path
              d={alsaceRegion.path}
              fill="none"
              stroke="var(--brand-green)"
              strokeWidth="3"
              filter="url(#glow)"
            />

            <circle cx="250" cy="50" r="3" fill="var(--brand-green)" opacity="0.6" />
            <circle cx="240" cy="480" r="3" fill="var(--brand-green)" opacity="0.6" />

            {visibleEvents.map((event) => {
              const isActive = hoveredEvent?.id === event.id || selectedEvent?.id === event.id

              return (
                <g key={event.id}>
                  {isActive && (
                    <circle cx={event.x} cy={event.y} r="18" fill="none" stroke="var(--brand-green)" strokeWidth="1" />
                  )}

                  <circle
                    cx={event.x}
                    cy={event.y}
                    r={isActive ? 12 : 8}
                    fill="var(--brand-green)"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredEvent(event)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    onClick={() => setSelectedEvent(event)}
                  />
                </g>
              )
            })}
          </svg>

          {hoveredEvent && (
            <div
              className="pointer-events-none absolute left-1/2 top-4 w-full max-w-[320px] -translate-x-1/2 rounded-lg border-2 bg-white p-3 shadow-xl"
              style={{ borderColor: 'var(--brand-green)' }}
            >
              <div className="flex items-start gap-2">
                <MapPin size={16} style={{ color: 'var(--brand-green)' }} className="mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--brand-green)' }}>
                    {textWithBreaks(hoveredEvent.title)}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {hoveredEvent.eventDate.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {hoveredEvent.location && (
                    <p className="mt-1 text-xs text-gray-500">{textWithBreaks(hoveredEvent.location)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="min-w-0 max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 md:max-h-[420px] md:p-4">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Calendar size={20} style={{ color: 'var(--brand-green)' }} />
            Evenements de la periode
          </h3>

          {visibleEvents.length === 0 ? (
            <p className="py-8 text-center text-gray-500">Aucun evenement dans cette periode</p>
          ) : (
            <div className="space-y-3">
              {visibleEvents.map((event) => (
                <div
                  key={event.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    selectedEvent?.id === event.id
                      ? 'border-[var(--brand-green)] bg-black shadow-md'
                      : 'border-gray-300 bg-black hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <h4
                    className="mb-1 font-semibold"
                    style={{ color: selectedEvent?.id === event.id ? 'var(--brand-green)' : '#fff' }}
                  >
                    {textWithBreaks(event.title)}
                  </h4>
                  <p className="mb-1 text-sm text-gray-400">
                    {event.eventDate.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {event.location && <p className="text-xs text-gray-400">{textWithBreaks(event.location)}</p>}
                  {event.description && (
                    <p className="mt-2 text-xs text-gray-500">{textWithBreaks(event.description)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--brand-green)' }}>
            <Calendar size={16} />
            Periode
          </label>
          <span className="text-sm font-mono text-gray-600">
            {months[startMonth]?.label.split(' ')[0]} - {months[endMonth]?.label.split(' ')[0]}{' '}
            {months[endMonth]?.label.split(' ')[1]}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-600">Date de debut</label>
            <select
              value={startMonth}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value < endMonth) setStartMonth(value)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            >
              {months.slice(0, endMonth).map((month, index) => (
                <option key={month.label} value={index}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-600">Date de fin</label>
            <select
              value={endMonth}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value > startMonth) setEndMonth(value)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            >
              {months.slice(startMonth + 1).map((month) => (
                <option key={month.label} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative mb-2 h-9">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-200" />

          <div
            className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-full transition-all duration-200"
            style={{
              left: `${(startMonth / (months.length - 1)) * 100}%`,
              right: `${100 - (endMonth / (months.length - 1)) * 100}%`,
              background: 'var(--brand-green)',
              boxShadow: '0 0 20px color-mix(in oklab, var(--brand-green), transparent 100%)',
            }}
          />

          <input
            type="range"
            min="0"
            max={String(months.length - 1)}
            value={startMonth}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value < endMonth) setStartMonth(value)
            }}
            onMouseDown={() => setIsDraggingStart(true)}
            onMouseUp={() => setIsDraggingStart(false)}
            onTouchStart={() => setIsDraggingStart(true)}
            onTouchEnd={() => setIsDraggingStart(false)}
            className="range-slider-start pointer-events-none absolute h-9 w-full cursor-pointer appearance-none bg-transparent"
            style={{ zIndex: isDraggingStart ? 30 : 20 }}
          />

          <input
            type="range"
            min="0"
            max={String(months.length - 1)}
            value={endMonth}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value > startMonth) setEndMonth(value)
            }}
            onMouseDown={() => setIsDraggingEnd(true)}
            onMouseUp={() => setIsDraggingEnd(false)}
            onTouchStart={() => setIsDraggingEnd(true)}
            onTouchEnd={() => setIsDraggingEnd(false)}
            className="range-slider-end pointer-events-none absolute h-9 w-full cursor-pointer appearance-none bg-transparent"
            style={{ zIndex: isDraggingEnd ? 30 : 10 }}
          />
        </div>

        <div className="mt-6 flex justify-between text-xs text-gray-500">
          {months.map((month, index) => {
            const isInRange = index >= startMonth && index <= endMonth

            return (
              <span
                key={month.label}
                className={`cursor-pointer transition-all ${
                  isInRange ? 'font-semibold text-[var(--brand-green)]' : 'hover:text-gray-700'
                }`}
                onClick={() => {
                  if (index < startMonth) setStartMonth(index)
                  if (index > endMonth) setEndMonth(index)
                }}
              >
                {month.label.split(' ')[0].substring(0, 3)}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
