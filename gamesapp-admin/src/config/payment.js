// Payment configuration with Tunisian Dinar
export const PAYMENT_CONFIG = {
  currency: 'TND',
  currencySymbol: 'DT',
  exchangeRate: 1, // 1 TND = 1 TND
  
  // Premium prices in TND
  prices: {
    story: {
      premium: 4.99,
      label: '4.99 DT'
    },
    video: {
      premium: 5.99,
      label: '5.99 DT'
    },
    quiz: {
      premium: 3.99,
      label: '3.99 DT'
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
  'story': '4.99 DT',
  'video': '5.99 DT',
  'quiz': '3.99 DT'
};
