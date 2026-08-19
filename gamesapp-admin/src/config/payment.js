// Payment configuration with Tunisian Dinar (TND)
export const PAYMENT_CONFIG = {
  currency: 'TND',
  currencySymbol: 'DT',
  
  // Premium prices in TND
  prices: {
    story: {
      premium: 1,
      label: '1 DT'
    },
    video: {
      premium: 1,
      label: '1 DT'
    },
    quiz: {
      premium: 1,
      label: '1 DT'
    }
  },
  
  // Monthly subscription
  subscription: {
    monthly: {
      price: 10,
      label: '10 DT / mois',
      description: 'Accès illimité à tout le contenu premium'
    }
  },
  
  // Payment methods available in Tunisia
  methods: ['card', 'edinar', 'flouci', 'd17'],
  
  // Bank details (for manual payment)
  bankDetails: {
    bank: 'Banque de Tunisie',
    account: '123456789',
    rib: '01 001 123456789 00',
    swift: 'BTUNTT'
  }
};

// Premium content types
export const PREMIUM_TYPES = {
  STORY: 'story',
  VIDEO: 'video',
  QUIZ: 'quiz'
};

// Price labels for display
export const PRICE_LABELS = {
  'story': '1 DT',
  'video': '1 DT',
  'quiz': '1 DT',
  'subscription': '10 DT / mois'
};
