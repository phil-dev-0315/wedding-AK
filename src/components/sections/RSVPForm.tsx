'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Section, SectionHeader, Container } from '@/components/ui';
import { cn, debounce } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { Guest, RSVPFormData } from '@/types';

// RSVP Form Steps
type RSVPStep = 'search' | 'record' | 'confirmation' | 'already-responded';

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

// Set to false to enable the RSVP form when the guest list is ready
const RSVP_DISABLED = false;

// Custom radio button component
function RadioButton({
  selected,
  onClick,
  label,
  disabled = false,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 cursor-pointer transition-all duration-200',
        disabled && 'cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200',
          selected
            ? 'border-wedding-tan bg-wedding-tan'
            : 'border-wedding-secondary-300 bg-white'
        )}
      >
        {selected && (
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
        )}
      </span>
      <span className={cn(
        'text-sm',
        selected ? 'text-wedding-charcoal font-medium' : 'text-wedding-secondary-600'
      )}>
        {label}
      </span>
    </button>
  );
}

export function RSVPForm({
  title = 'Our Intimate Celebration',
  subtitle = 'We can\u2019t wait to celebrate our special day with you! As we\u2019ve chosen to keep this an intimate celebration, our guest list is limited to those whose names appear in our RSVP portal. To confirm your attendance, please enter your name in the search bar below. We truly appreciate your love and understanding in helping us keep this gathering small and meaningful.',
}: RSVPFormProps) {
  // Form state
  const [step, setStep] = useState<RSVPStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [seatAttendance, setSeatAttendance] = useState<(boolean | null)[]>([]);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [previousAdditionalGuests, setPreviousAdditionalGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameFromAlreadyResponded, setCameFromAlreadyResponded] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    setSearchQuery('');
    setSearchResults([]);

    // Check if already responded
    if (guest.is_attending !== null) {
      if (guest.is_attending) {
        const additionals = await fetchAdditionalGuests(guest.id);
        setPreviousAdditionalGuests(additionals);
      } else {
        setPreviousAdditionalGuests([]);
      }
      setStep('already-responded');
    } else {
      // Fetch any existing companions from the database
      const existingCompanions = await fetchAdditionalGuests(guest.id);

      // Pre-fill companion names and attendance from existing records
      const names = new Array(guest.additionals).fill('');
      const attendance: (boolean | null)[] = [null, ...new Array(guest.additionals).fill(null)];

      existingCompanions.forEach((companion, i) => {
        if (i < guest.additionals) {
          names[i] = companion.full_name;
          attendance[i + 1] = companion.is_attending;
        }
      });

      setSeatAttendance(attendance);
      setCompanionNames(names);
      setStep('record');
    }
  };

  // Update attendance for a specific seat
  const updateSeatAttendance = (seatIndex: number, attending: boolean) => {
    setSeatAttendance(prev => {
      const updated = [...prev];
      updated[seatIndex] = attending;

      // When VIP selects "Not Attending", clear all companion selections
      if (seatIndex === 0 && !attending) {
        for (let i = 1; i < updated.length; i++) {
          updated[i] = null;
        }
      }

      return updated;
    });
  };

  // Update companion name
  const updateCompanionName = (companionIndex: number, name: string) => {
    setCompanionNames(prev => {
      const updated = [...prev];
      updated[companionIndex] = name;
      return updated;
    });
  };

  // Check if form is complete enough to submit
  const isFormComplete = (): boolean => {
    // VIP must have made a selection
    if (seatAttendance[0] === null) return false;

    // If VIP is not attending, form is complete
    if (seatAttendance[0] === false) return true;

    // If VIP is attending but has no companion slots, form is complete
    if (!selectedGuest || selectedGuest.additionals === 0) return true;

    // Each companion seat must have a selection, and attending companions need names
    for (let i = 0; i < (selectedGuest?.additionals ?? 0); i++) {
      if (seatAttendance[i + 1] === null) return false;
      if (seatAttendance[i + 1] === true && !companionNames[i].trim()) return false;
    }
    return true;
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
        if (cameFromAlreadyResponded) {
          const updatedAdditionals = await fetchAdditionalGuests(selectedGuest.id);
          setPreviousAdditionalGuests(updatedAdditionals);
          setCameFromAlreadyResponded(false);
          setCompanionNames([]);
          setShowSuccessMessage(true);
          setStep('already-responded');
          setTimeout(() => setShowSuccessMessage(false), 5000);
        } else {
          setStep('confirmation');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle consolidated submit from record view
  const handleConsolidatedSubmit = () => {
    if (!selectedGuest || !isFormComplete()) return;

    const vipAttending = seatAttendance[0] === true;

    // Collect only companion names where attendance is true
    const attendingCompanions = companionNames.filter((name, index) =>
      seatAttendance[index + 1] === true && name.trim()
    );

    handleSubmit(vipAttending, attendingCompanions);
  };

  // Handle adding guests for already responded users
  const handleAddGuestsFromAlreadyResponded = () => {
    if (selectedGuest && selectedGuest.additionals > 0) {
      setSeatAttendance([true, ...new Array(selectedGuest.additionals).fill(null)]);
      setCompanionNames(new Array(selectedGuest.additionals).fill(''));
      setCameFromAlreadyResponded(true);
      setShowSuccessMessage(false);
      setStep('record');
    }
  };

  // Reset form
  const handleReset = () => {
    setStep('search');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedGuest(null);
    setSeatAttendance([]);
    setCompanionNames([]);
    setPreviousAdditionalGuests([]);
    setCameFromAlreadyResponded(false);
    setShowSuccessMessage(false);
    setError(null);
  };

  const totalSeats = selectedGuest ? 1 + selectedGuest.additionals : 1;
  const vipNotAttending = seatAttendance[0] === false;

  return (
    <Section sectionId="rsvp" variant="cream">
      <Container size="sm">
        {/* Couple photo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/images/gallery/rsvp.png"
              alt="Couple photo"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </div>
        </div>

        <SectionHeader title={title} subtitle={subtitle} />

        <div className="max-w-lg mx-auto">
          {/* RSVP Disabled - Coming Soon */}
          {RSVP_DISABLED ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-wedding-primary-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-wedding-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl text-wedding-charcoal mb-2">
                  Coming Soon
                </h3>
                <p className="text-wedding-secondary-600">
                  RSVP will be available shortly. Please check back soon!
                </p>
              </div>
            </div>
          ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Search */}
            {step === 'search' && (
              <div className="space-y-4">
                {/* Search input with icon */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-wedding-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="guest-search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Type your full name here (e.g, Juan Dela Cruz)"
                    autoComplete="off"
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-md',
                      'border bg-white text-wedding-charcoal',
                      'placeholder:text-wedding-secondary-400',
                      'transition-all duration-300',
                      'focus:outline-none focus:ring-2',
                      'border-wedding-primary-200 focus:border-wedding-primary-400 focus:ring-wedding-primary-100'
                    )}
                  />
                </div>

                {/* Search results */}
                {isSearching && (
                  <div className="text-center py-4 text-wedding-secondary-500">
                    <span className="inline-block animate-spin mr-2">&#x27F3;</span>
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
                            'hover:border-wedding-tan hover:bg-wedding-tan/5',
                            'border-wedding-primary-200'
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

            {/* Record view - consolidated attendance + companions */}
            {step === 'record' && selectedGuest && (
              <div className="space-y-6">
                {/* Guest header */}
                <div>
                  <p className="font-display text-xl font-bold text-wedding-charcoal">
                    {selectedGuest.full_name}
                  </p>
                  <p className="text-sm text-wedding-secondary-600 mt-1">
                    We have reserved {totalSeats} seat{totalSeats > 1 ? 's' : ''} for you{selectedGuest.additionals > 0 ? ' and companion' : ''}.
                  </p>
                </div>

                {/* Seat list */}
                <div className="space-y-4">
                  {/* Seat 1: VIP */}
                  <div className="flex items-center justify-between py-3 border-b border-wedding-primary-100">
                    <p className="text-wedding-charcoal">
                      <span className="font-medium">1.</span>{' '}
                      <span className="font-medium">{selectedGuest.full_name}</span>
                    </p>
                    <div className="flex items-center gap-4">
                      <RadioButton
                        selected={seatAttendance[0] === true}
                        onClick={() => updateSeatAttendance(0, true)}
                        label="Attending"
                      />
                      <RadioButton
                        selected={seatAttendance[0] === false}
                        onClick={() => updateSeatAttendance(0, false)}
                        label="Not Attending"
                      />
                    </div>
                  </div>

                  {/* Companion seats - hidden when VIP is not attending */}
                  {!vipNotAttending && Array.from({ length: selectedGuest.additionals }).map((_, index) => (
                    <div
                      key={index}
                      className="py-3 border-b border-wedding-primary-100 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                          <span className="text-wedding-charcoal font-medium shrink-0">{index + 2}.</span>
                          <input
                            type="text"
                            value={companionNames[index]}
                            onChange={(e) => updateCompanionName(index, e.target.value)}
                            placeholder="Companion Name"
                            className={cn(
                              'flex-1 min-w-0 px-2 py-1 rounded text-sm',
                              'border-b border-wedding-primary-200 bg-transparent text-wedding-charcoal',
                              'placeholder:text-wedding-secondary-400',
                              'focus:outline-none focus:border-wedding-tan',
                              'transition-all duration-200'
                            )}
                          />
                          <span className="text-xs text-wedding-secondary-400 shrink-0 hidden sm:inline">(Companion Name)</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <RadioButton
                            selected={seatAttendance[index + 1] === true}
                            onClick={() => updateSeatAttendance(index + 1, true)}
                            label="Attending"
                            disabled={vipNotAttending}
                          />
                          <RadioButton
                            selected={seatAttendance[index + 1] === false}
                            onClick={() => updateSeatAttendance(index + 1, false)}
                            label="Not Attending"
                            disabled={vipNotAttending}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <button
                  onClick={handleConsolidatedSubmit}
                  disabled={isLoading || !isFormComplete()}
                  className={cn(
                    'w-full py-3.5 rounded-md font-body font-medium tracking-wider uppercase',
                    'bg-wedding-tan text-white',
                    'hover:bg-wedding-tan/90',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-300',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-tan focus-visible:ring-offset-2'
                  )}
                >
                  {isLoading ? 'Submitting...' : 'SUBMIT RSVP'}
                </button>

                {/* Back link */}
                <button
                  onClick={handleReset}
                  className="w-full text-sm text-wedding-secondary-500 hover:text-wedding-secondary-700 transition-colors"
                  disabled={isLoading}
                >
                  &larr; Search for a different name
                </button>
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
                    {seatAttendance[0] === true
                      ? 'We\'re so excited to celebrate with you!'
                      : 'We\'re sorry you can\'t make it. You\'ll be missed!'}
                  </p>
                </div>

                {seatAttendance[0] === true && selectedGuest && (
                  <div className="p-4 bg-wedding-primary-50 rounded-md text-left">
                    <p className="text-sm font-medium text-wedding-secondary-700 mb-2">Your party:</p>
                    <ul className="text-sm text-wedding-charcoal space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-wedding-tan">1.</span>
                        {selectedGuest.full_name}
                      </li>
                      {companionNames.filter((name, index) =>
                        seatAttendance[index + 1] === true && name.trim()
                      ).map((name, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-wedding-tan">{index + 2}.</span>
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className={cn(
                    'px-6 py-2.5 rounded-md font-body font-medium',
                    'border-2 border-wedding-tan text-wedding-tan',
                    'hover:bg-wedding-tan hover:text-white',
                    'transition-all duration-300',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-tan focus-visible:ring-offset-2'
                  )}
                >
                  Submit another RSVP
                </button>
              </div>
            )}

            {/* Already Responded */}
            {step === 'already-responded' && selectedGuest && (
              <div className="space-y-6">
                {/* Success message for adding guests */}
                {showSuccessMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-sm font-medium text-center">
                      Additional guests added successfully!
                    </p>
                  </div>
                )}

                <div className="text-center">
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
                        <span className="text-wedding-tan">1.</span>
                        {selectedGuest.full_name}
                      </li>
                      {previousAdditionalGuests.map((guest, index) => (
                        <li key={guest.id} className="flex items-center gap-2">
                          <span className="text-wedding-tan">{index + 2}.</span>
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

                {/* Add guests button if attending and has available slots but no guests added */}
                {selectedGuest.is_attending && selectedGuest.additionals > 0 && previousAdditionalGuests.length === 0 && (
                  <button
                    onClick={handleAddGuestsFromAlreadyResponded}
                    className={cn(
                      'w-full py-3 rounded-md font-body font-medium tracking-wider uppercase',
                      'bg-wedding-tan text-white',
                      'hover:bg-wedding-tan/90',
                      'transition-all duration-300',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-tan focus-visible:ring-offset-2'
                    )}
                  >
                    Add Additional Guests
                  </button>
                )}

                {(!selectedGuest.is_attending || previousAdditionalGuests.length > 0 || selectedGuest.additionals === 0) && (
                  <p className="text-sm text-wedding-secondary-500 text-center">
                    If you need to make changes, please contact us directly.
                  </p>
                )}

                <button
                  onClick={handleReset}
                  className={cn(
                    'w-full px-6 py-2.5 rounded-md font-body font-medium',
                    'border-2 border-wedding-tan text-wedding-tan',
                    'hover:bg-wedding-tan hover:text-white',
                    'transition-all duration-300',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-tan focus-visible:ring-offset-2'
                  )}
                >
                  Search for another guest
                </button>
              </div>
            )}
          </>
          )}
        </div>
      </Container>
    </Section>
  );
}
