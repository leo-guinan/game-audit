import { NextResponse } from "next/server";

/**
 * Placeholder subscribe endpoint for The Creator Game email course.
 * Replace with ConvertKit (or other) integration.
 * Expects: { email: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // TODO: ConvertKit (or similar) integration for Creator Game sequence
    console.log("[creator-game] Subscribe (placeholder):", email);

    return NextResponse.json({
      ok: true,
      message: "Check your inbox for Day 1.",
    });
  } catch (e) {
    console.error("[creator-game] Subscribe error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
