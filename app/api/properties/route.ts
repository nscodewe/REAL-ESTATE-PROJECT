import { NextRequest, NextResponse } from 'next/server';
import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '@/lib/db';

interface PropertyRow extends RowDataPacket {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
}

export async function GET() {
  try {
    const db = getDbPool();
    const [rows] = await db.query<PropertyRow[]>(
      `SELECT *
       FROM Properties
       ORDER BY id DESC`
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch properties', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, price, type } = body as {
      title?: string;
      location?: string;
      price?: number;
      type?: string;
    };

    if (!title || !location || typeof price !== 'number' || !type) {
      return NextResponse.json(
        { error: 'title, location, price, and type are required' },
        { status: 400 }
      );
    }

    const db = getDbPool();
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Properties (title, location, price, type)
       VALUES (?, ?, ?, ?)`,
      [title.trim(), location.trim(), price, type.trim()]
    );

    const [rows] = await db.query<PropertyRow[]>(
      `SELECT * FROM Properties WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create property', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
