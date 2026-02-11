'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type LinkValue = NavItem['link']

const resolveHref = (link: LinkValue): string | null => {
  if (link?.type === 'custom') {
    return link.url || null
  }

  if (link?.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const reference = link.reference.value
    if (!reference?.slug) return null
    return `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${reference.slug}`
  }

  return null
}

const resolveIconSrc = (item: NavItem): string | null => {
  const icon = item.icon
  if (!icon || typeof icon === 'number' || typeof icon === 'string') return null

  const mediaPath = icon.filename ? `/api/media/file/${encodeURIComponent(icon.filename)}` : icon.url
  return getMediaUrl(mediaPath, icon.updatedAt)
}

export const HeaderNav: React.FC<{ navItems?: HeaderType['navItems'] }> = ({ navItems }) => {
  const navItemsList = navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItemsList.map((item, i) => {
        const link = item.link
        const href = resolveHref(link)
        if (!href || !link?.label) return null

        const iconSrc = resolveIconSrc(item)
        const isGreenPill = item.style === 'green-pill'

        return (
          <Link
            key={i}
            className={
              isGreenPill
                ? 'curve-top inline-flex h-[48px] items-center gap-2 rounded-full bg-[var(--brand-green)] px-8 text-black'
                : 'inline-flex items-center gap-2 text-black transition-opacity hover:opacity-70'
            }
            href={href}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
            target={link.newTab ? '_blank' : undefined}
          >
            {iconSrc && <img alt="" src={iconSrc} className="h-4 w-4 object-contain" />}
            <span>{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
