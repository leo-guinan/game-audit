"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Header from "@/components/header";
import { SemanticSpaceViewer } from "@/components/metaspn/semantic-space-viewer";
import { TrajectoryChart } from "@/components/metaspn/trajectory-chart";
import { BoxPlot } from "@/components/metaspn/box-plot";
import { RadarChart } from "@/components/metaspn/radar-chart";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { HostPageResponse, EpisodeWithType } from "@/lib/types/metaspn";
import { GAME_COLORS } from "@/lib/constants/game-colors";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HostPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<HostPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setError(null);
    fetch(`/api/metaspn/host/${encodeURIComponent(id)}`)
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
          <p className="text-muted-foreground">{error ?? "Host not found"}</p>
        </div>
      </div>
    );
  }

  const { host, metrics, episodes_geometry, episodes_experience, top_guests } = data;

  // Prepare episodes with type information
  const episodesWithType: EpisodeWithType[] = episodes_experience.map(exp => {
    const geometry = episodes_geometry.find(g => g.episode_id === exp.episode_id);
    // Determine if guest episode (mock: assume episodes with lower margin are guest episodes)
    const isGuest = geometry ? geometry.margin < 0.5 : false;
    return {
      ...exp,
      is_guest_episode: isGuest,
      entropy: exp.rolling_entropy ?? metrics.solo_episodes.avg_entropy,
      drift: 0.3 + Math.random() * 0.4,
    };
  });

  // Separate solo and guest episodes for box plots
  const soloEntropies = episodesWithType.filter(e => !e.is_guest_episode).map(e => e.entropy ?? 0);
  const guestEntropies = episodesWithType.filter(e => e.is_guest_episode).map(e => e.entropy ?? 0);
  const soloDrifts = episodesWithType.filter(e => !e.is_guest_episode).map(e => e.drift ?? 0);
  const guestDrifts = episodesWithType.filter(e => e.is_guest_episode).map(e => e.drift ?? 0);
  const soloScores = episodesWithType.filter(e => !e.is_guest_episode).map(e => e.experience_score);
  const guestScores = episodesWithType.filter(e => e.is_guest_episode).map(e => e.experience_score);

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
            {host.image_url ? (
              <Image
                src={host.image_url}
                alt={host.name}
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[150px] h-[150px] bg-muted rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">
                  {host.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{host.name}</h1>
              {host.bio && (
                <p className="text-muted-foreground mb-4">{host.bio}</p>
              )}
              <div className="flex gap-4 text-sm font-mono text-muted-foreground">
                <span>{metrics.total_episodes} episodes</span>
                <span>{metrics.years_active} years active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="question-card mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Host Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Dominant Game(s)</div>
              <div className="flex gap-2 flex-wrap">
                {metrics.dominant_games.map(game => (
                  <span
                    key={game}
                    className="text-xl font-bold font-mono"
                    style={{ color: GAME_COLORS[game] }}
                  >
                    {game}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Experience Type</div>
              <div className="text-xl font-semibold text-foreground">
                {metrics.experience_type}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Entropy Range</div>
              <div className="text-lg font-mono text-foreground">
                {metrics.entropy_range[0].toFixed(2)} - {metrics.entropy_range[1].toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-2">Drift Range</div>
              <div className="text-lg font-mono text-foreground">
                {metrics.drift_range[0].toFixed(2)} - {metrics.drift_range[1].toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Geometric Range */}
        <div className="question-card mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Geometric Range</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The semantic space covered by all episodes across {host.podcast_ids.length} podcast{host.podcast_ids.length !== 1 ? 's' : ''}.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <SemanticSpaceViewer
              episodes={episodes_geometry}
              centroids={{}}
              onEpisodeClick={(episodeId: string) => router.push(`/episode/${encodeURIComponent(episodeId)}`)}
              width={500}
              height={500}
            />
            <div className="space-y-4">
              <RadarChart distribution={metrics.game_distribution} width={400} height={400} />
            </div>
          </div>
        </div>

        {/* Entropy/Drift History */}
        <div className="space-y-8 mb-8">
          <div className="question-card">
            <TrajectoryChart
              episodes={episodesWithType}
              metric="entropy"
              title="Entropy Over Time"
              yAxisLabel="Entropy"
              width={800}
              height={250}
            />
          </div>

          <div className="question-card">
            <TrajectoryChart
              episodes={episodesWithType}
              metric="drift"
              title="Drift Over Time"
              yAxisLabel="Drift"
              width={800}
              height={250}
            />
          </div>
        </div>

        {/* Solo vs Guest Comparison */}
        <div className="question-card mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Solo vs Guest Episodes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BoxPlot
              soloData={soloEntropies}
              guestData={guestEntropies}
              label="Entropy Distribution"
              yAxisLabel="Entropy"
              width={300}
              height={200}
            />
            <BoxPlot
              soloData={soloDrifts}
              guestData={guestDrifts}
              label="Drift Distribution"
              yAxisLabel="Drift"
              width={300}
              height={200}
            />
            <BoxPlot
              soloData={soloScores}
              guestData={guestScores}
              label="Experience Score Distribution"
              yAxisLabel="Score"
              width={300}
              height={200}
            />
          </div>
          
          {/* Statistics */}
          <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-border">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Solo Episodes</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Count:</span>
                  <span className="text-foreground">{metrics.solo_episodes.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Entropy:</span>
                  <span className="text-foreground">{metrics.solo_episodes.avg_entropy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Drift:</span>
                  <span className="text-foreground">{metrics.solo_episodes.avg_drift.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Score:</span>
                  <span className="text-foreground">{metrics.solo_episodes.avg_experience_score.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Guest Episodes</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Count:</span>
                  <span className="text-foreground">{metrics.guest_episodes.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Entropy:</span>
                  <span className="text-foreground">{metrics.guest_episodes.avg_entropy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Drift:</span>
                  <span className="text-foreground">{metrics.guest_episodes.avg_drift.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Score:</span>
                  <span className="text-foreground">{metrics.guest_episodes.avg_experience_score.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Guests */}
        {top_guests.length > 0 && (
          <div className="question-card">
            <h2 className="text-2xl font-bold text-foreground mb-4">Top Guests</h2>
            <div className="space-y-2">
              {top_guests.map((guest) => (
                <Link
                  key={guest.guest_id}
                  href={`/guest/${encodeURIComponent(guest.guest_id)}`}
                  className="block p-4 border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">{guest.guest_name}</div>
                      <div className="text-sm text-muted-foreground">{guest.appearances} appearances</div>
                    </div>
                    <div className="text-sm font-mono text-primary">
                      Avg Impact: {guest.avg_impact.toFixed(3)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
