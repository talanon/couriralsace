import { CollectionAfterChangeHook } from 'payload'

import { getRevalidateModule } from '@/utilities/getRevalidateFunction'

export const revalidateTenantNav: CollectionAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (context.disableRevalidate || !doc) {
    return doc
  }

  const revalidateModule = await getRevalidateModule()
  if (!revalidateModule) {
    return doc
  }

  const { revalidateTag } = revalidateModule
  if (revalidateTag) {
    revalidateTag(`tenant_nav_${doc.id}`)
  }

  return doc
}
