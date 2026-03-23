import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slot_id, lead_id, lead_name, lead_phone, lead_service, lead_code } = body;

    if (!slot_id || !lead_id || !lead_name || !lead_phone || !lead_service || !lead_code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient();

    // Optimistic lock: mark slot as booked only if it's still available
    const { data: updatedSlots, error: slotError } = await supabase
      .from('availability_slots')
      .update({ is_booked: true })
      .eq('id', slot_id)
      .eq('is_booked', false)
      .eq('is_cancelled', false)
      .select();

    if (slotError) {
      console.error('Error updating slot:', slotError);
      return NextResponse.json({ error: 'Failed to reserve slot' }, { status: 500 });
    }

    if (!updatedSlots || updatedSlots.length === 0) {
      return NextResponse.json({ error: 'Slot already booked or unavailable' }, { status: 409 });
    }

    // Create appointment
    const { data: appointment, error: apptError } = await supabase
      .from('appointments')
      .insert({
        slot_id,
        lead_id,
        lead_name,
        lead_phone,
        lead_service,
        lead_code,
        status: 'scheduled',
      })
      .select()
      .single();

    if (apptError) {
      // Roll back slot booking on appointment creation failure
      await supabase
        .from('availability_slots')
        .update({ is_booked: false })
        .eq('id', slot_id);

      console.error('Error creating appointment:', apptError);
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    // Update lead status to 'agendado'
    await supabase
      .from('leads')
      .update({ status: 'agendado' })
      .eq('id', lead_id);

    return NextResponse.json({ appointment, slot: updatedSlots[0] });
  } catch (error) {
    console.error('Error in POST /api/appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
