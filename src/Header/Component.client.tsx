'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
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
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="relative z-20 bg-[#f2f2f2]"
      {...(theme ? { 'data-theme': theme } : {})}
      data-page-template-hidden
    >
      <div className="container pb-3 pt-4 flex justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" className="h-[52px] w-auto max-w-none md:h-[64px] lg:h-[80px]" />
        </Link>
        <HeaderNav navItems={navItems} />
      </div>
    </header>
  )
}
