'use client';

import { useState, useCallback } from 'react';
import { Section, SectionHeader, Container, Card, CardContent, Button, Input } from '@/components/ui';
import { cn, debounce } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { Guest, RSVPFormData } from '@/types';

// RSVP Form Steps
type RSVPStep = 'search' | 'select' | 'attendance' | 'additionals' | 'confirmation' | 'already-responded';

interface RSVPFormProps {
  title?: string;
  subtitle?: string;
}

// Search guests in Supabase
async function searchGuests(query: string): Promise<Guest[]> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('is_vip', true)
    .is('parent_id', null)
    .ilike('full_name', `%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching guests:', error);
    throw new Error('Failed to search guests');
  }

  return (data as Guest[]) || [];
}

// Fetch additional guests for a VIP
async function fetchAdditionalGuests(parentId: number): Promise<Guest[]> {
  console.log('Fetching additional guests for parent_id:', parentId, typeof parentId);

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('parent_id', parentId);

  console.log('Fetch result - data:', data, 'error:', error);

  if (error) {
    console.error('Error fetching additional guests:', error);
    return [];
  }

  return (data as Guest[]) || [];
}

// Submit RSVP to Supabase
async function submitRSVP(data: RSVPFormData): Promise<{ success: boolean; message: string }> {
  // Update the VIP's attendance status
  const { error: updateError } = await supabase
    .from('guests')
    .update({
      is_attending: data.is_attending,
      updated_at: new Date().toISOString()
    })
    .eq('id', data.guest_id);

  if (updateError) {
    console.error('Error updating guest:', updateError);
    return { success: false, message: 'Failed to update RSVP. Please try again.' };
  }

  // Insert additional guests if attending and has additional guests
  if (data.is_attending && data.additional_guests.length > 0) {
    const additionalGuestsData = data.additional_guests.map((name) => ({
      full_name: name,
      is_vip: false,
      is_attending: true,
      parent_id: data.guest_id,
      additionals: 0,
    }));

    const { error: insertError } = await supabase
      .from('guests')
      .insert(additionalGuestsData);

    if (insertError) {
      console.error('Error inserting additional guests:', insertError);
      return { success: false, message: 'Failed to add additional guests. Please try again.' };
    }
  }

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
  const [previousAdditionalGuests, setPreviousAdditionalGuests] = useState<Guest[]>([]);
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
  const handleSelectGuest = async (guest: Guest) => {
    setSelectedGuest(guest);
    console.log('Selected guest:', guest);

    // Check if already responded
    if (guest.is_attending !== null) {
      // Fetch additional guests if attending
      if (guest.is_attending) {
        console.log('Guest is attending, fetching additionals for id:', guest.id);
        const additionals = await fetchAdditionalGuests(guest.id);
        console.log('Setting previousAdditionalGuests:', additionals);
        setPreviousAdditionalGuests(additionals);
      } else {
        setPreviousAdditionalGuests([]);
      }
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
    setPreviousAdditionalGuests([]);
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
                <div className={cn(
                  'w-16 h-16 mx-auto rounded-full flex items-center justify-center',
                  selectedGuest.is_attending ? 'bg-green-100' : 'bg-wedding-primary-100'
                )}>
                  {selectedGuest.is_attending ? (
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-wedding-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-2xl text-wedding-charcoal mb-2">
                    Already Responded
                  </h3>
                  <p className="text-wedding-secondary-600">
                    Hi {selectedGuest.full_name}, you&apos;ve already submitted your RSVP.
                  </p>
                  <div className={cn(
                    'inline-block mt-3 px-4 py-2 rounded-full text-sm font-medium',
                    selectedGuest.is_attending
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}>
                    {selectedGuest.is_attending ? 'Attending' : 'Not Attending'}
                  </div>
                </div>

                {selectedGuest.is_attending && (
                  <div className="p-4 bg-wedding-primary-50 rounded-md text-left">
                    <p className="text-sm font-medium text-wedding-secondary-700 mb-2">Your party:</p>
                    <ul className="text-sm text-wedding-charcoal space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-wedding-primary-500">•</span>
                        {selectedGuest.full_name}
                      </li>
                      {previousAdditionalGuests.map((guest) => (
                        <li key={guest.id} className="flex items-center gap-2">
                          <span className="text-wedding-primary-500">•</span>
                          {guest.full_name}
                        </li>
                      ))}
                    </ul>
                    {previousAdditionalGuests.length === 0 && selectedGuest.additionals > 0 && (
                      <p className="text-xs text-wedding-secondary-500 mt-2">
                        No additional guests registered.
                      </p>
                    )}
                  </div>
                )}

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
