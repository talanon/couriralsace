let cached: Promise<typeof import('next/dist/server/web/spec-extension/revalidate') | null> | null = null

export const getRevalidateModule = async () => {
  if (cached) {
    return cached
  }

  cached = (async () => {
    try {
      return await import('next/dist/server/web/spec-extension/revalidate')
    } catch (error) {
      console.warn('Failed to load revalidate helper', error)
      return null
    }
  })()

  return cached
}
