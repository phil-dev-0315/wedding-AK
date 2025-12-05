# Wedding Website Boilerplate

A modern, elegant wedding website built with Next.js 14, TypeScript, and Tailwind CSS. Optimized for Vercel deployment with a focus on mobile-first responsive design.

## Features

- **Hero Section** - Full-screen with couple's names, date, and background image/video placeholder
- **Countdown Timer** - Live countdown to the wedding date
- **Event Schedule** - Timeline/card-based layout for ceremony, reception, and events
- **Photo Gallery** - Responsive grid with lightbox for engagement/pre-wedding photos
- **Entourage** - Wedding party section with photos and roles
- **Wedding Theme** - Display theme colors and guest guidelines
- **RSVP Form** - Full VIP guest lookup and additional guest management
- **Footer** - Thank you message with social links

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Database**: Supabase/PlanetScale/Neon (recommended)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wedding-website
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.local.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_WEDDING_DATE=2025-06-15T15:00:00
NEXT_PUBLIC_COUPLE_NAMES=Partner One & Partner Two

# Database (Supabase example)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
wedding-website/
├── database/
│   └── schema.sql          # Database schema for guests table
├── public/
│   └── images/
│       ├── gallery/        # Engagement/pre-wedding photos
│       ├── hero/           # Hero background image
│       └── entourage/      # Wedding party photos
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── guests/
│   │   │   │   └── search/route.ts
│   │   │   └── rsvp/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Countdown.tsx
│   │   │   ├── Schedule.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Entourage.tsx
│   │   │   ├── WeddingTheme.tsx
│   │   │   ├── RSVPForm.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Section.tsx
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── config.ts       # Wedding configuration
│   │   └── utils.ts        # Utility functions
│   └── types/
│       └── index.ts        # TypeScript types
├── tailwind.config.ts
├── vercel.json
└── package.json
```

## Customization

### Wedding Configuration

Edit `src/lib/config.ts` to update:
- Couple names
- Wedding date
- Social links
- Navigation items
- Footer message

### Theme Colors

Edit `tailwind.config.ts` to customize the color palette:

```ts
colors: {
  wedding: {
    primary: { /* your colors */ },
    secondary: { /* your colors */ },
    cream: '#faf9f7',
    // ... more colors
  }
}
```

### Adding Images

1. **Hero Background**: Add image to `public/images/hero/` and update `weddingConfig.hero.backgroundImage` in `src/lib/config.ts`

2. **Gallery Photos**: Add images to `public/images/gallery/` and update the `defaultImages` array in `src/components/sections/Gallery.tsx`

3. **Entourage Photos**: Add images to `public/images/entourage/` and update the member data in `src/components/sections/Entourage.tsx`

## Database Setup

### Option 1: Supabase

1. Create a new Supabase project
2. Run the SQL from `database/schema.sql` in the SQL Editor
3. Update environment variables with your Supabase credentials
4. Update API routes to use Supabase client

### Option 2: PlanetScale / Neon

1. Create a new database
2. Adapt the schema for MySQL (PlanetScale) if needed
3. Update API routes with your database client

## RSVP Data Model

```typescript
interface Guest {
  id: number;
  full_name: string;
  additionals: number;      // Number of additional guests allowed
  is_vip: boolean;          // true = primary invited guest
  is_attending: boolean | null;
  parent_id: number;        // 0 = VIP, otherwise = parent VIP's id
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Screen reader friendly

## Performance

- Mobile-first responsive design
- Optimized images with Next.js Image
- Minimal CSS animations (opacity/transform only)
- Server-side rendering where appropriate

## License

This project is private and intended for personal use.
