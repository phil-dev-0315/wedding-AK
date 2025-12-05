'use client';

import { useState, useEffect } from 'react';
import { cn, scrollToElement } from '@/lib/utils';
import { weddingConfig } from '@/lib/config';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const sectionId = href.replace('#', '');
    scrollToElement(sectionId, 80);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3'
          : 'bg-transparent py-4'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Couple Names */}
          <button
            onClick={() => handleNavClick('#hero')}
            className={cn(
              'font-display text-lg font-semibold',
              'transition-colors duration-300',
              isScrolled ? 'text-wedding-charcoal' : 'text-wedding-charcoal'
            )}
          >
            {weddingConfig.couple.names.split('&')[0].trim()} & {weddingConfig.couple.names.split('&')[1]?.trim() || 'Partner'}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {weddingConfig.navigation.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'text-sm font-body font-medium',
                  'transition-colors duration-300',
                  'hover:text-wedding-primary-600',
                  isScrolled ? 'text-wedding-secondary-700' : 'text-wedding-secondary-700'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden p-2 -mr-2',
              'transition-colors duration-300',
              isScrolled ? 'text-wedding-charcoal' : 'text-wedding-charcoal'
            )}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            {weddingConfig.navigation.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'block w-full text-left px-4 py-2',
                  'text-wedding-secondary-700 font-body',
                  'hover:bg-wedding-primary-50 hover:text-wedding-primary-600',
                  'transition-colors duration-300'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
