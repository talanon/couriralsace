import type { Block } from 'payload'

export const SectionEntete: Block = {
  slug: 'sectionEntete',
  interfaceName: 'SectionEnteteBlock',
  imageURL: '/admin/blocks/section_entete.png',
  imageAltText: 'Apercu du layout section entete',
  labels: {
    singular: 'Section Entete',
    plural: 'Sections Entete',
  },
  fields: [
    {
      name: 'leftTitle',
      type: 'text',
      required: true,
      label: 'Titre (colonne gauche)',
      defaultValue: 'LE FIL\nDES COURSES\n& SOCIAL RUN\n<green>EN ALSACE</green>',
      admin: {
        description: 'Utilisez <green>...</green> pour la partie verte et des retours a la ligne pour la mise en forme.',
      },
    },
    {
      name: 'leftDescription',
      type: 'textarea',
      label: 'Description (colonne gauche)',
      admin: {
        description: 'Optionnel. Utilisez <green>...</green> et des retours a la ligne.',
      },
    },
    {
      name: 'leftButton',
      type: 'group',
      label: 'Bouton gauche',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Titre du bouton',
          defaultValue: 'Trouver une sortie',
        },
        {
          name: 'type',
          type: 'radio',
          label: 'Type de lien',
          defaultValue: 'reference',
          options: [
            {
              label: 'Vers une page',
              value: 'reference',
            },
            {
              label: 'URL personnalisée',
              value: 'custom',
            },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Page de destination',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'reference',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL personnalisée',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'custom',
          },
        },
      ],
    },
    {
      name: 'rightImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image (colonne droite, gauche)',
    },
    {
      name: 'featuredEvent',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      label: 'Course a la une (picker)',
    },
    {
      name: 'rightTitle',
      type: 'text',
      required: true,
      label: 'Titre CTA (colonne droite, bas)',
      defaultValue: 'CREEZ VOTRE EVENEMENT',
      admin: {
        description: 'Utilisez <green>...</green> pour la partie verte et des retours a la ligne pour la mise en forme.',
      },
    },
    {
      name: 'rightDescription',
      type: 'textarea',
      label: 'Texte CTA (colonne droite, bas)',
      admin: {
        description: 'Optionnel. Utilisez <green>...</green> et des retours a la ligne.',
      },
    },
    {
      name: 'rightButton',
      type: 'group',
      label: 'Bouton CTA droite',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Titre du bouton',
          defaultValue: 'Proposer une sortie',
        },
        {
          name: 'type',
          type: 'radio',
          label: 'Type de lien',
          defaultValue: 'reference',
          options: [
            {
              label: 'Vers une page',
              value: 'reference',
            },
            {
              label: 'URL personnalisée',
              value: 'custom',
            },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Page de destination',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'reference',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL personnalisée',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'custom',
          },
        },
      ],
    },
  ],
}
