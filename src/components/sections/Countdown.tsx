'use client';

import { useEffect, useState } from 'react';
import { Section, Container } from '@/components/ui';
import { cn, getTimeRemaining, type TimeRemaining } from '@/lib/utils';

interface CountdownProps {
  targetDate?: string;
  title?: string;
  expiredMessage?: string;
}

interface TimeBlockProps {
  value: number;
  label: string;
  delay?: number;
}

function TimeBlock({ value, label, delay = 0 }: TimeBlockProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'flex flex-col items-center p-3 sm:p-4 md:p-6',
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div
        className={cn(
          'relative',
          'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28',
          'flex items-center justify-center',
          'bg-white rounded-lg shadow-sm',
          'border border-wedding-primary-100'
        )}
      >
        <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-wedding-charcoal">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-body uppercase tracking-wider text-wedding-secondary-600">
        {label}
      </span>
    </div>
  );
}

export function Countdown({
  targetDate = '2025-06-15T15:00:00',
  title = 'Counting Down to Our Big Day',
  expiredMessage = 'The celebration has begun!',
}: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initial calculation
    setTimeRemaining(getTimeRemaining(targetDate));

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Section sectionId="countdown" variant="muted">
        <Container size="md">
          <div className="text-center">
            <h2 className="heading-section mb-8">{title}</h2>
            <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6">
              {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
                <TimeBlock key={label} value={0} label={label} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (!timeRemaining) return null;

  return (
    <Section sectionId="countdown" variant="muted">
      <Container size="md">
        <div className="text-center">
          <h2 className="heading-section mb-2">{title}</h2>
          <div className="divider-ornament mb-8">
            <span className="text-wedding-primary-400">✦</span>
          </div>

          {timeRemaining.isExpired ? (
            <div className="py-8">
              <p className="font-script text-3xl sm:text-4xl md:text-5xl text-wedding-primary-600">
                {expiredMessage}
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6"
              role="timer"
              aria-live="polite"
              aria-atomic="true"
            >
              <TimeBlock value={timeRemaining.days} label="Days" delay={0} />
              <Separator />
              <TimeBlock value={timeRemaining.hours} label="Hours" delay={100} />
              <Separator />
              <TimeBlock value={timeRemaining.minutes} label="Minutes" delay={200} />
              <Separator />
              <TimeBlock value={timeRemaining.seconds} label="Seconds" delay={300} />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

function Separator() {
  return (
    <span className="hidden sm:block text-2xl md:text-3xl text-wedding-primary-300 font-light -mt-6">
      :
    </span>
  );
}
