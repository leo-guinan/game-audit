import { NextResponse } from "next/server";
import { getEpisodesByGameData, getBoundaryEpisodesData, useLiveDb } from "@/lib/metaspn-data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game");
  const boundary = searchParams.get("boundary");
  if (game) {
    try {
      const data = getEpisodesByGameData(game);
      return NextResponse.json({
        source: useLiveDb() ? "db" : "test-data",
        filter: "game",
        game,
        episodes: data,
      });
    } catch (e) {
      console.error("GET /api/metaspn/episodes?game=", e);
      return NextResponse.json({ error: "Failed to load episodes by game" }, { status: 500 });
    }
  }
  if (boundary === "1" || boundary === "true") {
    try {
      const data = getBoundaryEpisodesData();
      return NextResponse.json({
        source: useLiveDb() ? "db" : "test-data",
        filter: "boundary",
        episodes: data,
      });
    } catch (e) {
      console.error("GET /api/metaspn/episodes?boundary=", e);
      return NextResponse.json({ error: "Failed to load boundary episodes" }, { status: 500 });
    }
  }
  return NextResponse.json(
    { error: "Query param 'game' or 'boundary=1' required" },
    { status: 400 }
  );
}
