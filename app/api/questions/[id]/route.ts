import { NextRequest, NextResponse } from "next/server";
import { openDb } from '../../db'

export async function GET(req: NextRequest) {
    const db = await openDb();
    const id = req.nextUrl.pathname.split('/')[3];
    const question = await db.get('select * from questions where id = ?', [id]);
    return NextResponse.json(question);
}

export async function POST(req: NextRequest) {
    const db = await openDb();
    const { title, body, category, rank } = await req.json();
    await db.run('INSERT INTO questions(title, body, category, rank) VALUES (?, ?, ?, ?)', title, body, category, rank);
    return NextResponse.json({ message: 'Question created successfully' });
}

export async function PUT(req: NextRequest) {
    const db = await openDb();
    const id = req.nextUrl.pathname.split('/')[3];
    const { title, body, rank, category } = await req.json();
    await db.run('UPDATE questions SET title = ?, body = ?, rank = ?, category = ? WHERE id = ?', [title, body, rank, category, id]);
    return NextResponse.json({ message: 'Question updated successfully' });
}

export async function DELETE(req: NextRequest) {
    const db = await openDb();
    const id = req.nextUrl.pathname.split('/')[3];
    await db.run('delete from questions where id = ?', [id]);
    return NextResponse.json({ message: 'Question deleted successfully' });
}