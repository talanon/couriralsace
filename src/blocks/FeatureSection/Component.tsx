import Link from 'next/link'
import React from 'react'

import type { FeatureSectionBlock as FeatureSectionBlockProps } from '@/payload-types'
import { textWithBreaks } from '@/utilities/textWithBreaks'

export const FeatureSectionBlock: React.FC<FeatureSectionBlockProps> = ({
  ctaLink,
  ctaText,
  description,
  highlightedText,
  subtitle,
  title,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#f2f2f2] py-12 md:py-20">
      <div className="container relative z-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-start-7 md:col-span-6">
          <h2 className="text-4xl font-bold uppercase leading-none text-black">
            <span className="block">{textWithBreaks(title)}</span>
            {subtitle && <span className="block">{textWithBreaks(subtitle)}</span>}
            {highlightedText && <span className="block text-[var(--brand-green)]">{textWithBreaks(highlightedText)}</span>}
          </h2>

          {description && (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-black/75 md:text-base">
              {textWithBreaks(description)}
            </p>
          )}

          {ctaText && (
            <Link
              className="curve-top mt-8 inline-flex rounded-full border-2 border-[var(--brand-green)] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
              href={ctaLink || '#'}
            >
              {textWithBreaks(ctaText)}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
