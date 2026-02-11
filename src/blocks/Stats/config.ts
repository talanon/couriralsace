import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Statistiques',
    plural: 'Statistiques',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          label: 'Nombre',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Libelle',
        },
      ],
    },
  ],
}
