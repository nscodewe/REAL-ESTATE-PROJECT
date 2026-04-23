import { NextRequest, NextResponse } from 'next/server';
import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '@/lib/db';

interface PropertyRow extends RowDataPacket {
  id: number;
  title: string;
  location: string;
  price: number;
}

export async function GET() {
  try {
    const db = getDbPool();

    const [rows] = await db.query<PropertyRow[]>(
      `SELECT id, title, location, price
       FROM properties
       ORDER BY id DESC`
    );

    return NextResponse.json(rows); // ✅ return direct array
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, price } = body;

    if (!title || !location || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'title, location, and price are required' },
        { status: 400 }
      );
    }

    const db = getDbPool();

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO properties (title, location, price)
       VALUES (?, ?, ?)`,
      [title.trim(), location.trim(), price]
    );

    const [rows] = await db.query<PropertyRow[]>(
      `SELECT id, title, location, price
       FROM properties
       WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}