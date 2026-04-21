import { NextRequest, NextResponse } from 'next/server';
import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '@/lib/db';

interface DealRow extends RowDataPacket {
  id: number;
  clientName: string;
  propertyId: number;
  stage: string;
  value: number;
  commission: number;
}

export async function GET() {
  try {
    const db = getDbPool();
    const [rows] = await db.query<DealRow[]>(`SELECT * FROM Deals ORDER BY id DESC`);

    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch deals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, propertyId, value } = body as {
      clientName?: string;
      propertyId?: number;
      value?: number;
    };

    if (!clientName || !propertyId || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'clientName, propertyId, and value are required' },
        { status: 400 }
      );
    }

    const db = getDbPool();
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Deals (clientName, propertyId, stage, value, commission)
       VALUES (?, ?, 'Negotiation', ?, 0)`,
      [clientName.trim(), propertyId, value]
    );

    const [rows] = await db.query<DealRow[]>(`SELECT * FROM Deals WHERE id = ?`, [result.insertId]);

    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create deal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
