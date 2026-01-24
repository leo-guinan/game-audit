"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Header from "@/components/header";
import { EpisodeList } from "@/components/metaspn/episode-list";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { GuestPageResponse, EpisodeGeometry, EpisodeExperience } from "@/lib/types/metaspn";
import { GAME_COLORS } from "@/lib/constants/game-colors";
import { getAllGuestIds } from "@/lib/static-data/generate-static-paths";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all guests at build time
export async function generateStaticParams() {
  try {
    const guestIds = getAllGuestIds();
    return guestIds.map((id) => ({
      id: id,
    }));
  } catch (error) {
    console.error("Error generating static params for guests:", error);
    return [];
  }
}

export default function GuestPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<GuestPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEpisodes, setShowEpisodes] = useState(false);

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setError(null);
    fetch(`/api/metaspn/guest/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!ok) return;
        if (d.error) {
          setError(d.error);
          setData(null);
        } else {
          setData(d);
        }
      })
      .catch((e) => {
        if (!ok) return;
        setError(String(e.message));
        setData(null);
      })
      .finally(() => {
        if (ok) setLoading(false);
      });
    return () => { ok = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
          <p className="text-muted-foreground">{error ?? "Guest not found"}</p>
        </div>
      </div>
    );
  }

  const { guest, metrics, appearances, episodes } = data;

  // Create mock geometry and experience for episode list
  const episodeListItems = episodes.map(ep => {
    const mockGeometry: EpisodeGeometry = {
      episode_id: ep.episode_id,
      pca: { pc1: 0, pc2: 0 },
      primary_game: ep.game_shift?.to ?? 'G2',
      margin: 0.5,
      boundary_flag: false,
      distances_to_manifolds: { G1: 1, G2: 1, G3: 1, G4: 1, G5: 1, G6: 1 },
    };
    const mockExperience: EpisodeExperience = {
      episode_id: ep.episode_id,
      experience_score: 70,
    };
    return {
      episode_id: ep.episode_id,
      geometry: mockGeometry,
      experience: mockExperience,
      title: ep.episode_title,
      is_guest_episode: true,
      guest_names: [guest.name],
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/discover" className="text-sm font-mono text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Back to Discover
          </Link>
          
          <div className="flex gap-6 items-start">
            {guest.image_url ? (
              <Image
                src={guest.image_url}
                alt={guest.name}
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[150px] h-[150px] bg-muted rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">
                  {guest.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{guest.name}</h1>
              {guest.bio && (
                <p className="text-muted-foreground mb-4">{guest.bio}</p>
              )}
              <div className="text-3xl font-bold font-mono text-primary">
                {appearances} Appearance{appearances !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="question-card mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Overview Stats</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Average Impact</div>
              <div className="text-2xl font-bold font-mono text-foreground">
                {metrics.avg_impact_magnitude.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Δ Entropy</div>
              <div className={`text-xl font-mono ${metrics.avg_delta_entropy >= 0 ? 'text-[#50c878]' : 'text-[#c41e3a]'}`}>
                {metrics.avg_delta_entropy >= 0 ? '+' : ''}{metrics.avg_delta_entropy.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Δ Drift</div>
              <div className={`text-xl font-mono ${metrics.avg_delta_drift >= 0 ? 'text-[#50c878]' : 'text-[#c41e3a]'}`}>
                {metrics.avg_delta_drift >= 0 ? '+' : ''}{metrics.avg_delta_drift.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Dominant Influence</div>
              <div
                className="text-xl font-bold font-mono"
                style={{ color: GAME_COLORS[metrics.dominant_game_influence] }}
              >
                {metrics.dominant_game_influence}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Breakdown */}
        <div className="question-card mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Impact Breakdown</h2>
          
          <div className="space-y-6">
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Games Shifted</div>
              <div className="text-lg font-mono text-foreground">
                {metrics.games_shifted_count} of {appearances} appearances ({((metrics.games_shifted_count / appearances) * 100).toFixed(1)}%)
              </div>
            </div>

            {/* Impact magnitude distribution (sparkline) */}
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Impact Over Time</div>
              <div className="h-32 border border-border bg-muted/20 p-4 flex items-end gap-1">
                {episodes.map((ep, idx) => {
                  const magnitude = Math.abs(ep.delta_entropy) + Math.abs(ep.delta_drift);
                  const maxMagnitude = Math.max(...episodes.map(e => Math.abs(e.delta_entropy) + Math.abs(e.delta_drift)), 0.1);
                  const height = (magnitude / maxMagnitude) * 100;
                  return (
                    <div
                      key={ep.episode_id}
                      className="flex-1 bg-primary"
                      style={{ height: `${height}%`, minHeight: '2px' }}
                      title={`Episode ${idx + 1}: ${magnitude.toFixed(2)}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Before/After comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-mono text-muted-foreground mb-2">Average Entropy Change</div>
                <div className={`text-2xl font-mono ${metrics.avg_delta_entropy >= 0 ? 'text-[#50c878]' : 'text-[#c41e3a]'}`}>
                  {metrics.avg_delta_entropy >= 0 ? '↑' : '↓'} {Math.abs(metrics.avg_delta_entropy).toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {metrics.avg_delta_entropy >= 0 ? 'Increases' : 'Decreases'} content variability
                </div>
              </div>
              <div>
                <div className="text-sm font-mono text-muted-foreground mb-2">Average Drift Change</div>
                <div className={`text-2xl font-mono ${metrics.avg_delta_drift >= 0 ? 'text-[#50c878]' : 'text-[#c41e3a]'}`}>
                  {metrics.avg_delta_drift >= 0 ? '↑' : '↓'} {Math.abs(metrics.avg_delta_drift).toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {metrics.avg_delta_drift >= 0 ? 'Increases' : 'Decreases'} deviation from host norm
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notable Hosts */}
        {metrics.top_hosts.length > 0 && (
          <div className="question-card mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Notable Hosts</h2>
            <div className="space-y-2">
              {metrics.top_hosts.map((host) => (
                <Link
                  key={host.host_id}
                  href={`/host/${encodeURIComponent(host.host_id)}`}
                  className="block p-4 border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">{host.host_name}</div>
                      <div className="text-sm text-muted-foreground">{host.appearances} appearance{host.appearances !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-sm font-mono text-primary">
                      Avg Impact: {host.avg_impact.toFixed(3)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Episodes Featuring This Guest */}
        {episodes.length > 0 && (
          <div className="question-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-foreground">Episodes Featuring This Guest</h2>
              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="text-sm font-mono text-primary hover:underline"
              >
                {showEpisodes ? 'Hide' : 'Show'} ({episodes.length})
              </button>
            </div>
            {showEpisodes && (
              <EpisodeList
                episodes={episodeListItems}
                podcastId=""
                layout="list"
                showFilters={false}
                showSort={true}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
