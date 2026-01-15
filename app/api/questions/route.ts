import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../db";

export async function GET(req: NextRequest) {
  const db = await openDb();
  const per_page = 10;
  const page = parseInt(req.nextUrl.searchParams.get("_page") as string) || 1;
  const order = (req.nextUrl.searchParams.get("order_by") as string) || "";
  const category = req.nextUrl.searchParams.get("category") as string;
  const rank = req.nextUrl.searchParams.get("rank") as string;
  const offset = (page - 1) * per_page;
  let whereClause = "where ";
  if (category !== "all") {
    whereClause += `category = '${category}' `;
  }
  if (rank !== "all") {
    const and = whereClause == "where " ? "" : "and ";

    whereClause += `${and}rank = '${rank}' `;
  }
  if (category === "all" && rank === "all") {
    whereClause = "";
  }

  const questions = await db.all(
    `select *, count(*) over () as total_questions from questions ${whereClause}order by ${order} limit ? offset ?`,
    [per_page, offset],
  );
  const total = questions.length > 0 ? questions[0].total_questions : 0;
  const response = {
    data: questions,
    pages: Math.ceil(total / per_page) -1,
  };

  return NextResponse.json(response);
}
