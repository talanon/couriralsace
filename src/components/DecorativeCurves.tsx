import React from 'react'

import { cn } from '@/utilities/ui'

type DecorativeCurvesProps = {
  className?: string
  opacity?: string
  position?: 'left' | 'right' | 'both'
  variant?: 'light' | 'dark'
}

export const DecorativeCurves: React.FC<DecorativeCurvesProps> = ({
  className,
  opacity,
  position = 'right',
  variant = 'light',
}) => {
  const appliedOpacity = opacity ?? (variant === 'dark' ? 'opacity-45' : 'opacity-85')
  const ringThickness = variant === 'dark' ? 'border-[70px] md:border-[110px]' : 'border-[90px] md:border-[140px]'

  return (
    <>
      {(position === 'right' || position === 'both') && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[38vw] min-w-[220px] overflow-hidden md:w-[48vw] md:min-w-[360px]" aria-hidden>
          <div
            className={cn(
              'absolute -right-[980px] top-1/2 h-[1200px] w-[1200px] -translate-y-1/2 rounded-full border-[var(--brand-green)] transition-opacity duration-500 md:-right-[1120px] md:h-[1500px] md:w-[1500px]',
              ringThickness,
              appliedOpacity,
              className,
            )}
          />
        </div>
      )}

      {(position === 'left' || position === 'both') && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[38vw] min-w-[220px] overflow-hidden md:w-[48vw] md:min-w-[360px]" aria-hidden>
          <div
            className={cn(
              'absolute -left-[980px] top-1/2 h-[1200px] w-[1200px] -translate-y-1/2 rounded-full border-[var(--brand-green)] transition-opacity duration-500 md:-left-[1120px] md:h-[1500px] md:w-[1500px]',
              ringThickness,
              appliedOpacity,
              className,
            )}
          />
        </div>
      )}
    </>
  )
}
