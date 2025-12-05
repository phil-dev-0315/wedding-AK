'use client';

import { useState, useCallback } from 'react';
import { Section, SectionHeader, Container, Card, CardContent, Button, Input } from '@/components/ui';
import { cn, debounce, matchesSearch } from '@/lib/utils';
import type { Guest, RSVPFormData } from '@/types';

// RSVP Form Steps
type RSVPStep = 'search' | 'select' | 'attendance' | 'additionals' | 'confirmation' | 'already-responded';

interface RSVPFormProps {
  title?: string;
  subtitle?: string;
}

// Mock API functions - replace with actual API calls
async function searchGuests(query: string): Promise<Guest[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data - in production, this would be an API call
  const mockVIPs: Guest[] = [
    { id: 1, full_name: 'Juan Dela Cruz', additionals: 2, is_vip: true, is_attending: null, parent_id: 0 },
    { id: 2, full_name: 'Maria Santos', additionals: 0, is_vip: true, is_attending: null, parent_id: 0 },
    { id: 3, full_name: 'Pedro Reyes', additionals: 1, is_vip: true, is_attending: null, parent_id: 0 },
    { id: 4, full_name: 'Ana Garcia', additionals: 3, is_vip: true, is_attending: null, parent_id: 0 },
    { id: 5, full_name: 'Carlos Mendoza', additionals: 0, is_vip: true, is_attending: true, parent_id: 0 }, // Already responded
  ];

  if (!query.trim()) return [];

  // Filter VIPs only, case-insensitive partial match
  return mockVIPs.filter(
    (guest) => guest.is_vip && guest.parent_id === 0 && matchesSearch(guest.full_name, query)
  );
}

async function submitRSVP(data: RSVPFormData): Promise<{ success: boolean; message: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production, this would be an API call to:
  // 1. Update the VIP's is_attending status
  // 2. Insert new records for additional guests
  console.log('RSVP Submission:', data);

  return { success: true, message: 'Your RSVP has been recorded!' };
}

