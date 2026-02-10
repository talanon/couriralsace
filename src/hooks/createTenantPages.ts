import type { CollectionAfterChangeHook, RequiredDataFromCollectionSlug } from 'payload'

import type { ContentBlock, FormBlock, Page, Tenant } from '@/payload-types'

type PageTemplate = {
  slug: string
  title: string
  body: string
}

type RichTextNode = {
  type: string
  version: number
  children?: RichTextNode[]
  direction?: 'ltr' | 'rtl'
  format?: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
  indent?: number
  text?: string
  detail?: number
  mode?: string
  style?: string
  tag?: string
  [key: string]: unknown
}

const createTextNode = (text: string): RichTextNode => ({
  type: 'text',
  detail: 0,
  format: '' as const,
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
    type: 'root' as const,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const contentBlock = (heading: string, body: string): ContentBlock => ({
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

const createContactFormBlock = (formId: number, tenantName: string): FormBlock => ({
  blockType: 'formBlock',
  blockName: 'Formulaire de contact',
  form: formId,
  enableIntro: true,
  introContent: createRichText([
    createHeadingNode('Contact'),
    createParagraphNode(`Contactez l'équipe ${tenantName} via le formulaire ci-dessous.`),
  ]),
})

const createBasePage = (
  tenantId: number,
  template: PageTemplate,
  tenantName: string,
  contactFormId?: number,
): RequiredDataFromCollectionSlug<'pages'> => {
  const layout: (ContentBlock | FormBlock)[] = [contentBlock(template.title, template.body)]

  if (template.slug === 'contact' && contactFormId) {
    layout.push(createContactFormBlock(contactFormId, tenantName))
  }

  return {
    title: template.title,
    slug: template.slug,
    _status: 'published',
    template: 'default',
    tenant: tenantId,
    hero: {
      type: 'none',
    },
    layout,
  }
}

const registrationFormPayload = (
  tenantName: string,
  tenantId: number,
): RequiredDataFromCollectionSlug<'forms'> => ({
  title: `Inscription - ${tenantName}`,
  submitButtonLabel: 'S’inscrire',
  confirmationType: 'message',
  tenant: tenantId,
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

const contactFormPayload = (
  tenantName: string,
  tenantId: number,
): RequiredDataFromCollectionSlug<'forms'> => ({
  title: `Contact - ${tenantName}`,
  submitButtonLabel: 'Envoyer',
  confirmationType: 'message',
  tenant: tenantId,
  confirmationMessage: createRichText([
    createParagraphNode('Merci pour votre message. Nous reviendrons vers vous très rapidement.'),
  ]),
  fields: [
    {
      name: 'full-name',
      blockName: 'full-name',
      blockType: 'text',
      label: 'Nom complet',
      required: true,
      width: 100,
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
      name: 'message',
      blockName: 'message',
      blockType: 'textarea',
      label: 'Message',
      required: true,
      width: 100,
    },
  ],
})

const inscriptionLayout = (formId: number, tenantName: string): (ContentBlock | FormBlock)[] => [
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

export const createTenantPages: CollectionAfterChangeHook<Tenant> = async ({ doc, operation, req }) => {
  if (operation !== 'create' || !doc || !req) {
    return doc
  }

  const tenantId = doc.id
  const tenantName = doc.name ?? 'votre organisation'

  const registrationForm = await req.payload.create({
    collection: 'forms',
    data: registrationFormPayload(tenantName, tenantId),
    req,
  })

  const contactForm = await req.payload.create({
    collection: 'forms',
    data: contactFormPayload(tenantName, tenantId),
    req,
  })

  const basePagePayloads: RequiredDataFromCollectionSlug<'pages'>[] = pageTemplates(
    tenantName,
  ).map((template) => createBasePage(tenantId, template, tenantName, contactForm.id))

  const createdPages: Page[] = []

  for (const payload of basePagePayloads) {
    const createdPage = await req.payload.create({
      collection: 'pages',
      data: payload,
      req,
    })
    createdPages.push(createdPage)
  }

  const inscriptionPage: RequiredDataFromCollectionSlug<'pages'> = {
    title: 'Inscription',
    slug: 'inscription',
    _status: 'published',
    template: 'default',
    tenant: tenantId,
    hero: {
      type: 'none',
    },
    layout: inscriptionLayout(registrationForm.id, tenantName),
  }

  await req.payload.create({
    collection: 'pages',
    data: inscriptionPage,
    req,
  })

  const navItems: NonNullable<Tenant['navItems']> = createdPages.map((page) => ({
    link: {
      type: 'reference' as const,
      reference: {
        relationTo: 'pages' as const,
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
