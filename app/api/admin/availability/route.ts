import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const supabase = createClient();

    let query = supabase
      .from('availability_slots')
      .select('*')
      .eq('is_cancelled', false)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (start) query = query.gte('date', start);
    if (end) query = query.lte('date', end);

    const { data: slots, error } = await query;

    if (error) {
      console.error('Error fetching availability:', error);
      return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Error in GET /api/admin/availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    if (body.bulk) {
      // Bulk slot creation
      const { date, start_from, start_until, interval_minutes, duration_minutes } = body;

      if (!date || !start_from || !start_until || !interval_minutes) {
        return NextResponse.json({ error: 'Missing required bulk fields' }, { status: 400 });
      }

      const slots = generateTimeSlots(date, start_from, start_until, interval_minutes, duration_minutes || 30);

      if (slots.length === 0) {
        return NextResponse.json({ error: 'No slots generated — check start/end times' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('availability_slots')
        .upsert(slots, { onConflict: 'date,start_time', ignoreDuplicates: true })
        .select();

      if (error) {
        console.error('Error creating bulk slots:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ slots: data, created: data?.length ?? 0 });
    } else {
      // Single slot creation
      const { date, start_time, duration_minutes } = body;

      if (!date || !start_time) {
        return NextResponse.json({ error: 'Missing date or start_time' }, { status: 400 });
      }

      const { data: slot, error } = await supabase
        .from('availability_slots')
        .insert({ date, start_time: normalizeTime(start_time), duration_minutes: duration_minutes || 30 })
        .select()
        .single();

      if (error) {
        console.error('Error creating slot:', error);
        // 23505 = unique_violation (slot already exists for this date+time)
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Já existe um horário cadastrado para este dia e horário' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ slot });
    }
  } catch (error) {
    console.error('Error in POST /api/admin/availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────

function normalizeTime(time: string): string {
  // Ensure HH:MM:SS format
  if (time.length === 5) return `${time}:00`;
  return time;
}

function generateTimeSlots(
  date: string,
  startFrom: string,
  startUntil: string,
  breakMinutes: number,
  durationMinutes: number
): Array<{ date: string; start_time: string; duration_minutes: number }> {
  const slots = [];

  const [startH, startM] = startFrom.split(':').map(Number);
  const [endH, endM] = startUntil.split(':').map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const stepMinutes = durationMinutes + breakMinutes;

  if (stepMinutes <= 0 || durationMinutes <= 0) {
    return slots;
  }

  while (currentMinutes + durationMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const m = (currentMinutes % 60).toString().padStart(2, '0');
    slots.push({ date, start_time: `${h}:${m}:00`, duration_minutes: durationMinutes });
    currentMinutes += stepMinutes;
  }

  return slots;
}
