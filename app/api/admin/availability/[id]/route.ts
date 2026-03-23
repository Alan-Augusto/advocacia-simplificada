import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_cancelled } = body;

    if (is_cancelled === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = createClient();

    // Fetch the slot to check if it's booked
    const { data: slot, error: fetchError } = await supabase
      .from('availability_slots')
      .select('is_booked')
      .eq('id', id)
      .single();

    if (fetchError || !slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    // If cancelling a booked slot, also cancel its appointment and revert lead status
    if (is_cancelled && slot.is_booked) {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('id, lead_id')
        .eq('slot_id', id)
        .eq('status', 'scheduled')
        .single();

      if (appointment) {
        await supabase
          .from('appointments')
          .update({ status: 'cancelled' })
          .eq('id', appointment.id);

        if (appointment.lead_id) {
          await supabase
            .from('leads')
            .update({ status: 'quente' })
            .eq('id', appointment.lead_id);
        }
      }
    }

    const { data: updated, error } = await supabase
      .from('availability_slots')
      .update({ is_cancelled })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating slot:', error);
      return NextResponse.json({ error: 'Failed to update slot' }, { status: 500 });
    }

    return NextResponse.json({ slot: updated });
  } catch (error) {
    console.error('Error in PATCH /api/admin/availability/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    // Only allow deletion of unbooked slots
    const { data: slot, error: fetchError } = await supabase
      .from('availability_slots')
      .select('is_booked')
      .eq('id', id)
      .single();

    if (fetchError || !slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    if (slot.is_booked) {
      return NextResponse.json(
        { error: 'Cannot delete a booked slot — cancel the appointment first' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('availability_slots')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting slot:', error);
      return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/availability/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
