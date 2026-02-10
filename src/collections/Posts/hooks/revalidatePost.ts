import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

import { getRevalidateModule } from '@/utilities/getRevalidateFunction'

import type { Post } from '../../../payload-types'

const runPostRevalidate = async (paths: string[], logger: Payload['logger']) => {
  const revalidateModule = await getRevalidateModule()
  if (!revalidateModule) return

  const { revalidatePath, revalidateTag } = revalidateModule
  for (const path of paths) {
    if (revalidatePath) {
      revalidatePath(path)
    }
  }

  if (revalidateTag) {
    revalidateTag('posts-sitemap')
  }
}

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  const pathsToRevalidate: string[] = []

  if (doc._status === 'published') {
    const path = `/posts/${doc.slug}`
    payload.logger.info(`Revalidating post at path: ${path}`)
    pathsToRevalidate.push(path)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = `/posts/${previousDoc.slug}`
    payload.logger.info(`Revalidating old post at path: ${oldPath}`)
    pathsToRevalidate.push(oldPath)
  }

  if (pathsToRevalidate.length) {
    await runPostRevalidate(pathsToRevalidate, payload.logger)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({ doc, req: { context, payload } }) => {
  if (context.disableRevalidate) {
    return doc
  }

  const path = `/posts/${doc?.slug}`
  await runPostRevalidate([path], payload.logger)

  return doc
}
