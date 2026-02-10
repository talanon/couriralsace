import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'
const S3_ENDPOINT = process.env.S3_ENDPOINT
const S3_BUCKET = process.env.S3_BUCKET
const S3_REGION = process.env.S3_REGION

const s3RemotePatterns = []

if (S3_ENDPOINT) {
  const endpoint = new URL(S3_ENDPOINT)
  s3RemotePatterns.push({
    hostname: endpoint.hostname,
    protocol: endpoint.protocol.replace(':', ''),
  })
}

if (S3_BUCKET && S3_REGION) {
  s3RemotePatterns.push({
    protocol: 'https',
    hostname: `${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`,
  })
  s3RemotePatterns.push({
    protocol: 'https',
    hostname: `s3.${S3_REGION}.amazonaws.com`,
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */]
        .filter(Boolean)
        .map((item) => {
          const url = new URL(item)

          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          }
        }),
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '*.localhost',
      },
      ...s3RemotePatterns,
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
