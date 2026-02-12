'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { navLucideIcons, type NavLucideIconName } from '@/Header/lucideIcons'
import { cn } from '@/utilities/ui'

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

const resolveIcon = (iconName: NavItem['icon']) => {
  if (!iconName || typeof iconName !== 'string') return null
  return navLucideIcons[iconName as NavLucideIconName] ?? null
}

type HeaderNavProps = {
  className?: string
  linkClassName?: string
  navItems?: HeaderType['navItems']
  onItemClick?: () => void
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  className,
  linkClassName,
  navItems,
  onItemClick,
}) => {
  const navItemsList = navItems || []

  return (
    <nav className={cn('flex items-center gap-3', className)}>
      {navItemsList.map((item, i) => {
        const link = item.link
        const href = resolveHref(link)
        if (!href || !link?.label) return null

        const Icon = resolveIcon(item.icon)
        const isGreenPill = item.style === 'green-pill'

        return (
          <Link
            key={i}
            className={
              cn(
                isGreenPill
                  ? 'curve-top group relative inline-flex h-[48px] items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-[var(--brand-green)] px-8 text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-14px_rgba(0,0,0,0.55)]'
                  : 'inline-flex items-center gap-2 whitespace-nowrap text-black transition-opacity hover:opacity-70',
                linkClassName,
              )
            }
            href={href}
            onClick={onItemClick}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
            target={link.newTab ? '_blank' : undefined}
          >
            {isGreenPill && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100"
              />
            )}
            {Icon && (
              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                <Icon
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </span>
            )}
            <span className="relative z-10 whitespace-nowrap">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
