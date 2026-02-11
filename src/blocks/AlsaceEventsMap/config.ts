import type { Block } from 'payload'

export const AlsaceEventsMap: Block = {
  slug: 'alsaceEventsMap',
  interfaceName: 'AlsaceEventsMapBlock',
  labels: {
    singular: 'Carte des evenements',
    plural: 'Cartes des evenements',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      defaultValue: 'Evenements en Alsace',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Sous-titre',
      defaultValue: 'Filtrez les evenements par periode',
    },
    {
      name: 'monthsAhead',
      type: 'number',
      label: 'Nombre de mois affiches',
      defaultValue: 12,
      min: 3,
      max: 24,
      required: true,
    },
    {
      name: 'maxEvents',
      type: 'number',
      label: 'Nombre maximum d\'evenements',
      defaultValue: 200,
      min: 1,
      max: 500,
      required: true,
    },
  ],
}
