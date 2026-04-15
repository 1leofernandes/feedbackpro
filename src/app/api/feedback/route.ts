import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enterprise, sector, satisfaction_level } = body;

    // Validate required fields
    if (!enterprise || !sector || !satisfaction_level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate satisfaction_level is between 1 and 5
    if (
      typeof satisfaction_level !== 'number' ||
      satisfaction_level < 1 ||
      satisfaction_level > 5
    ) {
      return NextResponse.json(
        { error: 'Invalid satisfaction level' },
        { status: 400 }
      );
    }

    // Insert feedback into database
    await query(
      `INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [enterprise, sector, satisfaction_level]
    );

    return NextResponse.json(
      { message: 'Feedback saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
