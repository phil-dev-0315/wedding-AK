import { NextRequest, NextResponse } from 'next/server';
import type { Guest, RSVPFormData } from '@/types';

/**
 * API Route: POST /api/rsvp
 *
 * Submit RSVP for a guest
 *
 * Request Body:
 *   {
 *     guest_id: number,
 *     is_attending: boolean,
 *     additional_guests: string[] // Names of additional guests
 *   }
 *
 * Response:
 *   - 200: { success: true, message: string, data: { guest: Guest, additionalGuests: Guest[] } }
 *   - 400: { error: string } on validation error
 *   - 404: { error: string } if guest not found
 *   - 409: { error: string } if already responded
 *   - 500: { error: string } on server error
 *
 * Production Implementation:
 *
 * 1. Update VIP guest record:
 *    ```sql
 *    UPDATE guests
 *    SET is_attending = $is_attending, updated_at = NOW()
 *    WHERE id = $guest_id AND is_vip = true AND parent_id = 0
 *    RETURNING *;
 *    ```
 *
 * 2. Insert additional guests (if is_attending = true):
 *    ```sql
 *    INSERT INTO guests (full_name, additionals, is_vip, is_attending, parent_id)
 *    VALUES ($name, 0, false, true, $parent_id)
 *    RETURNING *;
 *    ```
 *
 * Example Supabase implementation:
 * ```typescript
 * // Update VIP
 * const { data: guest, error: updateError } = await supabase
 *   .from('guests')
 *   .update({ is_attending: body.is_attending, updated_at: new Date() })
 *   .eq('id', body.guest_id)
 *   .eq('is_vip', true)
 *   .eq('parent_id', 0)
 *   .select()
 *   .single();
 *
 * // Insert additional guests
 * if (body.is_attending && body.additional_guests.length > 0) {
 *   const additionalRecords = body.additional_guests.map(name => ({
 *     full_name: name,
 *     additionals: 0,
 *     is_vip: false,
 *     is_attending: true,
 *     parent_id: body.guest_id
 *   }));
 *
 *   const { data: additionals, error: insertError } = await supabase
 *     .from('guests')
 *     .insert(additionalRecords)
 *     .select();
 * }
 * ```
 */

// Mock database - replace with actual database in production
const mockDatabase: Map<number, Guest> = new Map([
  [1, { id: 1, full_name: 'Juan Dela Cruz', additionals: 2, is_vip: true, is_attending: null, parent_id: 0 }],
  [2, { id: 2, full_name: 'Maria Santos', additionals: 0, is_vip: true, is_attending: null, parent_id: 0 }],
  [3, { id: 3, full_name: 'Pedro Reyes', additionals: 1, is_vip: true, is_attending: null, parent_id: 0 }],
  [4, { id: 4, full_name: 'Ana Garcia', additionals: 3, is_vip: true, is_attending: null, parent_id: 0 }],
  [5, { id: 5, full_name: 'Carlos Mendoza', additionals: 0, is_vip: true, is_attending: true, parent_id: 0 }],
]);

let nextId = 100; // For mock additional guests

export async function POST(request: NextRequest) {
  try {
    const body: RSVPFormData = await request.json();

    // Validate request body
    if (!body.guest_id) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    if (typeof body.is_attending !== 'boolean') {
      return NextResponse.json(
        { error: 'Attendance status is required' },
        { status: 400 }
      );
    }

    // Find the guest (mock - replace with database query)
    const guest = mockDatabase.get(body.guest_id);

    if (!guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // Check if guest is VIP
    if (!guest.is_vip || guest.parent_id !== 0) {
      return NextResponse.json(
        { error: 'Invalid guest' },
        { status: 400 }
      );
    }

    // Check if already responded
    if (guest.is_attending !== null) {
      return NextResponse.json(
        { error: 'You have already submitted your RSVP' },
        { status: 409 }
      );
    }

    // Validate additional guests count
    const additionalGuestNames = body.additional_guests || [];
    if (additionalGuestNames.length > guest.additionals) {
      return NextResponse.json(
        { error: `You can only bring up to ${guest.additionals} additional guests` },
        { status: 400 }
      );
    }

    // Update guest attendance (mock - replace with database update)
    guest.is_attending = body.is_attending;
    mockDatabase.set(body.guest_id, guest);

    // Create additional guest records
    const createdAdditionalGuests: Guest[] = [];

    if (body.is_attending && additionalGuestNames.length > 0) {
      for (const name of additionalGuestNames) {
        if (name.trim()) {
          const additionalGuest: Guest = {
            id: nextId++,
            full_name: name.trim(),
            additionals: 0,
            is_vip: false,
            is_attending: true,
            parent_id: body.guest_id,
          };
          // Mock insert - replace with database insert
          mockDatabase.set(additionalGuest.id, additionalGuest);
          createdAdditionalGuests.push(additionalGuest);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: body.is_attending
        ? 'Thank you for confirming your attendance!'
        : 'Thank you for letting us know.',
      data: {
        guest,
        additionalGuests: createdAdditionalGuests,
      },
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/rsvp?guest_id={id}
 *
 * Get RSVP status and additional guests for a VIP
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const guestIdParam = searchParams.get('guest_id');

    if (!guestIdParam) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    const guestId = parseInt(guestIdParam, 10);

    if (isNaN(guestId)) {
      return NextResponse.json(
        { error: 'Invalid guest ID' },
        { status: 400 }
      );
    }

    // Find the guest (mock - replace with database query)
    const guest = mockDatabase.get(guestId);

    if (!guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // Find additional guests (mock - replace with database query)
    const additionalGuests: Guest[] = [];
    mockDatabase.forEach((g) => {
      if (g.parent_id === guestId) {
        additionalGuests.push(g);
      }
    });

    return NextResponse.json({
      guest,
      additionalGuests,
    });
  } catch (error) {
    console.error('Get RSVP error:', error);
    return NextResponse.json(
      { error: 'Failed to get RSVP status' },
      { status: 500 }
    );
  }
}
