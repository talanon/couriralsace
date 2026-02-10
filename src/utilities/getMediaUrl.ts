const appendCacheTag = (base: string, cacheTag?: string | null) => {
  if (!cacheTag) {
    return base
  }

  const separator = base.includes('?') ? '&' : '?'
  return `${base}${separator}${cacheTag}`
}

/**
 * Processes media resource URL to ensure proper formatting
 */
export const getMediaUrl = (
  url: string | null | undefined,
  cacheTag?: string | null,
  origin?: string,
): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return appendCacheTag(url, cacheTag)
  }

  const base = origin ? `${origin}${url}` : url
  return appendCacheTag(base, cacheTag)
}
