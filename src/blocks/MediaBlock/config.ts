import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
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
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: { useEventImage?: boolean } },
      ) => {
        if (siblingData?.useEventImage) return true
        return value ? true : 'Le media est requis si le switch n est pas activé.'
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.useEventImage !== true,
      },
    },
  ],
}
