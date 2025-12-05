'use client';

import { Section, Container } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FooterProps {
  coupleNames?: string;
  weddingDate?: string;
  message?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
  hashtag?: string;
}

export function Footer({
  coupleNames = 'Partner One & Partner Two',
  weddingDate = '2025-06-15',
  message = 'Thank you for being part of our story. We can\'t wait to celebrate with you!',
  socialLinks,
  hashtag = '#CoupleNameWedding2025',
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-wedding-charcoal text-white">
      {/* Thank You Section */}
      <Section variant="default" className="bg-wedding-charcoal py-16 md:py-20">
        <Container size="md">
          <div className="text-center">
            {/* Decorative element */}
            <div className="mb-6">
              <span className="text-wedding-primary-300 text-2xl">♥</span>
            </div>

            {/* Thank you message */}
            <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              Thank You
            </h2>

            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              {message}
            </p>

            {/* Couple names */}
            <p className="font-display text-2xl text-wedding-primary-300">
              {coupleNames}
            </p>

            {/* Hashtag */}
            {hashtag && (
              <p className="mt-6 text-white/60 text-sm font-body">
                Share your photos with us using{' '}
                <span className="text-wedding-primary-300 font-medium">{hashtag}</span>
              </p>
            )}

            {/* Social Links */}
            {socialLinks && Object.values(socialLinks).some(Boolean) && (
              <div className="flex items-center justify-center gap-4 mt-8">
                {socialLinks.instagram && (
                  <SocialLink href={socialLinks.instagram} label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </SocialLink>
                )}
                {socialLinks.facebook && (
                  <SocialLink href={socialLinks.facebook} label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </SocialLink>
                )}
                {socialLinks.twitter && (
                  <SocialLink href={socialLinks.twitter} label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </SocialLink>
                )}
                {socialLinks.website && (
                  <SocialLink href={socialLinks.website} label="Website">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </SocialLink>
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Copyright Section */}
      <div className="border-t border-white/10 py-6">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              © {year} {coupleNames}. All rights reserved.
            </p>
            <p>
              Made with ♥
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'w-10 h-10 rounded-full',
        'flex items-center justify-center',
        'bg-white/10 text-white/70',
        'hover:bg-wedding-primary-500 hover:text-white',
        'transition-all duration-300'
      )}
      aria-label={label}
    >
      {children}
    </a>
  );
}
