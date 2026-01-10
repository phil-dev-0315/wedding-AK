'use client';

import Image from 'next/image';
import { Section, SectionHeader, Container, Card, CardContent } from '@/components/ui';

interface GettingThereProps {
  title?: string;
  subtitle?: string;
  mapImage?: string;
  fromVenue?: string;
  toVenue?: string;
  travelTime?: string;
  distance?: string;
}

export function GettingThere({
  title = 'Getting There',
  subtitle = 'Directions from the ceremony to the reception',
  mapImage = '/images/map/route.png',
  fromVenue = 'Shrine of Saint Francis of Assisi',
  toVenue = 'Casa Alva',
  travelTime = '10 minutes',
  distance = '3.5 km',  
}: GettingThereProps) {
  return (
    <Section sectionId="getting-there" variant="cream">
      <Container size="md">
        <SectionHeader title={title} subtitle={subtitle} />

        <Card className="overflow-hidden">
          {/* Route Map Image */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] bg-wedding-rockblue/10">
            <Image
              src={mapImage}
              alt={`Route from ${fromVenue} to ${toVenue}`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
              priority
            />
          </div>

          <CardContent className="p-6 sm:p-8">
            {/* Route Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* From Venue */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wedding-rockblue/20 text-wedding-primary-500 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="font-display text-lg text-wedding-charcoal">{fromVenue}</p>
                <p className="text-xs text-wedding-secondary-600 uppercase tracking-wider">Ceremony</p>
              </div>

              {/* Arrow / Travel Info */}
              <div className="flex flex-col items-center gap-1">
                <div className="hidden sm:flex items-center gap-2 text-wedding-tan">
                  <div className="w-8 h-px bg-wedding-tan" />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="w-8 h-px bg-wedding-tan" />
                </div>
                <div className="sm:hidden text-wedding-tan my-2">
                  <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 text-xs text-wedding-secondary-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {travelTime}
                  </span>
                  <span className="text-wedding-tan">|</span>
                  <span>{distance}</span>
                </div>
              </div>

              {/* To Venue */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wedding-rockblue/20 text-wedding-primary-500 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <p className="font-display text-lg text-wedding-charcoal">{toVenue}</p>
                <p className="text-xs text-wedding-secondary-600 uppercase tracking-wider">Reception</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
