import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!sql) {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }
    sql = postgres(DATABASE_URL);
  }
  return sql;
}

/**
 * Executa uma query SQL e retorna um array de resultados.
 * Use esta função quando precisar de tipagem específica (ex: query<MeuTipo>).
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[]
): Promise<T[]> {
  const db = getDb();
  try {
    const result = await db.unsafe<T[]>(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function closeDb() {
  if (sql) {
    await sql.end();
    sql = null;
  }
}