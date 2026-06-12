import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = createAdminClient();

    const { data: service, error } = await supabase
      .from('services')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return NextResponse.json(
        { error: 'Failed to update service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error in PATCH /api/admin/services/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // 1. Fetch the service to get its code
    const { data: service, error: fetchError } = await supabase
      .from('services')
      .select('code')
      .eq('id', id)
      .single();

    if (fetchError || !service) {
      console.error('Error fetching service for deletion:', fetchError);
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // 2. Delete the associated prompt if it exists
    if (service.code) {
      const { error: promptError } = await supabase
        .from('prompts')
        .delete()
        .eq('type', 'service')
        .eq('service_code', service.code);

      if (promptError) {
        console.error('Error deleting associated prompt:', promptError);
        // Note: We continue to delete the service even if prompt deletion fails
      }
    }

    // 3. Hard delete the service
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/services/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
