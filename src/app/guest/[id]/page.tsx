import { use } from "react";
import { notFound } from "next/navigation";
import { GuestPageClient } from "./guest-page-client";
import { loadGuestData } from "@/lib/static-data/loader";
import { generateMockGuestData } from "@/lib/mock-data/metaspn";
import type { GuestPageResponse } from "@/lib/types/metaspn";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all guests at build time
export async function generateStaticParams() {
  try {
    const { loadGuestsData } = await import("@/lib/static-data/loader");
    const guests = loadGuestsData();
    return guests.map((g) => ({
      id: g.guest.id,
    }));
  } catch (error) {
    console.error("Error generating static params for guests:", error);
    return [];
  }
}

// Fetch data server-side
async function getGuestData(id: string): Promise<GuestPageResponse | null> {
  // Try static data first
  const staticData = loadGuestData(id);
  if (staticData) {
    return {
      guest: staticData.guest,
      metrics: staticData.metrics,
      appearances: staticData.appearances,
      episodes: staticData.episodes,
    };
  }

  // Fall back to mock data
  return generateMockGuestData(id);
}

export default async function GuestPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getGuestData(id);

  if (!data) {
    notFound();
  }

  return <GuestPageClient data={data} />;
}