export function RSVPForm({
  title = 'RSVP',
  subtitle = 'Please let us know if you can join us on our special day',
}: RSVPFormProps) {
  // Form state
  const [step, setStep] = useState<RSVPStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [additionalGuests, setAdditionalGuests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        const results = await searchGuests(query);
        setSearchResults(results);
      } catch (err) {
        setError('Failed to search. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    setError(null);
    debouncedSearch(query);
  };

  // Handle guest selection
  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);

    // Check if already responded
    if (guest.is_attending !== null) {
      setStep('already-responded');
    } else {
      setStep('attendance');
    }
  };

  // Handle attendance selection
  const handleAttendanceSelect = (attending: boolean) => {
    setIsAttending(attending);

    if (attending && selectedGuest && selectedGuest.additionals > 0) {
      // Initialize additional guest fields
      setAdditionalGuests(new Array(selectedGuest.additionals).fill(''));
      setStep('additionals');
    } else {
      // Skip additionals step if not attending or no additionals allowed
      handleSubmit(attending, []);
    }
  };

  // Handle additional guest name change
  const handleAdditionalGuestChange = (index: number, name: string) => {
    setAdditionalGuests((prev) => {
      const updated = [...prev];
      updated[index] = name;
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (attending: boolean, additionals: string[]) => {
    if (!selectedGuest) return;

    setIsLoading(true);
    setError(null);

    try {
      const data: RSVPFormData = {
        guest_id: selectedGuest.id,
        is_attending: attending,
        additional_guests: attending ? additionals.filter((name) => name.trim()) : [],
      };

      const result = await submitRSVP(data);

      if (result.success) {
        setStep('confirmation');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit with additionals
  const handleSubmitWithAdditionals = () => {
    if (isAttending !== null) {
      handleSubmit(isAttending, additionalGuests);
    }
  };

  // Reset form
  const handleReset = () => {
    setStep('search');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedGuest(null);
    setIsAttending(null);
    setAdditionalGuests([]);
    setError(null);
  };

  // Go back one step
  const handleBack = () => {
    switch (step) {
      case 'select':
        setStep('search');
        break;
      case 'attendance':
        setStep('search');
        setSelectedGuest(null);
        break;
      case 'additionals':
        setStep('attendance');
        setIsAttending(null);
        break;
      default:
        break;
    }
  };

  return (
    <Section sectionId="rsvp" variant="white">
      <Container size="sm">
        <SectionHeader title={title} subtitle={subtitle} />

        <Card className="max-w-lg mx-auto">
          <CardContent className="p-6 sm:p-8">
            {/* Step indicator */}
            {step !== 'confirmation' && step !== 'already-responded' && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {['search', 'attendance', 'additionals'].map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      step === s ||
                      (step === 'select' && s === 'search') ||
                      (['attendance', 'additionals'].includes(step) && i === 1) ||
                      (step === 'additionals' && i === 2)
                        ? 'bg-wedding-primary-500 w-6'
                        : 'bg-wedding-primary-200'
                    )}
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Search */}
            {(step === 'search' || step === 'select') && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="guest-search" className="form-label">
                    Search for your name
                  </label>
                  <Input
                    id="guest-search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter your name..."
                    autoComplete="off"
                  />
                </div>

                {/* Search results */}
                {isSearching && (
                  <div className="text-center py-4 text-wedding-secondary-500">
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Searching...
                  </div>
                )}

                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="p-4 bg-wedding-primary-50 rounded-md text-center">
                    <p className="text-wedding-secondary-700 mb-2">
                      We couldn&apos;t find your name on our guest list.
                    </p>
                    <p className="text-sm text-wedding-secondary-500">
                      Please contact the couple if you believe this is an error.
                    </p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-wedding-secondary-600">
                      Select your name:
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((guest) => (
                        <button
                          key={guest.id}
                          onClick={() => handleSelectGuest(guest)}
                          className={cn(
                            'w-full p-3 text-left rounded-md border',
                            'transition-all duration-300',
                            'hover:border-wedding-primary-400 hover:bg-wedding-primary-50',
                            selectedGuest?.id === guest.id
                              ? 'border-wedding-primary-500 bg-wedding-primary-50'
                              : 'border-wedding-primary-200'
                          )}
                        >
                          <span className="font-medium text-wedding-charcoal">
                            {guest.full_name}
                          </span>
                          {guest.additionals > 0 && (
                            <span className="ml-2 text-xs text-wedding-secondary-500">
                              (+{guest.additionals} guest{guest.additionals > 1 ? 's' : ''})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Attendance */}
            {step === 'attendance' && selectedGuest && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-wedding-secondary-600 mb-2">Welcome,</p>
                  <p className="font-display text-2xl text-wedding-charcoal">
                    {selectedGuest.full_name}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-center text-wedding-secondary-700">
                    Will you be joining us?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => handleAttendanceSelect(true)}
                      variant="primary"
                      className="flex-1"
                      isLoading={isLoading}
                    >
                      Yes, I&apos;ll be there!
                    </Button>
                    <Button
                      onClick={() => handleAttendanceSelect(false)}
                      variant="outline"
                      className="flex-1"
                      isLoading={isLoading}
                    >
                      Sorry, I can&apos;t make it
                    </Button>
                  </div>
                </div>

                <button
                  onClick={handleBack}
                  className="w-full text-sm text-wedding-secondary-500 hover:text-wedding-secondary-700 transition-colors"
                >
                  ← Back to search
                </button>
              </div>
            )}

            {/* Step 3: Additional Guests */}
            {step === 'additionals' && selectedGuest && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-wedding-secondary-600 mb-1">
                    You can bring up to {selectedGuest.additionals} additional guest{selectedGuest.additionals > 1 ? 's' : ''}.
                  </p>
                  <p className="text-sm text-wedding-secondary-500">
                    Please enter their names below (leave blank if not bringing anyone).
                  </p>
                </div>

                <div className="space-y-3">
                  {additionalGuests.map((name, index) => (
                    <Input
                      key={index}
                      value={name}
                      onChange={(e) => handleAdditionalGuestChange(index, e.target.value)}
                      placeholder={`Guest ${index + 1} full name`}
                      label={`Guest ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleSubmitWithAdditionals}
                    variant="primary"
                    isLoading={isLoading}
                  >
                    Submit RSVP
                  </Button>
                  <button
                    onClick={handleBack}
                    className="text-sm text-wedding-secondary-500 hover:text-wedding-secondary-700 transition-colors"
                    disabled={isLoading}
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {step === 'confirmation' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h3 className="font-display text-2xl text-wedding-charcoal mb-2">
                    Thank You!
                  </h3>
                  <p className="text-wedding-secondary-600">
                    {isAttending
                      ? 'We\'re so excited to celebrate with you!'
                      : 'We\'re sorry you can\'t make it. You\'ll be missed!'}
                  </p>
                </div>

                {isAttending && selectedGuest && selectedGuest.additionals > 0 && additionalGuests.filter(n => n.trim()).length > 0 && (
                  <div className="p-4 bg-wedding-primary-50 rounded-md">
                    <p className="text-sm text-wedding-secondary-700 mb-2">Your party:</p>
                    <ul className="text-sm text-wedding-charcoal">
                      <li>• {selectedGuest.full_name}</li>
                      {additionalGuests.filter(n => n.trim()).map((name, index) => (
                        <li key={index}>• {name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button onClick={handleReset} variant="outline">
                  Submit another RSVP
                </Button>
              </div>
            )}

            {/* Already Responded */}
            {step === 'already-responded' && selectedGuest && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-wedding-primary-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-wedding-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div>
                  <h3 className="font-display text-2xl text-wedding-charcoal mb-2">
                    Already Responded
                  </h3>
                  <p className="text-wedding-secondary-600">
                    Hi {selectedGuest.full_name}, you&apos;ve already submitted your RSVP.
                  </p>
                  <p className="text-sm text-wedding-secondary-500 mt-2">
                    {selectedGuest.is_attending
                      ? 'We look forward to seeing you!'
                      : 'We\'re sorry you can\'t make it.'}
                  </p>
                </div>

                <p className="text-sm text-wedding-secondary-500">
                  If you need to make changes, please contact us directly.
                </p>

                <Button onClick={handleReset} variant="outline">
                  Search for another guest
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
