import { NextRequest, NextResponse } from 'next/server';
import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { getDbPool, withTransaction } from '@/lib/db';

interface ClientRow extends RowDataPacket {
  id: number;
  name: string;
  phone: string;
  email: string;
  leadId: number;
  createdAt: string;
}

interface LeadRow extends RowDataPacket {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export async function GET() {
  try {
    const db = getDbPool();
    const [rows] = await db.query<ClientRow[]>(
      `SELECT id, name, phone, email, leadId, createdAt
       FROM Clients
       ORDER BY id DESC`
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = body as { leadId?: number };

    if (!leadId || !Number.isInteger(Number(leadId))) {
      return NextResponse.json({ error: 'Valid leadId is required' }, { status: 400 });
    }

    const client = await withTransaction(async (connection) => {
      const [existing] = await connection.query<ClientRow[]>(
        `SELECT id, name, phone, email, leadId, createdAt FROM Clients WHERE leadId = ?`,
        [leadId]
      );

      if (existing.length > 0) {
        return existing[0];
      }

      const [leadRows] = await connection.query<LeadRow[]>(
        `SELECT id, name, phone, email FROM Leads WHERE id = ?`,
        [leadId]
      );

      if (leadRows.length === 0) {
        throw new Error('LEAD_NOT_FOUND');
      }

      const lead = leadRows[0];
      const [insertResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO Clients (name, phone, email, leadId)
         VALUES (?, ?, ?, ?)`,
        [lead.name, lead.phone, lead.email, lead.id]
      );

      const [clientRows] = await connection.query<ClientRow[]>(
        `SELECT id, name, phone, email, leadId, createdAt FROM Clients WHERE id = ?`,
        [insertResult.insertId]
      );

      return clientRows[0];
    });

    return NextResponse.json({ data: client }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'LEAD_NOT_FOUND') {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to create client', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
