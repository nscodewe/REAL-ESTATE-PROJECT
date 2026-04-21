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

const VALID_STAGES = new Set(['Negotiation', 'Agreement', 'Closed']);

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await context.params;
    const id = parseId(idParam);
    if (!id) {
      return NextResponse.json({ error: 'Invalid deal id' }, { status: 400 });
    }

    const body = await request.json();
    const { stage } = body as { stage?: string };

    if (!stage || !VALID_STAGES.has(stage)) {
      return NextResponse.json(
        { error: 'Valid stage is required: Negotiation, Agreement, or Closed' },
        { status: 400 }
      );
    }

    const db = getDbPool();
    const [existingRows] = await db.query<DealRow[]>(
      `SELECT * FROM Deals WHERE id = ?`,
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const existing = existingRows[0];
    const commission = stage === 'Closed' ? Number(existing.value) * 0.02 : Number(existing.commission);

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE Deals SET stage = ?, commission = ? WHERE id = ?`,
      [stage, commission, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    if (stage === 'Closed') {
      await db.query<ResultSetHeader>(
        `UPDATE Leads SET status = 'Closed' WHERE LOWER(name) = LOWER(?)`,
        [existing.clientName]
      );
    }

    const [rows] = await db.query<DealRow[]>(
      `SELECT * FROM Deals WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update deal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
