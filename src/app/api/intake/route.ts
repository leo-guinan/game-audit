import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, platform, workLink, clarityFocus, whyNow, auditType } = body;

    // Validate required fields
    if (!name || !platform || !workLink || !clarityFocus || !whyNow) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Postgres
    const result = await sql`
      INSERT INTO intake_submissions (
        name,
        platform,
        work_link,
        clarity_focus,
        why_now,
        audit_type,
        created_at
      ) VALUES (
        ${name},
        ${platform},
        ${workLink},
        ${clarityFocus},
        ${whyNow},
        ${auditType || 'Game Audit'},
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to save intake data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
