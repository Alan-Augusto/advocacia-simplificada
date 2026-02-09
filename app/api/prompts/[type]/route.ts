import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const supabase = createClient();

    if (type === 'base') {
      // Get base prompt
      const { data: prompt, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'base')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching base prompt:', error);
        return NextResponse.json(
          { error: 'Base prompt not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ prompt });
    } else {
      // Get service prompt by service code
      const { data: prompt, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'service')
        .eq('service_code', type)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching service prompt:', error);
        return NextResponse.json(
          { error: 'Service prompt not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ prompt });
    }
  } catch (error) {
    console.error('Error in GET /api/prompts/[type]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
