import { NextResponse } from "next/server";
import { getPodcastGuestAppearances } from "@/lib/static-data/loader";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const appearances = getPodcastGuestAppearances(id);
    // Group by episode_id
    const byEpisode = new Map<string, string[]>();
    appearances.forEach(appearance => {
      const existing = byEpisode.get(appearance.episode_id) || [];
      byEpisode.set(appearance.episode_id, [...existing, appearance.guest_name]);
    });
    
    // Convert to object for JSON
    const result: Record<string, string[]> = {};
    byEpisode.forEach((names, episodeId) => {
      result[episodeId] = names;
    });
    
    return NextResponse.json({
      podcast_id: id,
      guest_appearances: result,
    });
  } catch (e) {
    console.error("GET /api/metaspn/podcast/[id]/guests", e);
    return NextResponse.json({ error: "Failed to load guest appearances" }, { status: 500 });
  }
}
