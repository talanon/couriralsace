import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const ImageText: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  imageURL: '/admin/blocks/section_image-texte.png',
  imageAltText: 'Apercu du layout image texte',
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
      name: 'useEventImage',
      type: 'checkbox',
      defaultValue: false,
      label: "Utiliser l'image de l'évènement",
      admin: {
        condition: (data) => data?.template === 'event',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: { useEventImage?: boolean } },
      ) => {
        if (siblingData?.useEventImage) return true
        return value ? true : "L'image est requise si le switch n'est pas activé."
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.useEventImage !== true,
      },
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
      type: 'richText',
      editor: defaultLexical,
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
  ],
}
