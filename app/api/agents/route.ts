import { NextResponse } from 'next/server';
import { type RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '@/lib/db';
import { dummyUsers } from '@/lib/dummy-data';

interface AgentRow extends RowDataPacket {
  id: number | string;
  name: string;
  email?: string | null;
}

type AgentDto = {
  id: string;
  name: string;
  email: string | null;
};

function normalizeAgents(rows: AgentRow[]): AgentDto[] {
  return rows.map((row) => ({
    id: String(row.id),
    name: row.name,
    email: row.email ?? null,
  }));
}

export async function GET() {
  const db = getDbPool();

  try {
    const [rows] = await db.query<AgentRow[]>(
      `SELECT id, name, email
       FROM Agents
       ORDER BY name ASC`
    );

    return NextResponse.json({ data: normalizeAgents(rows) });
  } catch {
    try {
      const [rows] = await db.query<AgentRow[]>(
        `SELECT id, name, email
         FROM Users
         WHERE role = 'agent'
         ORDER BY name ASC`
      );

      return NextResponse.json({ data: normalizeAgents(rows) });
    } catch {
      const fallbackAgents = Object.values(dummyUsers)
        .filter((user) => user.role === 'agent')
        .map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }));

      return NextResponse.json({ data: fallbackAgents });
    }
  }
}
