import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import { resolveTenant } from '@/utilities/resolveTenant'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const parseBody = async (
  req: NextRequest,
): Promise<{ email?: string; source?: string; sourcePath?: string }> => {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return (await req.json()) as { email?: string; source?: string; sourcePath?: string }
  }

  const formData = await req.formData()
  return {
    email: String(formData.get('email') || ''),
    source: String(formData.get('source') || ''),
    sourcePath: String(formData.get('sourcePath') || ''),
  }
}

const isDuplicateKeyError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false

  const errorWithData = error as { data?: Array<{ message?: string }>; message?: string }
  const message = `${errorWithData.message ?? ''} ${errorWithData.data?.map((item) => item.message).join(' ') ?? ''}`.toLowerCase()

  return message.includes('duplicate') || message.includes('unique')
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const body = await parseBody(req)
  const tenant = await resolveTenant(req.headers.get('host'))

  const email = (body.email || '').trim().toLowerCase()
  const source = (body.source || 'newsletter').trim()
  const sourcePath = (body.sourcePath || '').trim()

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const created = await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email,
        emailKey: `global:${email}`,
        status: 'subscribed',
        source,
        sourcePath,
        subscribedAt: new Date().toISOString(),
        ...(tenant?.id ? { tenant: tenant.id } : {}),
      },
      draft: false,
      overrideAccess: false,
    })

    return NextResponse.json({
      ok: true,
      id: created.id,
    })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    payload.logger.error({
      msg: 'newsletter.subscribe.failed',
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Unable to subscribe' }, { status: 500 })
  }
}
