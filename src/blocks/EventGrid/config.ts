import type { Block } from 'payload'

export const EventGrid: Block = {
  slug: 'eventGrid',
  interfaceName: 'EventGridBlock',
  imageURL: '/admin/blocks/section_grille_evenements.png',
  imageAltText: 'Apercu du layout grille evenements',
  labels: {
    singular: 'Grille d evenements',
    plural: 'Grilles d evenements',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'LES PROCHAINES SORTIES',
      label: 'Titre',
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Toutes les courses',
      label: 'Texte bouton',
    },
    {
      name: 'ctaLink',
      type: 'text',
      defaultValue: '/courses',
      label: 'Lien bouton',
    },
    {
      name: 'eventSourceMode',
      type: 'radio',
      label: 'Source des courses',
      defaultValue: 'manualSelection',
      options: [
        {
          label: "Utiliser les courses de l'évènement",
          value: 'currentEventCourses',
        },
        {
          label: 'Utiliser les courses hors évènement',
          value: 'otherEventsCourses',
        },
        {
          label: 'Sélection manuelle',
          value: 'manualSelection',
        },
      ],
      admin: {
        condition: (data) => data?.template === 'event',
        layout: 'vertical',
      },
    },
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      label: 'Evenements (optionnel)',
      admin: {
        condition: (_data, siblingData) => siblingData?.eventSourceMode === 'manualSelection',
      },
    },
    {
      name: 'manualEvents',
      type: 'array',
      label: 'Cartes manuelles',
      admin: {
        description: 'Utilise cette liste si la relation events n est pas disponible pour le front.',
        condition: (_data, siblingData) => siblingData?.eventSourceMode === 'manualSelection',
      },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Titre' },
        { name: 'dateLabel', type: 'text', required: true, label: 'Date (texte)' },
        { name: 'distanceLabel', type: 'text', label: 'Distance (ex: 24 km)' },
        { name: 'elevationLabel', type: 'text', label: 'Denivele (ex: 750 D+)' },
        { name: 'locationLabel', type: 'text', label: 'Lieu' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Image' },
      ],
    },
  ],
}
