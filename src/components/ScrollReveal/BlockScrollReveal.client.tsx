'use client'

import type { PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'

const REVEAL_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'figure',
  'img',
  'article',
  'li',
  'blockquote',
  'a[data-reveal]',
  'button[data-reveal]',
  '[data-reveal-item]',
].join(',')

export const BlockScrollReveal = ({ children }: PropsWithChildren) => {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    root.dataset.scrollRevealVisible = 'false'

    const items = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter((item) => {
      if (item.dataset.reveal === 'false') {
        return false
      }

      return !item.closest('[data-reveal-ignore]')
    })

    if (!items.length) {
      return
    }

    items.forEach((item, index) => {
      item.dataset.scrollRevealItem = ''
      item.style.setProperty('--scroll-reveal-index', String(index))
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          root.dataset.scrollRevealVisible = entry.isIntersecting ? 'true' : 'false'
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div data-scroll-reveal-root ref={rootRef}>
      {children}
    </div>
  )
}
