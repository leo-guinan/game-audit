import { NextResponse } from "next/server";
import { getCompareData, useLiveDb } from "@/lib/metaspn-data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const podcast1 = searchParams.get("podcast1");
  const podcast2 = searchParams.get("podcast2");
  if (!podcast1 || !podcast2) {
    return NextResponse.json(
      { error: "Query params podcast1 and podcast2 required" },
      { status: 400 }
    );
  }
  try {
    const data = getCompareData(podcast1, podcast2);
    if (!data) return NextResponse.json({ error: "Compare data not found" }, { status: 404 });
    return NextResponse.json({
      source: useLiveDb() ? "db" : "test-data",
      ...data,
    });
  } catch (e) {
    console.error("GET /api/metaspn/compare", e);
    return NextResponse.json({ error: "Failed to load compare" }, { status: 500 });
  }
}
