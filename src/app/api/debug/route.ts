import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  // This is a debug endpoint - only enable in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Debug endpoint only available in development' }, { status: 403 });
  }

  try {
    // Test database connection
    const testConnection = await query('SELECT NOW() as time');
    
    // Get all users
    const users = await query<{ id: number; email: string; name: string; enterprise: string }>(
      'SELECT id, email, name, enterprise FROM users'
    );

    // Get feedback stats
    const feedbackStats = await query<{ enterprise: string; sector: string; count: number }>(
      `SELECT enterprise, sector, COUNT(*) as count 
       FROM feedback 
       GROUP BY enterprise, sector`
    );

    return NextResponse.json({
      status: 'ok',
      database: {
        connected: true,
        currentTime: testConnection[0]?.time || 'N/A',
      },
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        enterprise: u.enterprise,
      })),
      feedbackStatistics: feedbackStats.map(fs => ({
        enterprise: fs.enterprise,
        sector: fs.sector,
        totalFeedback: fs.count,
      })),
    });
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure DATABASE_URL is set correctly in .env.local',
      },
      { status: 500 }
    );
  }
}
