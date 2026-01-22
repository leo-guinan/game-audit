import { NextResponse } from "next/server";
import { getAllPodcastsData, useLiveDb } from "@/lib/metaspn-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getAllPodcastsData();
    return NextResponse.json({
      source: useLiveDb() ? "db" : "test-data",
      podcasts: data,
    });
  } catch (e) {
    console.error("GET /api/metaspn/podcasts", e);
    return NextResponse.json({ error: "Failed to load podcasts" }, { status: 500 });
  }
}
