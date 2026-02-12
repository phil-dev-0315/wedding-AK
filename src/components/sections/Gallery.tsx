'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Section, SectionHeader, Container } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/types';

const defaultImages: GalleryImage[] = [
  {
    id: '1',
    src: '/images/gallery/04AK.png',
    alt: 'Gallery Photo 1',
    width: 600,
    height: 800,
  },
  {
    id: '2',
    src: '/images/gallery/07AK.png',
    alt: 'Gallery Photo 2',
    width: 800,
    height: 600,
  },
  {
    id: '3',
    src: '/images/gallery/08AK.png',
    alt: 'Gallery Photo 3',
    width: 800,
    height: 600,
  },
  {
    id: '4',
    src: '/images/gallery/09AK.png',
    alt: 'Gallery Photo 4',
    width: 600,
    height: 800,
  },
  {
    id: '5',
    src: '/images/gallery/10AK.png',
    alt: 'Gallery Photo 5',
    width: 800,
    height: 600,
  },
  {
    id: '6',
    src: '/images/gallery/11AK.png',
    alt: 'Gallery Photo 6',
    width: 800,
    height: 600,
  },
  {
    id: '7',
    src: '/images/gallery/14AK.png',
    alt: 'Gallery Photo 7',
    width: 800,
    height: 600,
  },
  {
    id: '8',
    src: '/images/gallery/15AK.png',
    alt: 'Gallery Photo 8',
    width: 800,
    height: 600,
  },
  {
    id: '9',
    src: '/images/gallery/18AK.png',
    alt: 'Gallery Photo 9',
    width: 800,
    height: 600,
  },
  {
    id: '10',
    src: '/images/gallery/22AK.png',
    alt: 'Gallery Photo 10',
    width: 800,
    height: 600,
  },
  {
    id: '11',
    src: '/images/gallery/24AK.png',
    alt: 'Gallery Photo 11',
    width: 800,
    height: 600,
  },
  {
    id: '12',
    src: '/images/gallery/26AK.png',
    alt: 'Gallery Photo 12',
    width: 800,
    height: 600,
  },
  {
    id: '13',
    src: '/images/gallery/27AK.png',
    alt: 'Gallery Photo 13',
    width: 800,
    height: 600,
  },
  {
    id: '14',
    src: '/images/gallery/32AK.png',
    alt: 'Gallery Photo 14',
    width: 800,
    height: 600,
  },
  {
    id: '15',
    src: '/images/gallery/33AK.png',
    alt: 'Gallery Photo 15',
    width: 800,
    height: 600,
  },
  {
    id: '16',
    src: '/images/gallery/35AK.png',
    alt: 'Gallery Photo 16',
    width: 800,
    height: 600,
  },
  {
    id: '17',
    src: '/images/gallery/36AK.png',
    alt: 'Gallery Photo 17',
    width: 800,
    height: 600,
  },
  {
    id: '18',
    src: '/images/gallery/37AK.png',
    alt: 'Gallery Photo 18',
    width: 800,
    height: 600,
  },
  {
    id: '19',
    src: '/images/gallery/40AK.png',
    alt: 'Gallery Photo 19',
    width: 800,
    height: 600,
  },
  {
    id: '20',
    src: '/images/gallery/41AK.png',
    alt: 'Gallery Photo 20',
    width: 800,
    height: 600,
  },
  {
    id: '21',
    src: '/images/gallery/rsvp.png',
    alt: 'Gallery Photo 21',
    width: 800,
    height: 600,
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
        <div className="relative w-full h-[60vh] bg-wedding-primary-900/50 rounded-lg overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 80vw"
            priority
          />
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
                'bg-wedding-rockblue/10',
                'group cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-primary-500 focus-visible:ring-offset-2',
                'transition-all duration-300',
                // First image spans 2 rows for visual interest
                index === 0 && 'row-span-2'
              )}
              aria-label={`View ${image.alt}`}
            >
              {/* Image container */}
              <div className={cn(
                'w-full relative',
                index === 0 ? 'aspect-[3/4]' : 'aspect-square'
              )}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />

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
