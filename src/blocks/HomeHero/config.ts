import type { Block } from 'payload'

export const HomeHero: Block = {
  slug: 'homeHero',
  interfaceName: 'HomeHeroBlock',
  imageURL: '/admin/blocks/section_newsletter.png',
  imageAltText: 'Apercu du layout newsletter',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletters',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo principal',
      relationTo: 'media',
      maxDepth: 1,
      admin: {
        description: 'Image utilisée pour la marque (remplace les mots).',
      },
    },
    {
      name: 'headlineStyled',
      type: 'textarea',
      label: 'Headline (texte mixte)',
      required: true,
      defaultValue:
        'Toutes les sorties\n<green>trail & course à pied</green>\nen Alsace',
      admin: {
        description:
          'Utilisez <green>...</green> pour la partie verte et des retours a la ligne pour la mise en forme.',
      },
    },
    {
      name: 'tagline',
      type: 'textarea',
      label: 'Supporting tagline',
      defaultValue: 'Le fil des sorties, officielles ou improvisées.',
      admin: {
        description:
          'Utilisez <green>...</green> pour la partie verte et des retours a la ligne pour la mise en forme.',
      },
    },
    {
      name: 'backgroundUrl',
      type: 'text',
      label: 'Fallback background URL',
      admin: {
        description: 'Used when no media upload is provided.',
      },
    },
    {
      name: 'background',
      type: 'upload',
      label: 'Background image upload',
      relationTo: 'media',
      maxDepth: 1,
    },
    {
      name: 'inputPlaceholder',
      type: 'text',
      label: 'Input placeholder',
      defaultValue: 'Votre adresse mail...',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button label',
      defaultValue: 'Rester informé(e) !',
    },
    {
      name: 'logoNude',
      type: 'upload',
      label: 'Logo nue',
      relationTo: 'media',
      maxDepth: 1,
      admin: {
        description: 'Image minimaliste placée en bas du hero.',
      },
    },
  ],
}
