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
    hashtag: '#CoupleNameWedding2025',
  },

  // Wedding Date & Time
  wedding: {
    date: process.env.NEXT_PUBLIC_WEDDING_DATE || '2025-06-15T15:00:00',
    tagline: 'We\'re getting married!',
  },

  // Hero Section
  hero: {
    backgroundImage: '', // Add path to background image, e.g., '/images/hero-bg.jpg'
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
    message: 'Thank you for being part of our story. We can\'t wait to celebrate with you!',
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
