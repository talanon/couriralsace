import 'dotenv/config'

import crypto from 'crypto'

import type { Payload, PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const limit = 200

const buildUrlBase = (): string =>
  config.serverURL && config.serverURL.length ? config.serverURL : 'http://localhost:3000'

const payloadPromise = getPayload({ config })

async function main() {
  const payload = await payloadPromise
  const usersCollection = payload.collections.users

  if (!usersCollection?.config.auth?.verify) {
    throw new Error('Users collection does not have auth.verify configured')
  }

  const emailAdapter = payload.email
  if (!emailAdapter) {
    throw new Error('No email adapter configured')
  }

  const { generateEmailSubject, generateEmailHTML } = usersCollection.config.auth.verify
  const baseUrl = buildUrlBase()
  const buildReq = (user?: { id: number; email: string; collection?: string }) => {
    const req: PayloadRequest = {
      url: `${baseUrl}/api/tenants/resend-verifications`,
      headers: new Headers(),
      method: 'POST',
      payload,
      payloadAPI: 'local',
      payloadDataLoader: payload.payloadDataLoader ?? undefined,
      context: {},
      i18n: payload.i18n,
      t: payload.i18n?.t ?? ((key: string) => key),
      user: user
        ? {
            ...user,
            collection: 'users',
          }
        : null,
    }
    return req
  }
  const req = buildReq()

  let page = 1
  let totalSent = 0

  while (true) {
    const result = await payload.find({
      collection: 'users',
      depth: 0,
      limit,
      page,
      where: {
        or: [
          { _verified: { equals: false } },
          { _verified: { equals: null } },
          { _verified: { exists: false } },
        ],
      },
      req,
      overrideAccess: true,
    })

    if (!result.docs.length) {
      break
    }

    for (const user of result.docs) {
      const token = crypto.randomBytes(20).toString('hex')
      const updated = await payload.db.updateOne({
        id: user.id,
        collection: 'users',
        data: {
          ...user,
          _verificationToken: token,
          _verified: false,
        },
        req,
        returning: true,
      })

      const localizedReq = buildReq(updated as { id: number; email: string })

      const subject =
        typeof generateEmailSubject === 'function'
          ? await generateEmailSubject({ req: localizedReq, token, user: updated })
          : localizedReq.t('authentication:verifyYourEmail')

      const html =
        typeof generateEmailHTML === 'function'
          ? await generateEmailHTML({ req: localizedReq, token, user: updated })
          : `<a href="${baseUrl}/users/verify/${token}">${baseUrl}/users/verify/${token}</a>`

      await emailAdapter.sendEmail({
        from: `${emailAdapter.defaultFromName} <${emailAdapter.defaultFromAddress}>`,
        to: updated.email,
        subject,
        html,
      })

      payload.logger.info(`Resent verification to ${updated.email}`)
      totalSent += 1
    }

    if (result.docs.length < limit) {
      break
    }

    page += 1
  }

  payload.logger.info(`Resent verification to ${totalSent} accounts.`)
  await payload.destroy()
}

void main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
