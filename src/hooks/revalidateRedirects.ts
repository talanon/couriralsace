import type { CollectionAfterChangeHook } from 'payload'

import { getRevalidateModule } from '@/utilities/getRevalidateFunction'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  const module = await getRevalidateModule()
  if (module?.revalidateTag) {
    payload.logger.info(`Revalidating redirects`)
    module.revalidateTag('redirects')
  }

  return doc
}
