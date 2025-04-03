import { NextRequest, NextResponse } from "next/server";
import { openDb } from '../db'

export async function GET(req: NextRequest) {
    const db = await openDb();
    const per_page = 10;
    const page = parseInt(req.nextUrl.searchParams.get('_page') as string) | 1;
    const offset = (page - 1) * per_page;
    const questions = await db.all('select * from questions limit ? offset ?', [per_page, offset]);
    const { total } = await db.get('select count(*) as total from questions');
    const response = {
        data: questions,
        pages: Math.ceil(total / per_page)
    }
    return NextResponse.json(response);
}