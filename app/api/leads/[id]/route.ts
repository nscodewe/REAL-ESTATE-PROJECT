import { NextRequest, NextResponse } from 'next/server';
import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '@/lib/db';

interface LeadRow extends RowDataPacket {
  id: number;
  name: string;
  phone: string;
  email: string;
  budget: number | null;
  status: string;
  assignedTo: string | null;
}

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await context.params;
    const id = parseId(idParam);
    if (!id) {
      return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
    }

    const body = await request.json();
    const { status, assignedTo } = body as {
      status?: string;
      assignedTo?: string | null;
    };

    const updates: string[] = [];
    const values: Array<string | number | null> = [];

    if (typeof assignedTo !== 'undefined') {
      updates.push('assignedTo = ?');
      values.push(assignedTo && assignedTo.trim().length > 0 ? assignedTo.trim() : null);
      if (!status) {
        updates.push('status = ?');
        values.push('Contacted');
      }
    }

    if (typeof status !== 'undefined') {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const db = getDbPool();
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const [rows] = await db.query<LeadRow[]>(
      `SELECT * FROM leads WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await context.params;
    const id = parseId(idParam);
    if (!id) {
      return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
    }

    const db = getDbPool();
    const [result] = await db.query<ResultSetHeader>(`DELETE FROM leads WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
