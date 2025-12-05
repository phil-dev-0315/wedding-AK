'use client';

import { useState } from 'react';
import { Section, SectionHeader, Container, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { WeddingEvent } from '@/types';

// Default placeholder events
const defaultEvents: WeddingEvent[] = [
  {
    id: '1',
    title: 'Wedding Ceremony',
    date: '2025-06-15',
    time: '3:00 PM',
    venue: 'St. Mary\'s Chapel',
    address: '123 Church Street, City, State 12345',
    dressCode: 'Formal Attire',
    description: 'Join us as we exchange our vows in an intimate ceremony.',
  },
  {
    id: '2',
    title: 'Cocktail Hour',
    date: '2025-06-15',
    time: '4:30 PM',
    venue: 'Garden Terrace',
    address: 'Same venue',
    dressCode: 'Formal Attire',
    description: 'Light refreshments and drinks while we take photos.',
  },
  {
    id: '3',
    title: 'Reception & Dinner',
    date: '2025-06-15',
    time: '6:00 PM',
    venue: 'Grand Ballroom',
    address: '456 Celebration Ave, City, State 12345',
    dressCode: 'Formal Attire',
    description: 'Dinner, dancing, and celebration with family and friends.',
  },
];

interface ScheduleProps {
  events?: WeddingEvent[];
  title?: string;
  subtitle?: string;
}

interface EventCardProps {
  event: WeddingEvent;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function EventCard({ event, index, isExpanded, onToggle }: EventCardProps) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={cn(
        'relative',
        'md:grid md:grid-cols-2 md:gap-8',
        'mb-8 last:mb-0'
      )}
    >
      {/* Timeline connector - visible on desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-wedding-primary-200 -translate-x-1/2" />

      {/* Timeline dot */}
      <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-wedding-primary-400 border-4 border-wedding-cream -translate-x-1/2 z-10" />

      {/* Card positioning */}
      <div className={cn('md:col-span-1', isLeft ? 'md:col-start-1' : 'md:col-start-2')}>
        <Card
          className={cn(
            'cursor-pointer',
            'hover:shadow-md hover:border-wedding-primary-200',
            'transition-all duration-300'
          )}
          onClick={onToggle}
        >
          <CardContent className="p-4 sm:p-6">
            {/* Event header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 mb-2 text-xs font-body uppercase tracking-wider bg-wedding-primary-100 text-wedding-primary-700 rounded-full">
                  {event.time}
                </span>
                <h3 className="heading-subsection">{event.title}</h3>
              </div>

              {/* Expand/collapse indicator */}
              <button
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full',
                  'flex items-center justify-center',
                  'bg-wedding-primary-50 text-wedding-primary-600',
                  'transition-all duration-300',
                  isExpanded && 'rotate-180'
                )}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Venue info (always visible) */}
            <div className="mt-3 flex items-start gap-2 text-body-sm">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-wedding-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.venue}</span>
            </div>

            {/* Expandable content */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
              )}
            >
              {event.address && (
                <p className="text-body-sm text-wedding-secondary-500 mb-3">
                  {event.address}
                </p>
              )}

              {event.description && (
                <p className="text-body-sm mb-3">
                  {event.description}
                </p>
              )}

              {event.dressCode && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-wedding-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium text-wedding-secondary-700">
                    Dress Code: {event.dressCode}
                  </span>
                </div>
              )}

              {event.mapUrl && (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-wedding-primary-600 hover:text-wedding-primary-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Map
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Schedule({
  events = defaultEvents,
  title = 'Wedding Day Schedule',
  subtitle = 'Here\'s what to expect on our special day',
}: ScheduleProps) {
  const [expandedId, setExpandedId] = useState<string | null>(events[0]?.id || null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Section sectionId="schedule" variant="white">
      <Container size="md">
        <SectionHeader title={title} subtitle={subtitle} />

        {/* Mobile: Simple list / Desktop: Timeline */}
        <div className="relative mt-8 md:mt-12">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isExpanded={expandedId === event.id}
              onToggle={() => handleToggle(event.id)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
