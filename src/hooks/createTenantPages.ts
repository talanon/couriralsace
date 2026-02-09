import type { AfterChangeHook } from 'payload'

import type { Page, Tenant } from '@/payload-types'

type PageTemplate = {
  slug: string
  title: string
  body: string
}

type RichTextNode = Record<string, unknown>

const createTextNode = (text: string): RichTextNode => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const createHeadingNode = (text: string): RichTextNode => ({
  type: 'heading',
  tag: 'h2',
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  children: [createTextNode(text)],
})

const createParagraphNode = (text: string): RichTextNode => ({
  type: 'paragraph',
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
  children: [createTextNode(text)],
})

const createRichText = (children: RichTextNode[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const contentBlock = (heading: string, body: string) => ({
  blockType: 'content',
  blockName: heading,
  columns: [
    {
      size: 'full',
      richText: createRichText([createHeadingNode(heading), createParagraphNode(body)]),
    },
  ],
})

const pageTemplates = (tenantName: string): PageTemplate[] => [
  {
    slug: 'home',
    title: 'Accueil',
    body: `Bienvenue sur le site officiel de ${tenantName}. Retrouvez toutes les infos sur les épreuves, les tarifs et l'organisation.`,
  },
  {
    slug: 'épreuves',
    title: 'Épreuves',
    body: `Découvrez les parcours, les distances et les étapes proposées par ${tenantName}.`,
  },
  {
    slug: 'tarifs',
    title: 'Tarifs',
    body: `Consultez les formules d'inscription, les services additionnels et les avantages proposés par ${tenantName}.`,
  },
  {
    slug: 'resultats',
    title: 'Résultats',
    body: `Retrouvez les résultats des éditions précédentes et les performances marquantes signées ${tenantName}.`,
  },
  {
    slug: 'reglement',
    title: 'Règlement',
    body: `Le règlement complet des épreuves ${tenantName}, avec les règles de sécurité et les consignes à suivre.`,
  },
  {
    slug: 'contact',
    title: 'Contact',
    body: `Contactez l'équipe ${tenantName} pour toute demande d'information, de soutien ou de partenariat.`,
  },
]

const createBasePage = (tenantId: number, template: PageTemplate) => ({
  title: template.title,
  slug: template.slug,
  _status: 'published',
  tenant: tenantId,
  hero: {
    type: 'none',
  },
  layout: [contentBlock(template.title, template.body)],
})

const registrationFormPayload = (tenantName: string) => ({
  title: `Inscription - ${tenantName}`,
  submitButtonLabel: 'S’inscrire',
  confirmationType: 'message',
  confirmationMessage: createRichText([
    createParagraphNode(
      'Merci pour votre demande d’inscription. Nous reviendrons vers vous rapidement avec tous les détails.',
    ),
  ]),
  fields: [
    {
      name: 'first-name',
      blockName: 'first-name',
      blockType: 'text',
      label: 'Prénom',
      required: true,
      width: 50,
    },
    {
      name: 'last-name',
      blockName: 'last-name',
      blockType: 'text',
      label: 'Nom',
      required: true,
      width: 50,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
    {
      name: 'phone',
      blockName: 'phone',
      blockType: 'number',
      label: 'Téléphone',
      width: 100,
    },
    {
      name: 'comments',
      blockName: 'comments',
      blockType: 'textarea',
      label: 'Commentaires',
      width: 100,
    },
  ],
})

const inscriptionLayout = (formId: number, tenantName: string) => [
  contentBlock(
    'Inscription',
    `Prêt à participer aux épreuves ${tenantName} ? Remplissez le formulaire ci-dessous pour recevoir toutes les modalités d'inscription.`,
  ),
  {
    blockType: 'formBlock',
    blockName: 'Formulaire d’inscription',
    form: formId,
    enableIntro: false,
  },
]

export const createTenantPages: AfterChangeHook<Tenant> = async ({ doc, operation, req }) => {
  if (operation !== 'create' || !doc || !req) {
    return doc
  }

  const tenantId = doc.id
  const tenantName = doc.name ?? 'votre organisation'

  const form = await req.payload.create({
    collection: 'forms',
    data: registrationFormPayload(tenantName),
    req,
  })

  const basePagePayloads = pageTemplates(tenantName).map((template) =>
    createBasePage(tenantId, template),
  )

  const createdPages: Page[] = []

  for (const payload of basePagePayloads) {
    const createdPage = await req.payload.create<Page>({
      collection: 'pages',
      data: payload,
      req,
    })
    createdPages.push(createdPage)
  }

  const inscriptionPage = {
    title: 'Inscription',
    slug: 'inscription',
    _status: 'published',
    tenant: tenantId,
    hero: {
      type: 'none',
    },
    layout: inscriptionLayout(form.id, tenantName),
  }

  await req.payload.create({
    collection: 'pages',
    data: inscriptionPage,
    req,
  })

  const navItems = createdPages.map((page) => ({
    link: {
      type: 'reference',
      reference: {
        relationTo: 'pages',
        value: page,
      },
      label: page.title ?? page.slug,
    },
  }))

  if (navItems.length > 0) {
    await req.payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        navItems,
      },
      req,
    })
  }

  return doc
}
