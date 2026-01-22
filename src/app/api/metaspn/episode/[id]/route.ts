import { NextResponse } from "next/server";
import { getEpisodeData, useLiveDb } from "@/lib/metaspn-data";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  try {
    const data = getEpisodeData(decodedId);
    if (!data) return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    return NextResponse.json({
      source: useLiveDb() ? "db" : "test-data",
      ...data,
    });
  } catch (e) {
    console.error("GET /api/metaspn/episode/[id]", e);
    return NextResponse.json({ error: "Failed to load episode" }, { status: 500 });
  }
}
