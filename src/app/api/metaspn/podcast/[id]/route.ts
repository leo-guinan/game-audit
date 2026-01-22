import { NextResponse } from "next/server";
import { getPodcastOverview, useLiveDb } from "@/lib/metaspn-data";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const data = getPodcastOverview(id);
    if (!data) return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    return NextResponse.json({
      source: useLiveDb() ? "db" : "test-data",
      ...data,
    });
  } catch (e) {
    console.error("GET /api/metaspn/podcast/[id]", e);
    return NextResponse.json({ error: "Failed to load podcast" }, { status: 500 });
  }
}
