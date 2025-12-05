'use client';

import { Section, SectionHeader, Container, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { WeddingTheme, WeddingRule, ColorSwatch } from '@/types';

// Default placeholder data
const defaultTheme: WeddingTheme = {
  name: 'Rustic Elegance',
  description: 'A blend of natural warmth and timeless sophistication, featuring earthy tones and romantic florals.',
  colors: [
    { name: 'Champagne', hex: '#f7e7ce', description: 'Primary' },
    { name: 'Dusty Rose', hex: '#d4a5a5', description: 'Accent' },
    { name: 'Sage Green', hex: '#9dc183', description: 'Secondary' },
    { name: 'Warm Taupe', hex: '#a89984', description: 'Neutral' },
    { name: 'Ivory', hex: '#fffff0', description: 'Background' },
    { name: 'Charcoal', hex: '#36454f', description: 'Text' },
  ],
};

const defaultRules: WeddingRule[] = [
  {
    icon: 'dress',
    title: 'Dress Code',
    description: 'Semi-formal to formal attire. Ladies in cocktail dresses or gowns, gentlemen in suits or barong. Please avoid wearing white, ivory, or cream.',
  },
  {
    icon: 'phone',
    title: 'Unplugged Ceremony',
    description: 'We kindly request that you keep phones and cameras away during the ceremony. Our photographer will capture every moment for us to share with you later.',
  },
  {
    icon: 'children',
    title: 'Adults Only',
    description: 'While we love your little ones, this is an adults-only celebration. We hope you understand and can enjoy a night off!',
  },
  {
    icon: 'parking',
    title: 'Parking',
    description: 'Complimentary valet parking will be available at the venue. Please have your vehicle ready by the designated time.',
  },
  {
    icon: 'gift',
    title: 'Gifts',
    description: 'Your presence is the greatest gift. However, if you wish to honor us with a gift, a monetary contribution towards our future would be deeply appreciated.',
  },
  {
    icon: 'hashtag',
    title: 'Share the Love',
    description: 'After the ceremony, share your photos using our wedding hashtag: #CoupleNameWedding2025',
  },
];

interface WeddingThemeSectionProps {
  theme?: WeddingTheme;
  rules?: WeddingRule[];
  title?: string;
  subtitle?: string;
}

function ColorSwatchDisplay({ color }: { color: ColorSwatch }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-sm border border-wedding-secondary-200"
        style={{ backgroundColor: color.hex }}
        title={color.hex}
      />
      <p className="mt-2 text-sm font-medium text-wedding-charcoal">{color.name}</p>
      {color.description && (
        <p className="text-xs text-wedding-secondary-500">{color.description}</p>
      )}
    </div>
  );
}

function RuleIcon({ icon }: { icon?: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    dress: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    ),
    phone: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
    children: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
    parking: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5h14M5 5v14h14V5M5 5L3 3m16 2l2-2M5 19l-2 2m16-2l2 2M9 9h2a2 2 0 012 2v0a2 2 0 01-2 2H9V9z" />
    ),
    gift: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    ),
    hashtag: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    ),
  };

  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {iconMap[icon || 'gift'] || iconMap.gift}
    </svg>
  );
}

function RuleCard({ rule }: { rule: WeddingRule }) {
  return (
    <Card className="h-full">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-wedding-primary-100 flex items-center justify-center text-wedding-primary-600">
            <RuleIcon icon={rule.icon} />
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-wedding-charcoal mb-2">
              {rule.title}
            </h4>
            <p className="text-body-sm">
              {rule.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeddingThemeSection({
  theme = defaultTheme,
  rules = defaultRules,
  title = 'Wedding Details',
  subtitle = 'Everything you need to know before the big day',
}: WeddingThemeSectionProps) {
  return (
    <Section sectionId="details" variant="muted">
      <Container>
        <SectionHeader title={title} subtitle={subtitle} />

        {/* Theme & Color Palette */}
        <div className="mb-12 md:mb-16">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h3 className="font-script text-3xl sm:text-4xl text-wedding-primary-600 mb-2">
                  {theme.name}
                </h3>
                <p className="text-body-sm max-w-2xl mx-auto">
                  {theme.description}
                </p>
              </div>

              {/* Color swatches */}
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {theme.colors.map((color) => (
                  <ColorSwatchDisplay key={color.hex} color={color} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules & Guidelines */}
        <div>
          <h3 className="heading-subsection text-center mb-6">
            Guest Guidelines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {rules.map((rule, index) => (
              <RuleCard key={index} rule={rule} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
