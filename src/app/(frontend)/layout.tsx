import type { Metadata } from 'next'

import { draftMode, headers } from 'next/headers'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Akshar } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { resolveTenant } from '@/utilities/resolveTenant'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const akshar = Akshar({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-akshar',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()
  const hostHeader = requestHeaders.get('host')
  const baseURL = new URL(getServerSideURL())
  const host = hostHeader || baseURL.host
  const tenant = await resolveTenant(host)
  const forwardedProto = requestHeaders.get('x-forwarded-proto')
  const protocol = forwardedProto || baseURL.protocol.replace(':', '')
  const mediaOrigin = `${protocol}://${host}`

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, akshar.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers mediaOrigin={mediaOrigin}>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header tenant={tenant} />
          {children}
          <Footer />
        </Providers>
      </body>
  </html>
)
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
