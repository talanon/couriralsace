import React from 'react'

import type { TimelineBlock as TimelineBlockProps } from '@/payload-types'
import { textWithBreaks } from '@/utilities/textWithBreaks'

export const TimelineBlock: React.FC<TimelineBlockProps> = ({ highlightedText, steps, title }) => {
  if (!steps?.length) return null

  return (
    <section className="bg-[#f2f2f2] py-14 md:py-20">
      <div className="container">
        <h2 className="text-center text-4xl font-bold uppercase leading-none text-black">
          {textWithBreaks(title)}{' '}
          {highlightedText && <span className="text-[var(--brand-green)]">{textWithBreaks(highlightedText)}</span>}
        </h2>

        <div className="relative mt-10">
          <div
            className="absolute left-0 right-0 top-5 hidden h-[2px] md:block"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, rgba(0,0,0,0.65) 0 10px, transparent 10px 22px)',
            }}
          />

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => {
              const isActive = step.isActive !== false

              return (
                <article
                  className="animate-[fadeUp_0.6s_ease-out_forwards] opacity-0"
                  key={step.id || index}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="relative mb-4 flex h-10 items-center md:justify-start">
                    <div
                      className={
                        isActive
                          ? 'h-[25px] w-[25px] rounded-full bg-[var(--brand-green)]'
                          : 'h-[25px] w-[25px] rounded-full border-2 border-black bg-white'
                      }
                    />
                  </div>
                  <p className={isActive ? 'text-xs font-bold uppercase text-[var(--brand-green)]' : 'text-xs font-bold uppercase text-black/35'}>
                    ETAPE {index + 1}
                  </p>
                  <h3 className={isActive ? 'mt-2 text-2xl font-bold leading-tight text-black' : 'mt-2 text-2xl font-bold leading-tight text-black/50'}>
                    {textWithBreaks(step.title)}
                  </h3>
                  {step.description && (
                    <p className={isActive ? 'mt-3 text-sm leading-relaxed text-black/70' : 'mt-3 text-sm leading-relaxed text-black/45'}>
                      {textWithBreaks(step.description)}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
