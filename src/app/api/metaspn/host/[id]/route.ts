import { NextRequest, NextResponse } from "next/server";
import { generateMockHostData } from "@/lib/mock-data/metaspn";
import { loadHostData } from "@/lib/static-data/loader";
import type { HostPageResponse } from "@/lib/types/metaspn";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Try static data first
    const staticData = loadHostData(id);
    if (staticData) {
      const response: HostPageResponse = {
        host: staticData.host,
        metrics: staticData.metrics,
        episodes_geometry: [], // Would need to be loaded separately
        episodes_experience: [], // Would need to be loaded separately
        top_guests: [], // Would need to be calculated
      };
      return NextResponse.json(response);
    }

    // Fall back to mock data
    const mockData = generateMockHostData(id);
    if (mockData) {
      return NextResponse.json(mockData);
    }

    return NextResponse.json(
      { error: "Host not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching host data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
