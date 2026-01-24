import { NextRequest, NextResponse } from "next/server";
import { generateMockGuestData } from "@/lib/mock-data/metaspn";
import { loadGuestData } from "@/lib/static-data/loader";
import type { GuestPageResponse } from "@/lib/types/metaspn";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Try static data first
    const staticData = loadGuestData(id);
    if (staticData) {
      const response: GuestPageResponse = {
        guest: staticData.guest,
        metrics: staticData.metrics,
        appearances: staticData.appearances,
        episodes: staticData.episodes,
      };
      return NextResponse.json(response);
    }

    // Fall back to mock data
    const mockData = generateMockGuestData(id);
    if (mockData) {
      return NextResponse.json(mockData);
    }

    return NextResponse.json(
      { error: "Guest not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching guest data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
