import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    if (!status && notes === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = createClient();

    // Fetch the appointment to get slot_id and lead_id
    const { data: existing, error: fetchError } = await supabase
      .from('appointments')
      .select('slot_id, lead_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const updatePayload: Record<string, string> = {};
    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }

    // If cancelling, free the slot and revert lead status to 'quente'
    if (status === 'cancelled' && existing.status !== 'cancelled') {
      await supabase
        .from('availability_slots')
        .update({ is_booked: false })
        .eq('id', existing.slot_id);

      if (existing.lead_id) {
        await supabase
          .from('leads')
          .update({ status: 'quente' })
          .eq('id', existing.lead_id);
      }
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Error in PATCH /api/admin/appointments/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
