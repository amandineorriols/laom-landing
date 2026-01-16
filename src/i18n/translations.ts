export const translations = {
  fr: {
    site: {
      name: 'LAOM',
      tagline: 'Un coliving rural dans le sud de l\'Aveyron',
      description: 'Des maisons de montagne avec "bureaux" et jardins où vous pouvez séjourner et travailler sur votre projet. Profitez de la compagnie de personnes curieuses, de plats maison et d\'une ambiance bienveillante.',
    },
    nav: {
      home: 'Accueil',
      experience: 'Expérience',
      events: 'Événements',
      contact: 'Contact',
    },
    hero: {
      title: 'LAOM',
      subtitle: 'Un coliving rural dans le sud de l\'Aveyron',
      description: 'Des maisons de montagne avec "bureaux" et jardins où vous pouvez séjourner et travailler sur votre projet. Profitez de la compagnie de personnes curieuses, de plats maison et d\'une ambiance bienveillante.',
      cta: {
        explore: 'Découvrir',
        contact: 'Contact',
      },
    },
    about: {
      title: 'Bienvenue à LAOM',
      subtitle: 'Un écolieu niché dans une vallée sauvage du sud de l\'Aveyron',
      description: 'Depuis 4 ans, nous avons accueilli des centaines d\'âmes curieuses, artistes, entrepreneurs, bâtisseurs et rêveurs venus de tous horizons 🌍',
      features: {
        space: '21 hectares de forêt, rivière et prairie',
        rooms: 'Des chambres douillettes',
        kitchen: 'Une cuisine partagée avec des recettes maison (et open source)',
        workspace: 'Des espaces de travail créatifs (lire : bureaux en bois, canapés ensoleillés, tipis et recoins fleuris remplis d\'idées)',
      },
      community: 'À LAOM, tu peux rencontrer des personnes inspirantes venues créer, se ressourcer ou organiser un événement. On y croise des danseurs, des permaculteurs, des hackers écolos, des thérapeutes, des makers, des coachs... et parfois un feu sacré au milieu de la nuit',
      location: 'C\'est aussi un point de départ idéal pour randonner, courir ou pédaler à travers le Parc Naturel. Tu peux suivre les sentiers, traverser les rivières, grimper aux arbres ou simplement t\'allonger dans l\'herbe.',
    },
    events: {
      title: 'Nos prochains événements',
      comingSoon: 'Bientôt disponible',
    },
    contact: {
      title: 'Contact',
      development: 'Responsable développement',
      name: 'Aubert Charly',
      email: 'orion.aubert@gmail.com',
      phone: '06.73.68.35.73',
    },
    footer: {
      description: 'Un écolieu niché dans une vallée sauvage du sud de l\'Aveyron, où nature, création et vie collective s\'entrelacent.',
      explore: 'Explorer',
      connect: 'Se connecter',
      copyright: '© {year} Laom. Tous droits réservés.',
    },
  },
  en: {
    site: {
      name: 'LAOM',
      tagline: 'A rural coliving in the south of Aveyron',
      description: 'Mountain houses with "offices" and gardens where you can stay and work on your project. Enjoy the company of curious people, homemade food, and supportive ambiance.',
    },
    nav: {
      home: 'Home',
      experience: 'Experience',
      events: 'Events',
      contact: 'Contact',
    },
    hero: {
      title: 'LAOM',
      subtitle: 'A rural coliving in the south of Aveyron',
      description: 'Mountain houses with "offices" and gardens where you can stay and work on your project. Enjoy the company of curious people, homemade food, and supportive ambiance.',
      cta: {
        explore: 'Explore',
        contact: 'Contact',
      },
    },
    about: {
      title: 'Welcome to LAOM',
      subtitle: 'An ecolieu nestled in a wild valley in the south of Aveyron',
      description: 'For 4 years, we have welcomed hundreds of curious souls, artists, entrepreneurs, builders and dreamers from all over the world 🌍',
      features: {
        space: '21 hectares of forest, river and meadow',
        rooms: 'Cozy rooms',
        kitchen: 'A shared kitchen with homemade recipes (and open source)',
        workspace: 'Creative workspaces (read: wooden desks, sunny sofas, tipis and flower-filled nooks full of ideas)',
      },
      community: 'At LAOM, you can meet inspiring people who come to create, recharge or organize an event. We meet dancers, permaculturists, eco hackers, therapists, makers, coaches... and sometimes a sacred fire in the middle of the night',
      location: 'It\'s also an ideal starting point for hiking, running or cycling through the Natural Park. You can follow the trails, cross the rivers, climb trees or simply lie in the grass.',
    },
    events: {
      title: 'Our upcoming events',
      comingSoon: 'Coming soon',
    },
    contact: {
      title: 'Contact',
      development: 'Development Manager',
      name: 'Aubert Charly',
      email: 'orion.aubert@gmail.com',
      phone: '06.73.68.35.73',
    },
    footer: {
      description: 'An ecolieu nestled in a wild valley in the south of Aveyron, where nature, creation and collective life intertwine.',
      explore: 'Explore',
      connect: 'Connect',
      copyright: '© {year} Laom. All rights reserved.',
    },
  },
} as const

export type Locale = keyof typeof translations
export type TranslationKey = keyof typeof translations.fr
