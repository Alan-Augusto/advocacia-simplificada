import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import type { Service } from '@/lib/types/database';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error in GET /api/admin/services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      title,
      description,
      tags,
      icon,
      color_class,
      order,
      initial_message,
    } = body;

    if (!code || !title || !description || !icon || !color_class || !initial_message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        code,
        title,
        description,
        tags: tags || [],
        icon,
        color_class,
        is_active: true,
        order: order || 999,
        initial_message,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error in POST /api/admin/services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { services } = body as { services: Array<{ id: string; order: number }> };

    if (!services || !Array.isArray(services)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Update order for each service
    const promises = services.map((service) =>
      supabase
        .from('services')
        .update({ order: service.order })
        .eq('id', service.id)
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/admin/services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
