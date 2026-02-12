/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

interface PageClientProps {
  template?: string | null
}

const PageClient: React.FC<PageClientProps> = ({ template }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useEffect(() => {
    const normalizedTemplate = template ?? 'default'
    document.body.dataset.pageTemplate = normalizedTemplate

    return () => {
      if (document.body.dataset.pageTemplate === normalizedTemplate) {
        delete document.body.dataset.pageTemplate
      }
    }
  }, [template])

  return <React.Fragment />
}

export default PageClient
