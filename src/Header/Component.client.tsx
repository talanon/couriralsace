'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  navItems?: Header['navItems']
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navItems }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMobileMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky top-0 z-40 bg-[#f2f2f2]"
      {...(theme ? { 'data-theme': theme } : {})}
      data-page-template-hidden
    >
      <div className="container pb-3 pt-4 flex items-center justify-between">
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
          <Logo loading="eager" priority="high" className="h-[52px] w-auto max-w-none md:h-[64px] lg:h-[80px]" />
        </Link>
        <button
          type="button"
          aria-controls="mobile-header-menu"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-black transition-colors hover:bg-black/5 md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <HeaderNav navItems={navItems} className="hidden md:flex" />
      </div>
      {mobileMenuOpen && (
        <div id="mobile-header-menu" className="container pb-4 md:hidden">
          <HeaderNav
            navItems={navItems}
            className="flex flex-col items-stretch gap-2"
            linkClassName="w-full justify-center"
            onItemClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </header>
  )
}
