import { NextResponse } from "next/server";
import { getEpisodesByGameData, getBoundaryEpisodesData, useLiveDb } from "@/lib/metaspn-data";
import { getEpisodesByPodcast } from "@/lib/podcast-db";
import { mapEpisode } from "@/lib/podcast-db/map-to-metaspn";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game");
  const boundary = searchParams.get("boundary");
  const podcastId = searchParams.get("podcast_id");
  
  if (podcastId) {
    try {
      if (useLiveDb()) {
        const episodes = getEpisodesByPodcast(podcastId);
        return NextResponse.json({
          source: "db",
          filter: "podcast_id",
          podcast_id: podcastId,
          episodes: episodes.map(mapEpisode),
        });
      } else {
        // For test data, return empty array (episodes not in test data structure)
        return NextResponse.json({
          source: "test-data",
          filter: "podcast_id",
          podcast_id: podcastId,
          episodes: [],
        });
      }
    } catch (e) {
      console.error("GET /api/metaspn/episodes?podcast_id=", e);
      return NextResponse.json({ error: "Failed to load episodes by podcast" }, { status: 500 });
    }
  }
  
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
    { error: "Query param 'game', 'boundary=1', or 'podcast_id' required" },
    { status: 400 }
  );
}
