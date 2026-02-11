import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaType, SectionEnteteBlock as SectionEnteteBlockProps } from '@/payload-types'
import { textWithBreaks } from '@/utilities/textWithBreaks'

const isMediaDocument = (value: unknown): value is MediaType => {
  return Boolean(value && typeof value === 'object' && 'url' in (value as Record<string, unknown>))
}

export const SectionEnteteBlock: React.FC<SectionEnteteBlockProps> = ({
  backgroundImage,
  ctaLabel,
  ctaUrl,
  highlightedText,
  location,
  title,
}) => {
  const backgroundResource = isMediaDocument(backgroundImage) ? backgroundImage : null

  return (
    <section className="relative overflow-hidden bg-[#f2f2f2] pt-2 md:pt-4">
      <div className="container relative z-30">
        <div className="relative overflow-hidden rounded-[28px]">
          <div className="absolute inset-0 z-30 bg-black/55" />
          {backgroundResource ? (
            <Media
              resource={backgroundResource}
              className="absolute inset-0 z-20"
              fill
              imgClassName="h-full min-h-[330px] w-full object-cover md:min-h-[420px]"
            />
          ) : (
            <div className="absolute inset-0 z-20 min-h-[330px] bg-black md:min-h-[420px]" />
          )}

          <div className="relative z-40 flex min-h-[330px] flex-col items-start justify-center gap-6 px-8 py-10 text-white md:min-h-[420px] md:flex-row md:items-center md:px-16">
            <h1 className="max-w-xl text-4xl font-bold uppercase leading-[1.05]">
              <span className="block">{textWithBreaks(title)}</span>
              <span className="block text-[var(--brand-green)]">{textWithBreaks(highlightedText)}</span>
              <span className="block">{textWithBreaks(location)}</span>
            </h1>
            {ctaLabel && (
              <Link
                className="curve-top inline-flex rounded-full bg-[var(--brand-green)] px-6 py-3 text-sm font-bold text-black transition-transform duration-300 hover:-translate-y-0.5"
                href={ctaUrl || '#'}
              >
                {textWithBreaks(ctaLabel)}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
