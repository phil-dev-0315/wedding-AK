/**
 * Wedding Website Configuration
 *
 * This file contains all the configurable options for the wedding website.
 * Update these values to customize the website for your event.
 */

export const weddingConfig = {
  // Couple Information
  couple: {
    names: process.env.NEXT_PUBLIC_COUPLE_NAMES || 'Partner One & Partner Two',
    hashtag: '#AbiTheOneForKings2026',
  },

  // Wedding Date & Time
  wedding: {
    date: process.env.NEXT_PUBLIC_WEDDING_DATE || '2025-06-15T15:00:00',
    tagline: 'We\'re getting married!',
  },

  // Hero Section
  hero: {
    backgroundImage: '/images/hero/hero-section.jpg', // Add path to background image, e.g., '/images/hero-bg.jpg'
  },

  // Social Links (optional)
  social: {
    instagram: '',
    facebook: '',
    twitter: '',
    website: '',
  },

  // Footer
  footer: {
    message: 'We are incredibly excited to share this momentous occasion with all of our beloved friends and family.\n\nAs we embark on this beautiful new chapter, we praise God for His loving hand that has guided us and united our hearts. Your presence on our special day would truly be the greatest gift as we celebrate the sacred bond He has created. We can\'t wait to celebrate, laugh, and make unforgettable memories with each of you!',
  },

  // Navigation
  navigation: [
    { label: 'Home', href: '#hero' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Entourage', href: '#entourage' },
    { label: 'Details', href: '#details' },
    { label: 'RSVP', href: '#rsvp' },
  ],
};

export type WeddingConfig = typeof weddingConfig;
