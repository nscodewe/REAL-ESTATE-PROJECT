import mysql, { type Pool, type PoolConnection } from 'mysql2/promise';

let pool: Pool | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDbPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: getRequiredEnv('DB_HOST'),
      user: getRequiredEnv('DB_USER'),
      password: getRequiredEnv('DB_PASSWORD'),
      database: process.env.DB_NAME || 'crm_db',
      port: Number(process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
      queueLimit: 0,
    });
  }

  return pool;
}

export async function withTransaction<T>(
  action: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getDbPool().getConnection();

  try {
    await connection.beginTransaction();
    const result = await action(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
