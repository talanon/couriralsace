import type { Block } from 'payload'

export const ImageText: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: {
    singular: 'Image + Texte',
    plural: 'Images + Textes',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'imageLeft',
      options: [
        { label: 'Image a gauche', value: 'imageLeft' },
        { label: 'Image a droite', value: 'imageRight' },
      ],
      label: 'Disposition',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
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
      name: 'ctas',
      type: 'array',
      label: 'Boutons',
      maxRows: 3,
      fields: [
        { name: 'text', type: 'text', required: true, label: 'Texte' },
        { name: 'link', type: 'text', label: 'Lien' },
        { name: 'icon', type: 'text', label: 'Icone' },
      ],
    },
    {
      name: 'showDecorativeCurves',
      type: 'checkbox',
      defaultValue: true,
      label: 'Afficher les courbes decoratives',
    },
  ],
}
