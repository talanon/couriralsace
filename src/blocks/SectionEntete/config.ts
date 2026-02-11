import type { Block } from 'payload'

export const SectionEntete: Block = {
  slug: 'sectionEntete',
  interfaceName: 'SectionEnteteBlock',
  labels: {
    singular: 'Section Entete',
    plural: 'Sections Entete',
  },
  fields: [
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Texte du bouton',
      defaultValue: 'Proposer une sortie',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'URL du bouton',
      defaultValue: '/proposer',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre (ligne 1)',
      defaultValue: 'TOUTES LES SORTIES',
    },
    {
      name: 'highlightedText',
      type: 'text',
      required: true,
      label: 'Texte surligne (vert)',
      defaultValue: 'TRAIL & COURSE A PIED',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Ligne 3',
      defaultValue: 'EN ALSACE',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image de fond',
    },
    {
      name: 'showDecorativeCurves',
      type: 'checkbox',
      defaultValue: true,
      label: 'Afficher les courbes decoratives',
    },
    {
      name: 'curveOpacity',
      type: 'text',
      label: 'Opacite des courbes',
      defaultValue: 'opacity-80',
      admin: {
        description: 'Exemples: opacity-20, opacity-40, opacity-60, opacity-80, opacity-100',
        condition: (_data, siblingData) => Boolean(siblingData?.showDecorativeCurves),
      },
    },
  ],
}
