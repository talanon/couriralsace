import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { ImageTextBlock as ImageTextBlockProps, Media as MediaType } from '@/payload-types'
import { textWithBreaks } from '@/utilities/textWithBreaks'
import { cn } from '@/utilities/ui'

const isMediaDocument = (value: unknown): value is MediaType => {
  return Boolean(value && typeof value === 'object' && 'url' in (value as Record<string, unknown>))
}

export const ImageTextBlock: React.FC<ImageTextBlockProps> = ({
  ctas,
  description,
  highlightedText,
  image,
  layout,
  subtitle,
  title,
}) => {
  const media = isMediaDocument(image) ? image : null

  return (
    <section className="relative overflow-hidden bg-[#f2f2f2] py-14 md:py-20">
      <div className="container relative z-10 grid items-center gap-10 md:grid-cols-12">
        <div
          className={cn(
            'overflow-hidden rounded-[30px] md:col-span-6',
            layout === 'imageRight' && 'md:col-start-7',
          )}
        >
          {media ? (
            <Media resource={media} imgClassName="h-full w-full min-h-[280px] object-cover" />
          ) : (
            <div className="min-h-[280px] bg-black/10" />
          )}
        </div>

        <div className={cn('md:col-span-5', layout === 'imageRight' ? 'md:col-start-1 md:row-start-1' : 'md:col-start-8')}>
          <h2 className="text-4xl font-bold uppercase leading-none text-black">
            <span className="block">{textWithBreaks(title)}</span>
            {subtitle && <span className="block">{textWithBreaks(subtitle)}</span>}
            {highlightedText && <span className="block text-[var(--brand-green)]">{textWithBreaks(highlightedText)}</span>}
          </h2>

          {description && (
            <p className="mt-6 text-sm leading-relaxed text-black/75 md:text-base">{textWithBreaks(description)}</p>
          )}

          {ctas && ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta, index) => (
                <Link
                  className="curve-top inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-green)] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
                  href={cta.link || '#'}
                  key={`${cta.text}-${index}`}
                >
                  {cta.icon && <span>{cta.icon}</span>}
                  <span>{textWithBreaks(cta.text)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
