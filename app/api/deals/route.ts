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

    const [rows] = await db.query<DealRow[]>(
      `SELECT id, clientName, propertyId, stage, value, commission
       FROM deals
       ORDER BY id DESC`
    );

    return NextResponse.json(rows); // ✅ return direct array
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, propertyId, value } = body;

    if (!clientName || !propertyId || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'clientName, propertyId, and value are required' },
        { status: 400 }
      );
    }

    const db = getDbPool();

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO deals (clientName, propertyId, stage, value, commission)
       VALUES (?, ?, 'Negotiation', ?, 0)`,
      [clientName.trim(), propertyId, value]
    );

    const [rows] = await db.query<DealRow[]>(
      `SELECT id, clientName, propertyId, stage, value, commission
       FROM deals
       WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 }); // ✅ no "data"
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}