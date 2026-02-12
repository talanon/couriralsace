import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { assignTenantFromUser } from '../../hooks/assignTenant'
import { superAdminOnly } from '../../access'
import { defaultLexical } from '@/fields/defaultLexical'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Événement',
    plural: 'Événements',
  },
  access: {
    create: superAdminOnly,
    delete: superAdminOnly,
    read: superAdminOnly,
    update: superAdminOnly,
  },
  admin: {
    defaultColumns: ['title', 'tenant', 'startDate', 'endDate'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    slugField(),
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      label: 'Organisateur',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Date de début',
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      label: 'Date de fin',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lieu',
      admin: {
        components: {
          Field: '/components/fields/LocationAutocompleteField',
        },
        placeholder: 'Commencez a taper une ville ou une adresse...',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
    {
      name: 'courses',
      type: 'array',
      label: 'Courses',
      labels: {
        singular: 'Course',
        plural: 'Courses',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titre',
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Date',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'trail',
          options: [
            { label: 'Trail', value: 'trail' },
            { label: 'Course', value: 'course' },
          ],
          label: 'Type',
        },
        {
          name: 'official',
          type: 'checkbox',
          defaultValue: true,
          label: 'Officielle',
        },
        {
          name: 'level',
          type: 'select',
          required: true,
          defaultValue: 'intermediate',
          options: [
            { label: 'Débutant', value: 'beginner' },
            { label: 'Intermédiaire', value: 'intermediate' },
            { label: 'Expert', value: 'expert' },
          ],
          label: 'Niveau',
        },
        {
          name: 'distance',
          type: 'number',
          label: 'Distance',
          admin: {
            placeholder: "Laisser vide si meme valeur que l'evenement",
          },
        },
        {
          name: 'elevationGain',
          type: 'number',
          label: 'Dénivelé',
          admin: {
            placeholder: "Laisser vide si meme valeur que l'evenement",
          },
        },
        {
          name: 'location',
          type: 'text',
          label: 'Lieu',
          admin: {
            components: {
              Field: '/components/fields/LocationAutocompleteField',
            },
            placeholder: "Laisser vide si meme valeur que l'evenement. Exemple: Colmar (68000)",
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          admin: {
            description: "Laisser vide si meme valeur que l'evenement",
          },
        },
        {
          name: 'gpx',
          type: 'upload',
          relationTo: 'media',
          label: 'Fichier GPX',
          admin: {
            description: "Laisser vide si meme valeur que l'evenement",
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      editor: defaultLexical,
      label: 'Description',
    },
    {
      name: 'registrationLink',
      type: 'text',
      label: 'Lien d’inscription',
    },
    {
      name: 'partners',
      type: 'array',
      label: 'Partenaires',
      fields: [
        { name: 'name', type: 'text', label: 'Nom du partenaire' },
        { name: 'url', type: 'text', label: 'URL du partenaire' },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'FAQ',
      fields: [
        { name: 'question', type: 'text', label: 'Question' },
        { name: 'answer', type: 'textarea', label: 'Réponse' },
      ],
    },
  ],
  hooks: {
    beforeChange: [assignTenantFromUser],
  },
}
