import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

import { getRevalidateModule } from '@/utilities/getRevalidateFunction'

import type { Page } from '../../../payload-types'

const runRevalidate = async (paths: string[], payload: Payload['logger']) => {
  const module = await getRevalidateModule()
  if (!module) return

  const { revalidatePath, revalidateTag } = module
  for (const path of paths) {
    if (revalidatePath) {
      revalidatePath(path)
    }
  }

  if (revalidateTag) {
    revalidateTag('pages-sitemap')
  }
}

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  const pathsToRevalidate: string[] = []

  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    payload.logger.info(`Revalidating page at path: ${path}`)
    pathsToRevalidate.push(path)
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
    payload.logger.info(`Revalidating old page at path: ${oldPath}`)
    pathsToRevalidate.push(oldPath)
  }

  if (pathsToRevalidate.length) {
    await runRevalidate(pathsToRevalidate, payload.logger)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req: { context, payload } }) => {
  if (context.disableRevalidate) {
    return doc
  }

  const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
  await runRevalidate([path], payload.logger)

  return doc
}
