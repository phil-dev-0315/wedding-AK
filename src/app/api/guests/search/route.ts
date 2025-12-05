import { NextRequest, NextResponse } from 'next/server';
import type { Guest } from '@/types';

/**
 * API Route: GET /api/guests/search
 *
 * Search for VIP guests by name (case-insensitive, partial match)
 *
 * Query Parameters:
 *   - q: Search query string
 *
 * Response:
 *   - 200: { guests: Guest[] }
 *   - 400: { error: string } if query is missing
 *   - 500: { error: string } on server error
 *
 * Production Note:
 * Replace the mock data below with actual database queries.
 * Recommended: Supabase, PlanetScale, or Neon
 *
 * Example Supabase query:
 * ```
 * const { data, error } = await supabase
 *   .from('guests')
 *   .select('*')
 *   .eq('is_vip', true)
 *   .eq('parent_id', 0)
 *   .ilike('full_name', `%${query}%`);
 * ```
 */

// Mock data - replace with database query in production
const mockGuests: Guest[] = [
  { id: 1, full_name: 'Juan Dela Cruz', additionals: 2, is_vip: true, is_attending: null, parent_id: 0 },
  { id: 2, full_name: 'Maria Santos', additionals: 0, is_vip: true, is_attending: null, parent_id: 0 },
  { id: 3, full_name: 'Pedro Reyes', additionals: 1, is_vip: true, is_attending: null, parent_id: 0 },
  { id: 4, full_name: 'Ana Garcia', additionals: 3, is_vip: true, is_attending: null, parent_id: 0 },
  { id: 5, full_name: 'Carlos Mendoza', additionals: 0, is_vip: true, is_attending: true, parent_id: 0 },
  { id: 6, full_name: 'Sofia Rodriguez', additionals: 1, is_vip: true, is_attending: false, parent_id: 0 },
  { id: 7, full_name: 'Miguel Torres', additionals: 2, is_vip: true, is_attending: null, parent_id: 0 },
  { id: 8, full_name: 'Isabella Cruz', additionals: 0, is_vip: true, is_attending: null, parent_id: 0 },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Filter VIP guests with matching names
    // In production, replace with database query
    const results = mockGuests.filter(
      (guest) =>
        guest.is_vip &&
        guest.parent_id === 0 &&
        guest.full_name.toLowerCase().includes(normalizedQuery)
    );

    return NextResponse.json({ guests: results });
  } catch (error) {
    console.error('Guest search error:', error);
    return NextResponse.json(
      { error: 'Failed to search guests' },
      { status: 500 }
    );
  }
}
