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

async function fetchLeads(status: string | null, page: number, pageSize: number) {
  const db = getDbPool();
  const whereClause = status ? 'WHERE status = ?' : '';
  const params: Array<string | number> = status ? [status] : [];
  const offset = (page - 1) * pageSize;

  const [rows] = await db.query<LeadRow[]>(
    `SELECT *
     FROM Leads
     ${whereClause}
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  const [countRows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM Leads ${whereClause}`,
    params
  );

  return {
    data: rows,
    pagination: {
      page,
      pageSize,
      total: Number(countRows[0]?.total || 0),
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');
    const page = Math.max(Number(request.nextUrl.searchParams.get('page') || 1), 1);
    const pageSize = Math.min(Math.max(Number(request.nextUrl.searchParams.get('pageSize') || 20), 1), 100);
    const result = await fetchLeads(status, page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, budget } = body as {
      name?: string;
      phone?: string;
      email?: string;
      budget?: number | null;
    };

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'name, phone, and email are required' }, { status: 400 });
    }

    const db = getDbPool();
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Leads (name, phone, email, budget, status, assignedTo)
       VALUES (?, ?, ?, ?, 'New', NULL)`,
      [name.trim(), phone.trim(), email.trim(), budget ?? null]
    );

    const [rows] = await db.query<LeadRow[]>(
      `SELECT * FROM Leads WHERE id = ?`,
      [result.insertId]
    );
    try{
      await fetch("https://agnayi2026.app.n8n.cloud/webhook/new-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          budget
        })
      });
    }catch(error){
      console.error('Error triggering n8n webhook:', error);
    };
    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
