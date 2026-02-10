import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  template: 'hero',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Courir Alsace',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  layout: [
    {
      blockType: 'homeHero',
      headline: 'Toutes les sorties trail & course à pied',
      highlightText: 'officielles... ou pas !',
      buttonLabel: 'Rester informé(e) !',
      inputPlaceholder: 'Votre adresse mail...',
      tagline: 'Le fil des sorties, officielles ou improvisées.',
      backgroundUrl:
        'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1600&q=80',
    },
  ],
  meta: {
    description: 'Toutes les sorties trail & course à pied en Alsace.',
    title: 'Sortie Longue en Alsace',
  },
  title: 'Page d’accueil',
}
