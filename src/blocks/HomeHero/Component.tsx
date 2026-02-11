import React, { type CSSProperties } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { HomeHeroBlock as HomeHeroBlockProps } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Media } from '@/payload-types'
import { NewsletterSignupForm } from './NewsletterSignupForm.client'

const resolveMediaDoc = async (
  resource: HomeHeroBlockProps['background'] | HomeHeroBlockProps['logo'] | HomeHeroBlockProps['logoNude'],
): Promise<Media | null> => {
  if (!resource) return null
  if (typeof resource === 'object' && 'filename' in resource) return resource as Media
  if (typeof resource !== 'string' && typeof resource !== 'number') return null

  const payload = await getPayload({ config: configPromise })
  const media = await payload.findByID({
    collection: 'media',
    id: String(resource),
    depth: 0,
    overrideAccess: true,
  })

  return media || null
}

const buildMediaUrl = (
  resource: Media | null,
  fallback?: string | null,
) => {
  if (resource) {
    const mediaPath = resource.filename
      ? `/api/media/file/${encodeURIComponent(resource.filename)}`
      : resource.url
    return getMediaUrl(mediaPath, resource.updatedAt)
  }

  return fallback ?? undefined
}

const buildLogoSrc = (resource: Media | null) => {
  if (resource) {
    const mediaPath = resource.filename
      ? `/api/media/file/${encodeURIComponent(resource.filename)}`
      : resource.url
    return getMediaUrl(mediaPath, resource.updatedAt)
  }
  return undefined
}

const buildLogoNudeSrc = (resource: Media | null) => {
  if (resource) {
    const mediaPath = resource.filename
      ? `/api/media/file/${encodeURIComponent(resource.filename)}`
      : resource.url
    return getMediaUrl(mediaPath, resource.updatedAt)
  }
  return undefined
}

const renderStyledText = (value: string) => {
  const source = value.replace(/<br\s*\/?>/gi, '\n')
  const lines = source.split('\n')

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(<green>[\s\S]*?<\/green>)/gi).filter(Boolean)

    return (
      <React.Fragment key={`headline-line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          const match = part.match(/^<green>([\s\S]*?)<\/green>$/i)
          if (match) {
            return (
              <span className="text-[var(--brand-green)]" key={`headline-part-${lineIndex}-${partIndex}`}>
                {match[1]}
              </span>
            )
          }

          return <span key={`headline-part-${lineIndex}-${partIndex}`}>{part}</span>
        })}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    )
  })
}

export const HomeHeroBlock = async ({
  background,
  backgroundUrl,
  buttonLabel,
  headlineStyled,
  inputPlaceholder,
  logo,
  logoNude,
  tagline,
}: HomeHeroBlockProps) => {
  const [resolvedBackground, resolvedLogo, resolvedLogoNude] = await Promise.all([
    resolveMediaDoc(background),
    resolveMediaDoc(logo),
    resolveMediaDoc(logoNude),
  ])

  const heroImage = buildMediaUrl(resolvedBackground, backgroundUrl)
  const logoSrc = buildLogoSrc(resolvedLogo)
  const nudeSrc = buildLogoNudeSrc(resolvedLogoNude)

  const heroStyle: CSSProperties = {
    backgroundColor: '#111',
    backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: 460,
  }

  if (heroImage) {
    heroStyle.backgroundImage = `url('${heroImage}')`
  }

  const heroHeadline =
    headlineStyled || 'Toutes les sorties\n<green>trail & course à pied</green>\nen Alsace'
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

      <div className="w-full max-w-[1200px]">
        <div className="relative overflow-hidden rounded-[50px]" style={heroStyle}>
          <div className="flex min-h-[460px] w-full flex-col items-center justify-center gap-6 px-6 text-center text-white">
            <div className="max-w-3xl text-[40px] leading-[50px] font-[500] tracking-[0em] text-white md:text-[40px] lg:text-[40px]">
              {renderStyledText(heroHeadline)}
            </div>
            <p
              className="max-w-2xl text-center text-white/85"
              style={{
                fontFamily: 'var(--font-open-sans), var(--font-geist-sans), system-ui, sans-serif',
                fontWeight: 300,
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle',
              }}
            >
              {renderStyledText(heroTagline)}
            </p>
            <div className="w-full max-w-3xl px-4">
              <NewsletterSignupForm buttonText={buttonText} placeholder={placeholder} />
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
