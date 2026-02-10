import type { Block } from 'payload'

export const HomeHero: Block = {
  slug: 'homeHero',
  interfaceName: 'HomeHeroBlock',
  labels: {
    singular: 'Home hero',
    plural: 'Home heroes',
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
      name: 'headline',
      type: 'text',
      label: 'Hero headline',
      required: true,
      defaultValue: 'Toutes les sorties trail & course à pied',
    },
    {
      name: 'highlightText',
      type: 'text',
      label: 'Highlighted companion text',
      defaultValue: 'officielles... ou pas !',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Supporting tagline',
      defaultValue: 'Le fil des sorties, officielles ou improvisées.',
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
