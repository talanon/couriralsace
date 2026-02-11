import React from 'react'

import type { StatsBlock as StatsBlockProps } from '@/payload-types'
import { textWithBreaks } from '@/utilities/textWithBreaks'

export const StatsBlock: React.FC<StatsBlockProps> = ({ items }) => {
  if (!items?.length) return null

  return (
    <section className="bg-[#f2f2f2] py-10 md:py-16">
      <div className="container grid gap-8 md:grid-cols-3">
        {items.map((item, index) => (
          <div className="text-left" key={item.id || index}>
            <p className="text-6xl font-bold leading-none text-[var(--brand-green)]">
              {textWithBreaks(item.number)}
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-black">
              {textWithBreaks(item.label)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
