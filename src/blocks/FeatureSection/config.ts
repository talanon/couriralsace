import type { Block } from 'payload'

export const FeatureSection: Block = {
  slug: 'featureSection',
  interfaceName: 'FeatureSectionBlock',
  labels: {
    singular: 'Section Feature',
    plural: 'Sections Feature',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Sous-titre',
    },
    {
      name: 'highlightedText',
      type: 'text',
      label: 'Texte surligne',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Texte du bouton',
      defaultValue: 'Proposer une sortie',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Lien du bouton',
      defaultValue: '/proposer',
    },
  ],
}
