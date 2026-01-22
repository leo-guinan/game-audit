import { NextResponse } from "next/server";
import { subscribeToConvertKit } from "@/lib/convertkit";

/**
 * Subscribe to Coordination Game newsletter via ConvertKit
 * Expects: { email: string, path?: string, games_played?: string, last_node?: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const path = typeof body?.path === "string" ? body.path : "";
    const gamesPlayed = typeof body?.games_played === "string" ? body.games_played : "";
    const lastNode = typeof body?.last_node === "string" ? body.last_node : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Subscribe to ConvertKit with custom fields
    const fields: Record<string, string> = {};
    if (path) fields.game_path = path;
    if (body.path_signature) fields.path_signature = body.path_signature;
    if (gamesPlayed) fields.games_played = gamesPlayed;
    if (lastNode) fields.last_game_node = lastNode;
    if (body.primary_game) fields.primary_game = String(body.primary_game);
    if (body.entry_position) fields.entry_position = body.entry_position;
    if (body.engagement_pattern) fields.engagement_pattern = body.engagement_pattern;
    fields.subscription_source = "coordination_game";
    
    // Store full journey data (could be in a separate field or database)
    // For now, we'll store the signature which is the compressed version

    const result = await subscribeToConvertKit({
      email,
      fields: Object.keys(fields).length > 0 ? fields : undefined,
    });

    if ("error" in result) {
      console.error("[coordination-game] ConvertKit error:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log("[coordination-game] Subscribed:", email, "Path:", path);

    return NextResponse.json({
      ok: true,
      message: "Check your inbox to confirm.",
      subscriber_id: result.subscriber_id,
    });
  } catch (e) {
    console.error("[coordination-game] Subscribe error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
