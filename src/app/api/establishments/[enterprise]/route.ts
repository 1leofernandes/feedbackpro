import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ enterprise: string }> }
) {
  try {
    const { enterprise } = await params;
    const session = await auth();

    // Verify user is authenticated and owns this enterprise
    if (!session?.user || session.user.enterprise !== enterprise) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all sectors for this enterprise
    const results = await query<{
      sector: string;
    }>(
      `SELECT DISTINCT sector FROM feedback WHERE enterprise = $1 ORDER BY sector`,
      [enterprise]
    );

    const sectors = results.map((r) => r.sector);

    // Get statistics for each sector
    const establishments = await Promise.all(
      sectors.map(async (sector) => {
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
          [enterprise, sector]
        );

        const stat = stats[0];
        return {
          sector,
          total_feedback: Number(stat.total),
          average_satisfaction: Number(stat.avg) || 0,
          very_dissatisfied: Number(stat.level_1),
          dissatisfied: Number(stat.level_2),
          indifferent: Number(stat.level_3),
          satisfied: Number(stat.level_4),
          very_satisfied: Number(stat.level_5),
        };
      })
    );

    // Calculate overall average
    const overall = await query<{
      avg: number;
    }>(
      `SELECT ROUND(AVG(satisfaction_level)::numeric, 2) as avg
       FROM feedback WHERE enterprise = $1`,
      [enterprise]
    );

    const overall_average = Number(overall[0]?.avg) || 0;

    return NextResponse.json({
      establishments,
      overall_average,
    });
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch establishments' },
      { status: 500 }
    );
  }
}
