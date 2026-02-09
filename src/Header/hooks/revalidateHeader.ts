import type { GlobalAfterChangeHook } from 'payload'

import { getRevalidateModule } from '@/utilities/getRevalidateFunction'

export const revalidateHeader: GlobalAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (context.disableRevalidate) {
    return doc
  }

  const module = await getRevalidateModule()
  if (!module) {
    return doc
  }

  const { revalidateTag } = module
  if (revalidateTag) {
    payload.logger.info(`Revalidating header`)
    revalidateTag('global_header')
  }

  return doc
}
