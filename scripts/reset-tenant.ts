import 'dotenv/config'

import type { Payload, PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import type { Page } from '../src/payload-types'
import { createTenantPages } from '../src/hooks/createTenantPages'
import config from '../src/payload.config'

const payloadPromise = getPayload({ config })

const buildRequest = (payload: Payload): PayloadRequest => {
  const baseUrl = config.serverURL || 'http://localhost:3000'
  return {
    url: `${baseUrl}/api/tenants/reset`,
    method: 'POST',
    headers: new Headers(),
    payload,
    payloadAPI: 'local',
    payloadDataLoader: payload.payloadDataLoader ?? undefined,
    context: {},
    i18n: payload.i18n,
    t: payload.i18n?.t ?? ((key: string) => key),
    body: undefined,
  }
}

const collectFormIds = (pages: Page[]) => {
  const formIds = new Set<number>()

  for (const page of pages) {
    if (!Array.isArray(page.layout)) continue

    for (const block of page.layout) {
      if (block?.blockType !== 'formBlock') continue
      const formValue = (block as { form?: number | { id?: number } }).form
      if (!formValue) continue

      const formId = typeof formValue === 'number' ? formValue : formValue.id
      if (formId) {
        formIds.add(formId)
      }
    }
  }

  return formIds
}

const usage = () => {
  // eslint-disable-next-line no-console
  console.log('Usage: pnpm tsx scripts/reset-tenant.ts <tenant-slug-or-id>')
  process.exit(1)
}

const isIsoNumeric = (value: string) => /^\\d+$/.test(value)

const buildTenantWhereClause = (identifier: string) => {
  if (isIsoNumeric(identifier)) {
    return { id: { equals: Number(identifier) } }
  }

  return {
    or: [
      { name: { equals: identifier } },
      { domains: { host: { contains: identifier } } },
    ],
  }
}

const deleteSubmissionsForForm = async (
  payload: Payload,
  req: PayloadRequest,
  formId: number,
) => {
  const limit = 200
  let page = 1

  while (true) {
    const submissions = await payload.find({
      collection: 'form-submissions',
      depth: 0,
      limit,
      page,
      overrideAccess: true,
      where: {
        form: {
          equals: formId,
        },
      },
      req,
    })

    if (!submissions.docs.length) {
      break
    }

    for (const submission of submissions.docs) {
      await payload.delete({
        collection: 'form-submissions',
        id: submission.id,
        depth: 0,
        req,
        overrideAccess: true,
      })
    }

    if (submissions.docs.length < limit) {
      break
    }

    page += 1
  }
}

const deleteTenantPages = async (payload: Payload, req: PayloadRequest, tenantId: number) => {
  const pages = await payload.find({
    collection: 'pages',
    depth: 0,
    pagination: false,
    limit: 1000,
    overrideAccess: true,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
    req,
  })

  const pageDocs = pages.docs ?? []
  const formIds = collectFormIds(pageDocs)

  if (!pageDocs.length) {
    payload.logger.info(`No pages found for tenant ${tenantId}`)
  }

  for (const page of pageDocs) {
    await payload.delete({
      collection: 'pages',
      id: page.id,
      depth: 0,
      req,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  for (const formId of formIds) {
    await deleteSubmissionsForForm(payload, req, formId)
    await payload.delete({
      collection: 'forms',
      id: formId,
      depth: 0,
      req,
      overrideAccess: true,
    })
  }

  return pageDocs
}

const main = async () => {
  const identifier = process.argv.slice(2)[0]
  if (!identifier) {
    usage()
  }

  const payload = await payloadPromise
  const req = buildRequest(payload)
  req.context.disableRevalidate = true

  const whereClause = buildTenantWhereClause(identifier)

  const tenantResult = await payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    req,
    where: whereClause,
  })

  const tenant = tenantResult.docs?.[0] ?? null

  if (!tenant) {
    payload.logger.error('Tenant not found')
    await payload.destroy()
    process.exit(1)
  }

  await deleteTenantPages(payload, req, tenant.id)
  await createTenantPages({ doc: tenant, operation: 'create', req })

  payload.logger.info(`Tenant ${tenant.slug} (${tenant.id}) has been reset.`)
  await payload.destroy()
}

void main().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  void (await payloadPromise).destroy()
  process.exit(1)
})
