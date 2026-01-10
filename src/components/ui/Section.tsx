'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Background color variant */
  variant?: 'default' | 'primary' | 'cream' | 'white' | 'muted';
  /** Whether to add standard section padding */
  padded?: boolean;
  /** Custom section ID for navigation */
  sectionId?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', padded = true, sectionId, children, ...props }, ref) => {
    const variants = {
      default: 'bg-wedding-seashell',
      primary: 'bg-wedding-primary-800',
      cream: 'bg-wedding-seashell',
      white: 'bg-white',
      muted: 'bg-wedding-rockblue/10',
    };

    return (
      <section
        ref={ref}
        id={sectionId}
        className={cn(
          variants[variant],
          padded && 'py-section-mobile md:py-section',
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, centered = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-8 md:mb-12',
          centered && 'text-center',
          className
        )}
        {...props}
      >
        <h2 className="heading-section text-balance">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-body-sm max-w-2xl mx-auto">{subtitle}</p>
        )}
        <div className="divider-ornament mt-4">
          <span className="text-wedding-tan">✦</span>
        </div>
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full mx-auto px-4 sm:px-6 lg:px-8',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export { Section, SectionHeader, Container };
