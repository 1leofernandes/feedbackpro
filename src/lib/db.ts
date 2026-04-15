import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Create a singleton connection for the application
let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!sql) {
    sql = postgres(DATABASE_URL);
  }
  return sql;
}

// Helper to execute queries
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const db = getDb();
  try {
    const result = await db.unsafe(text, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Close database connection
export async function closeDb() {
  if (sql) {
    await sql.end();
    sql = null;
  }
}
