import type { GlobalAfterChangeHook } from 'payload'

import { getRevalidateModule } from '@/utilities/getRevalidateFunction'

export const revalidateFooter: GlobalAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (context.disableRevalidate) {
    return doc
  }

  const revalidateModule = await getRevalidateModule()
  if (!revalidateModule) {
    return doc
  }

  const { revalidateTag } = revalidateModule
  if (revalidateTag) {
    payload.logger.info(`Revalidating footer`)
    revalidateTag('global_footer')
  }

  return doc
}
