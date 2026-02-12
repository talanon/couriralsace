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
  const strokeWidth = variant === 'dark' ? 108 : 136

  return (
    <>
      {(position === 'right' || position === 'both') && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[38vw] min-w-[220px] overflow-hidden md:w-[48vw] md:min-w-[360px]" aria-hidden>
          <div
            className={cn(
              'absolute -right-[980px] top-1/2 h-[1200px] w-[1200px] -translate-y-1/2 transition-opacity duration-500 md:-right-[1120px] md:h-[1500px] md:w-[1500px]',
              className,
            )}
          >
            <svg className={cn('h-full w-full', appliedOpacity)} viewBox="0 0 1200 1200" fill="none">
              <ellipse cx="600" cy="600" rx="505" ry="505" stroke="var(--brand-green)" strokeWidth={strokeWidth}>
                <animate className="curve-svg-animate" attributeName="cx" values="600;596;602;600" dur="11s" repeatCount="indefinite" />
                <animate className="curve-svg-animate" attributeName="cy" values="600;603;598;600" dur="12s" repeatCount="indefinite" />
                <animate className="curve-svg-animate" attributeName="rx" values="505;510;503;505" dur="10s" repeatCount="indefinite" />
                <animate className="curve-svg-animate" attributeName="ry" values="505;500;507;505" dur="10s" repeatCount="indefinite" />
              </ellipse>
            </svg>
          </div>
        </div>
      )}

      {(position === 'left' || position === 'both') && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[38vw] min-w-[220px] overflow-hidden md:w-[48vw] md:min-w-[360px]" aria-hidden>
          <div
            className={cn(
              'absolute -left-[980px] top-1/2 h-[1200px] w-[1200px] -translate-y-1/2 transition-opacity duration-500 md:-left-[1120px] md:h-[1500px] md:w-[1500px]',
              className,
            )}
          >
            <svg className={cn('h-full w-full', appliedOpacity)} viewBox="0 0 1200 1200" fill="none">
              <ellipse cx="600" cy="600" rx="505" ry="505" stroke="var(--brand-green)" strokeWidth={strokeWidth}>
                <animate className="curve-svg-animate" attributeName="cx" values="600;604;598;600" dur="11s" repeatCount="indefinite" />
                <animate className="curve-svg-animate" attributeName="cy" values="600;597;602;600" dur="12s" repeatCount="indefinite" />
                <animate className="curve-svg-animate" attributeName="rx" values="505;510;503;505" dur="10s" repeatCount="indefinite" />
                <animate className="curve-svg-animate" attributeName="ry" values="505;500;507;505" dur="10s" repeatCount="indefinite" />
              </ellipse>
            </svg>
          </div>
        </div>
      )}
    </>
  )
}
