import { use } from "react";
import { notFound } from "next/navigation";
import { HostPageClient } from "./host-page-client";
import { loadHostData } from "@/lib/static-data/loader";
import { generateMockHostData } from "@/lib/mock-data/metaspn";
import type { HostPageResponse } from "@/lib/types/metaspn";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all hosts at build time
export async function generateStaticParams() {
  try {
    const { loadHostsData } = await import("@/lib/static-data/loader");
    const hosts = loadHostsData();
    return hosts.map((h) => ({
      id: h.host.id,
    }));
  } catch (error) {
    console.error("Error generating static params for hosts:", error);
    return [];
  }
}

// Fetch data server-side
async function getHostData(id: string): Promise<HostPageResponse | null> {
  // Try static data first
  const staticData = loadHostData(id);
  if (staticData) {
    // For now, return minimal data - episodes would need to be loaded from podcast data
    return {
      host: staticData.host,
      metrics: staticData.metrics,
      episodes_geometry: [], // Would need to be loaded separately from podcast episodes
      episodes_experience: [], // Would need to be loaded separately from podcast episodes
      top_guests: [], // Would need to be calculated from guest appearances
    };
  }

  // Fall back to mock data
  return generateMockHostData(id);
}

export default async function HostPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getHostData(id);

  if (!data) {
    notFound();
  }

  return <HostPageClient data={data} />;
}
