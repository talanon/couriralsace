import type { Block } from 'payload'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: 'Timeline',
    plural: 'Timelines',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    {
      name: 'highlightedText',
      type: 'text',
      label: 'Texte surligne',
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'isActive', type: 'checkbox', label: 'Actif', defaultValue: true },
        { name: 'title', type: 'text', required: true, label: 'Titre' },
        { name: 'description', type: 'textarea', label: 'Description' },
      ],
    },
  ],
}
