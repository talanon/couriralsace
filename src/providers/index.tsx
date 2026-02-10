import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { MediaOriginProvider } from './MediaOrigin'

export const Providers: React.FC<{
  children: React.ReactNode
  mediaOrigin: string
}> = ({ children, mediaOrigin }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <MediaOriginProvider origin={mediaOrigin}>{children}</MediaOriginProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
