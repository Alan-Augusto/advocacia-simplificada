import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateLeadCode } from '@/lib/utils/lead-code';
import type { Lead, LeadStatus } from '@/lib/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, service_id, service_title } = body;

    if (!name || !phone || !service_id || !service_title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Generate unique lead code
    let code = generateLeadCode();
    let isUnique = false;
    let attempts = 0;

    // Ensure code is unique
    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from('leads')
        .select('code')
        .eq('code', code)
        .single();

      if (!existing) {
        isUnique = true;
      } else {
        code = generateLeadCode();
        attempts++;
      }
    }

    // Create lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        code,
        name,
        phone,
        service_id,
        service_title,
        status: 'em_andamento',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error in POST /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as LeadStatus | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient();

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('last_message_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,phone.ilike.%${search}%,code.ilike.%${search}%`
      );
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    // Get stats (excluding deleted leads)
    const { data: statsData } = await supabase
      .from('leads')
      .select('status')
      .is('deleted_at', null);

    const stats = {
      total: count || 0,
      quente: statsData?.filter((l) => l.status === 'quente').length || 0,
      em_andamento: statsData?.filter((l) => l.status === 'em_andamento').length || 0,
      conversao: statsData?.length
        ? Math.round(
            ((statsData.filter((l) => l.status === 'fechado').length || 0) / statsData.length) *
              100
          )
        : 0,
    };

    return NextResponse.json({
      leads,
      stats,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
