import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const upcoming = searchParams.get('upcoming') === 'true';

    const supabase = createClient();

    let query = supabase
      .from('appointments')
      .select('*, slot:availability_slots(*)')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      // Filter by appointment date via slot join
      query = query.eq('slot.date', date);
    }

    if (upcoming) {
      const todayStr = new Date().toISOString().split('T')[0];
      // Filter appointments where the slot date >= today
      query = query.gte('slot.date', todayStr);
    }

    const { data: appointments, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }

    // Filter out appointments where slot didn't match the date filter (Supabase join filter behavior)
    const filtered = date || upcoming
      ? appointments?.filter((a) => a.slot !== null) ?? []
      : appointments ?? [];

    return NextResponse.json({ appointments: filtered });
  } catch (error) {
    console.error('Error in GET /api/admin/appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
