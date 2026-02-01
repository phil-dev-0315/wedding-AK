'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { cn, formatDate, scrollToElement } from '@/lib/utils';

interface HeroProps {
  coupleNames?: string;
  weddingDate?: string;
  tagline?: string;
  backgroundImage?: string;
}

export function Hero({
  coupleNames = 'Kings Lee & Abigail',
  weddingDate = '2026-03-07T15:00:00',
  tagline = 'We\'re getting married!',
  backgroundImage,
}: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const formattedDate = formatDate(weddingDate, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleRSVPClick = () => {
    scrollToElement('rsvp', 80);
  };

  const handleScheduleClick = () => {
    scrollToElement('schedule', 80);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <>
            {/* Background image placeholder */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            {/* Overlay - elegant dark blue gradient */}
            <div className="absolute inset-0 gradient-overlay" />
          </>
        ) : (
          /* Default elegant seashell to rock blue gradient background */
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-seashell via-wedding-rockblue/10 to-wedding-tan/20" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Tagline */}
        <p
          className={cn(
            'font-script text-2xl sm:text-3xl md:text-4xl mb-4',
            backgroundImage
              ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
              : 'text-wedding-primary-500',
            'transition-all duration-700 ease-out',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {tagline}
        </p>

        {/* Couple Names */}
        <h1
          className={cn(
            'font-display font-semibold',
            'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
            'leading-tight tracking-tight',
            backgroundImage ? 'text-white' : 'text-wedding-charcoal',
            'transition-all duration-700 ease-out delay-100',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {coupleNames}
        </h1>

        {/* Decorative divider */}
        <div
          className={cn(
            'flex items-center justify-center gap-4 my-6 md:my-8',
            'transition-all duration-700 ease-out delay-200',
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <span
            className={cn(
              'h-px w-12 md:w-20',
              backgroundImage ? 'bg-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'bg-wedding-tan'
            )}
          />
          <span
            className={cn(
              'text-lg',
              backgroundImage ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'text-wedding-tan'
            )}
          >
            ♥
          </span>
          <span
            className={cn(
              'h-px w-12 md:w-20',
              backgroundImage ? 'bg-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'bg-wedding-tan'
            )}
          />
        </div>

        {/* Wedding Date */}
        <p
          className={cn(
            'font-display text-xl sm:text-2xl md:text-3xl',
            backgroundImage ? 'text-wedding-seashell' : 'text-wedding-secondary-600',
            'transition-all duration-700 ease-out delay-300',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {formattedDate}
        </p>

        {/* CTA Buttons */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 md:mt-10',
            'transition-all duration-700 ease-out delay-500',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <Button
            onClick={handleRSVPClick}
            variant={backgroundImage ? 'primary' : 'primary'}
            size="lg"
            className="w-full sm:w-auto min-w-[160px]"
          >
            RSVP Now
          </Button>
          <Button
            onClick={handleScheduleClick}
            variant={backgroundImage ? 'outline' : 'outline'}
            size="lg"
            className={cn(
              'w-full sm:w-auto min-w-[160px]',
              backgroundImage && 'border-wedding-seashell text-wedding-seashell hover:bg-wedding-seashell/10'
            )}
          >
            View Schedule
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={cn(
          'absolute bottom-8 left-1/2 -translate-x-1/2',
          'transition-all duration-700 ease-out delay-700',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      >
        <button
          onClick={() => scrollToElement('countdown', 0)}
          className={cn(
            'flex flex-col items-center gap-2 p-2',
            backgroundImage ? 'text-wedding-seashell/70 hover:text-wedding-seashell' : 'text-wedding-secondary-500 hover:text-wedding-primary-500',
            'transition-colors duration-300'
          )}
          aria-label="Scroll to countdown"
        >
          <span className="text-xs font-body uppercase tracking-wider">Scroll</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
