import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ enterprise: string; establishment: string }>;
  }
) {
  try {
    const { enterprise, establishment } = await params;
    const session = await auth();

    // Verify user is authenticated and owns this enterprise
    if (!session?.user || session.user.enterprise !== enterprise) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get statistics for this establishment
    const stats = await query<{
      total: number;
      avg: number;
      level_1: number;
      level_2: number;
      level_3: number;
      level_4: number;
      level_5: number;
    }>(
      `SELECT
        COUNT(*) as total,
        ROUND(AVG(satisfaction_level)::numeric, 2) as avg,
        COUNT(CASE WHEN satisfaction_level = 1 THEN 1 END) as level_1,
        COUNT(CASE WHEN satisfaction_level = 2 THEN 1 END) as level_2,
        COUNT(CASE WHEN satisfaction_level = 3 THEN 1 END) as level_3,
        COUNT(CASE WHEN satisfaction_level = 4 THEN 1 END) as level_4,
        COUNT(CASE WHEN satisfaction_level = 5 THEN 1 END) as level_5
      FROM feedback
      WHERE enterprise = $1 AND sector = $2`,
      [enterprise, establishment]
    );

    const stat = stats[0];

    // Get feedback by date (last 7 days)
    const feedback_by_date = await query<{
      date: string;
      count: number;
    }>(
      `SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM feedback
      WHERE enterprise = $1 AND sector = $2 AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC`,
      [enterprise, establishment]
    );

    return NextResponse.json({
      total_feedback: Number(stat.total),
      average_satisfaction: Number(stat.avg) || 0,
      very_dissatisfied: Number(stat.level_1),
      dissatisfied: Number(stat.level_2),
      indifferent: Number(stat.level_3),
      satisfied: Number(stat.level_4),
      very_satisfied: Number(stat.level_5),
      feedback_by_date: feedback_by_date.map((f) => ({
        date: f.date,
        count: Number(f.count),
      })),
    });
  } catch (error) {
    console.error('Error fetching establishment detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch establishment details' },
      { status: 500 }
    );
  }
}
