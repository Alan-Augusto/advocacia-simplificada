import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('*')
      .order('type', { ascending: false }); // base first, then service

    if (error) {
      console.error('Error fetching prompts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch prompts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error in GET /api/admin/prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, service_code, content } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: prompt, error } = await supabase
      .from('prompts')
      .upsert({
        type,
        service_code: type === 'service' ? service_code : null,
        content,
        is_active: true
      }, {
        onConflict: 'type,service_code'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving prompt:', error);
      return NextResponse.json(
        { error: 'Failed to save prompt' },
        { status: 500 }
      );
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error in POST /api/admin/prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
