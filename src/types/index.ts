// Guest/RSVP Types
export interface Guest {
  id: number;
  full_name: string;
  additionals: number;
  is_vip: boolean;
  is_attending: boolean | null;
  parent_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface RSVPFormData {
  guest_id: number;
  is_attending: boolean;
  additional_guests: string[];
}

export interface RSVPSearchResult {
  guests: Guest[];
  message?: string;
}

// Event Types
export interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  dressCode?: string;
  description?: string;
  mapUrl?: string;
  image?: string;
}

// Gallery Types
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

// Entourage Types
export interface EntourageMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  relationship?: string;
}

export interface EntourageGroup {
  id: string;
  title: string;
  members: EntourageMember[];
}

// Theme/Color Types
export interface ColorSwatch {
  name: string;
  hex: string;
  description?: string;
}

export interface WeddingTheme {
  name: string;
  description: string;
  colors: ColorSwatch[];
}

export interface WeddingRule {
  icon?: string;
  title: string;
  description: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
}
