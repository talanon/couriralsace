import type { GlobalConfig } from 'payload'

import { superAdminOnly } from '@/access'
import { defaultLexical } from '@/fields/defaultLexical'
import { EVENT_TEMPLATE_VARIABLES } from '@/utilities/interpolateEventTemplate'

export const EventTemplate: GlobalConfig = {
  slug: 'eventTemplate',
  label: 'Template page événement',
  access: {
    read: superAdminOnly,
    update: superAdminOnly,
  },
  fields: [
    {
      name: 'templatePage',
      type: 'relationship',
      relationTo: 'pages',
      required: false,
      label: 'Page template',
      admin: {
        description: "Sélectionnez la page Payload à utiliser comme template (ex: ta page id 91).",
      },
    },
    {
      name: 'help',
      type: 'textarea',
      label: 'Variables disponibles',
      admin: {
        readOnly: true,
      },
      defaultValue: EVENT_TEMPLATE_VARIABLES.join('\n'),
    },
    {
      name: 'content',
      type: 'richText',
      editor: defaultLexical,
      required: false,
      label: 'Contenu',
      admin: {
        description: 'Utilisez les variables ci-dessus dans le texte, ex: Inscription: {{event.registrationLink}}',
      },
    },
  ],
}
