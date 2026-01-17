import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const episodes = [
  {
    id: "bill-gates",
    title: "Founders — Bill Gates",
    game: "G1", // Identity/Canon
    nativeGames: ["G2", "G3"],
    premise: "How fanatical focus and obsession shaped Microsoft's early days",
    category: "founders",
    file: "bill_gates.md",
  },
  {
    id: "james-dyson",
    title: "Founders — James Dyson",
    game: "G1",
    nativeGames: ["G2", "G4"],
    premise: "The relentless iteration process behind breakthrough innovation",
    category: "founders",
    file: "james_dyson.md",
  },
  {
    id: "jenny",
    title: "Creator Science — Audience Economics",
    game: "G2", // Idea Mining
    nativeGames: ["G3", "G5"],
    premise: "Understanding the real economics of building an audience",
    category: "creator_science",
    file: "jenny.md",
  },
  {
    id: "paul-millerd",
    title: "Creator Science — Distribution vs Leverage",
    game: "G3", // Model/Understanding
    nativeGames: ["G3", "G5"],
    premise: "Mental models for understanding leverage vs distribution strategies",
    category: "creator_science",
    file: "paul_millerd.md",
  },
  {
    id: "tommy",
    title: "Creator Science — Viral Content",
    game: "G2",
    nativeGames: ["G2", "G6"],
    premise: "Tactical approaches to creating shareable content",
    category: "creator_science",
    file: "tommy.md",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const episodeId = searchParams.get("id");

  if (episodeId) {
    // Get specific episode
    const episode = episodes.find((e) => e.id === episodeId);
    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    try {
      const filePath = path.join(
        process.cwd(),
        "src/app/api/intake/data",
        episode.category,
        episode.file
      );
      const content = fs.readFileSync(filePath, "utf-8");
      
      // Extract first ~2000 characters as sample
      const sample = content.substring(0, 2000);

      return NextResponse.json({
        ...episode,
        content: sample,
        fullContent: content,
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to load episode" },
        { status: 500 }
      );
    }
  }

  // Return all episodes
  return NextResponse.json(episodes);
}
