import type { CollectionAfterChangeHook } from 'payload'

import { getRevalidateModule } from '@/utilities/getRevalidateFunction'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  const revalidateModule = await getRevalidateModule()
  if (revalidateModule?.revalidateTag) {
    payload.logger.info(`Revalidating redirects`)
    revalidateModule.revalidateTag('redirects')
  }

  return doc
}
