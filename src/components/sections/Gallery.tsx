'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Section, SectionHeader, Container } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/types';

// Placeholder images - replace with actual images or CMS data
const defaultImages: GalleryImage[] = [
  {
    id: '1',
    src: '/images/gallery/placeholder-1.jpg',
    alt: 'Couple photo 1',
    width: 600,
    height: 800,
    caption: 'Our engagement day',
  },
  {
    id: '2',
    src: '/images/gallery/placeholder-2.jpg',
    alt: 'Couple photo 2',
    width: 800,
    height: 600,
    caption: 'A beautiful sunset',
  },
  {
    id: '3',
    src: '/images/gallery/placeholder-3.jpg',
    alt: 'Couple photo 3',
    width: 600,
    height: 600,
    caption: 'Coffee date',
  },
  {
    id: '4',
    src: '/images/gallery/placeholder-4.jpg',
    alt: 'Couple photo 4',
    width: 800,
    height: 600,
    caption: 'Weekend getaway',
  },
  {
    id: '5',
    src: '/images/gallery/placeholder-5.jpg',
    alt: 'Couple photo 5',
    width: 600,
    height: 800,
    caption: 'Pre-wedding shoot',
  },
  {
    id: '6',
    src: '/images/gallery/placeholder-6.jpg',
    alt: 'Couple photo 6',
    width: 600,
    height: 600,
    caption: 'Adventure together',
  },
];

interface GalleryProps {
  images?: GalleryImage[];
  title?: string;
  subtitle?: string;
}

interface LightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function Lightbox({ image, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-4xl max-h-[80vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-auto bg-wedding-charcoal/50 rounded-lg overflow-hidden">
          {/* Placeholder div for when images aren't available */}
          <div className="w-full h-[60vh] flex items-center justify-center bg-wedding-secondary-800 text-white/50">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">{image.alt}</p>
            </div>
          </div>
        </div>
        {image.caption && (
          <p className="mt-4 text-center text-white/80 text-sm">{image.caption}</p>
        )}
      </div>
    </div>
  );
}

export function Gallery({
  images = defaultImages,
  title = 'Our Gallery',
  subtitle = 'A glimpse into our journey together',
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  // Handle keyboard navigation
  if (typeof window !== 'undefined' && selectedIndex !== null) {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
  }

  return (
    <Section sectionId="gallery" variant="cream">
      <Container>
        <SectionHeader title={title} subtitle={subtitle} />

        {/* Responsive grid - masonry-like layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleImageClick(index)}
              className={cn(
                'relative overflow-hidden rounded-lg',
                'bg-wedding-secondary-100',
                'group cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-primary-500 focus-visible:ring-offset-2',
                'transition-all duration-300',
                // Vary heights for visual interest
                index % 5 === 0 && 'row-span-2',
                index % 7 === 0 && 'md:col-span-2'
              )}
              aria-label={`View ${image.alt}`}
            >
              {/* Placeholder image container */}
              <div className={cn(
                'w-full',
                index % 5 === 0 ? 'aspect-[3/4]' : 'aspect-square'
              )}>
                {/* Placeholder background */}
                <div className="absolute inset-0 bg-wedding-secondary-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-wedding-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <Lightbox
            image={images[selectedIndex]}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex < images.length - 1}
          />
        )}
      </Container>
    </Section>
  );
}
