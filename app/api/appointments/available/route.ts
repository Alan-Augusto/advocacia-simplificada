import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import type { AvailabilitySlot, SlotsByDate } from '@/lib/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '60');

    const supabase = createClient();

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const future = new Date(today);
    future.setDate(future.getDate() + days);
    const futureStr = future.toISOString().split('T')[0];

    const { data: slots, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('is_booked', false)
      .eq('is_cancelled', false)
      .gte('date', todayStr)
      .lte('date', futureStr)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching available slots:', error);
      return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
    }

    // Filter out past time slots for today
    const nowTimeStr = today.toTimeString().slice(0, 8); // 'HH:MM:SS'
    const filtered = (slots as AvailabilitySlot[]).filter((slot) => {
      if (slot.date === todayStr) {
        return slot.start_time > nowTimeStr;
      }
      return true;
    });

    // Group by date
    const slotsByDate: SlotsByDate = {};
    for (const slot of filtered) {
      if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
      slotsByDate[slot.date].push(slot);
    }

    return NextResponse.json({ slots: slotsByDate });
  } catch (error) {
    console.error('Error in GET /api/appointments/available:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
