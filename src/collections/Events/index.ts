import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { assignTenantFromUser } from '../../hooks/assignTenant'
import { superAdminOnly } from '../../access'

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
    defaultColumns: ['title', 'tenant', 'date'],
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
      required: true,
      label: 'Organisateur',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lieu',
    },
    {
      name: 'distance',
      type: 'number',
      admin: {
        description: 'Distance totale en km',
      },
      label: 'Distance (km)',
    },
    {
      name: 'elevationGain',
      type: 'number',
      admin: {
        description: 'D+ en mètres',
      },
      label: 'Dénivelé positif (D+)',
    },
    {
      name: 'gpx',
      type: 'upload',
      relationTo: 'media',
      label: 'Fichier GPX',
    },
    {
      name: 'description',
      type: 'textarea',
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
