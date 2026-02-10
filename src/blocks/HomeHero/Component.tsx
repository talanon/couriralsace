import React, { type CSSProperties } from 'react'

import type { HomeHeroBlock as HomeHeroBlockProps } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const buildMediaUrl = (
  resource: HomeHeroBlockProps['background'],
  fallback?: string | null,
) => {
  if (resource && typeof resource === 'object') {
    const mediaPath = resource.filename
      ? `/api/media/file/${encodeURIComponent(resource.filename)}`
      : resource.url
    return getMediaUrl(mediaPath, resource.updatedAt)
  }

  return fallback ?? undefined
}

const buildLogoSrc = (resource: HomeHeroBlockProps['logo']) => {
  if (resource && typeof resource === 'object') {
    const mediaPath = resource.filename
      ? `/api/media/file/${encodeURIComponent(resource.filename)}`
      : resource.url
    return getMediaUrl(mediaPath, resource.updatedAt)
  }
  return undefined
}

const buildLogoNudeSrc = (resource: HomeHeroBlockProps['logoNude']) => {
  if (resource && typeof resource === 'object') {
    const mediaPath = resource.filename
      ? `/api/media/file/${encodeURIComponent(resource.filename)}`
      : resource.url
    return getMediaUrl(mediaPath, resource.updatedAt)
  }
  return undefined
}

export const HomeHeroBlock: React.FC<HomeHeroBlockProps> = ({
  background,
  backgroundUrl,
  buttonLabel,
  highlightText,
  headline,
  inputPlaceholder,
  logo,
  logoNude,
  tagline,
}) => {
  const heroImage = buildMediaUrl(background, backgroundUrl)
  const logoSrc = buildLogoSrc(logo)
  const nudeSrc = buildLogoNudeSrc(logoNude)

  const heroStyle: CSSProperties = {
    backgroundColor: '#111',
    backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: 460,
  }

  if (heroImage) {
    heroStyle.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.81) 60%, rgba(0, 0, 0, 0.93) 100%), url('${heroImage}')`
  }

  const heroHeadline = headline || 'Toutes les sorties trail & course à pied'
  const heroHighlight = highlightText || 'officielles... ou pas !'
  const heroTagline = tagline || 'Le fil des sorties, officielles ou improvisées.'
  const placeholder = inputPlaceholder || 'Votre adresse mail...'
  const buttonText = buttonLabel || 'Rester informé(e) !'

  return (
    <section className="flex flex-col items-center gap-10 px-4 py-12">
      {logoSrc && (
        <figure className="flex items-center justify-center px-4">
          <img className="max-h-[140px] w-auto lg:max-h-[180px]" alt="Logo" src={logoSrc} />
        </figure>
      )}

      <div className="w-full max-w-[1200px] shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
        <div className="relative overflow-hidden" style={heroStyle}>
          <div className="flex min-h-[460px] w-full flex-col items-center justify-center gap-6 px-6 text-center text-white">
            <p
              className="max-w-xl uppercase text-white/80 text-center"
              style={{
                fontFamily: 'var(--font-akshar), var(--font-geist-sans), system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '20px',
                lineHeight: '50px',
                letterSpacing: '0em',
              }}
            >
              {heroTagline}
            </p>
            <div className="max-w-3xl text-[40px] leading-[50px] font-[500] tracking-[0em] text-white md:text-[40px] lg:text-[40px]">
              {heroHeadline}
              <br />
              <span className="text-[#B0FF34] block tracking-[0em] text-[40px] leading-[50px] font-[500]">
                {heroHighlight}
              </span>
            </div>
            <div className="w-full max-w-3xl px-4">
              <div className="flex flex-col gap-3 rounded-full border border-white/60 bg-white/90 px-3 py-2 shadow-lg sm:flex-row sm:items-center items-center">
                <input
                  aria-label="Adresse mail"
                  className="flex-1 rounded-full border-none bg-transparent px-3 text-base font-medium text-slate-900 outline-none placeholder:text-slate-500"
                  style={{
                    height: '47px',
                    lineHeight: '50px',
                  }}
                  placeholder={placeholder}
                  type="email"
                  autoComplete="email"
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#B0FF34] px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-black transition hover:bg-[#9bf22d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0FF34] self-center sm:self-auto"
                  style={{
                    height: '47px',
                    minHeight: '47px',
                    width: '174px',
                    fontFamily: 'var(--font-akshar), var(--font-geist-sans), system-ui, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '70px',
                    letterSpacing: '0em',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                  }}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {nudeSrc && (
        <figure className="relative flex items-center justify-center px-4 -mt-4 sm:-mt-20">
          <img
            className="relative z-10 max-h-32 w-auto -translate-y-4 sm:-translate-y-10"
            alt="Logo attire"
            src={nudeSrc}
          />
        </figure>
      )}
    </section>
  )
}
