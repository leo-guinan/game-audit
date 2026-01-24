"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Header from "@/components/header";
import { getGuestImpact } from "@/lib/mock-data/metaspn";
import { SemanticSpaceViewer } from "@/components/metaspn/semantic-space-viewer";
import { ExperienceTimeline } from "@/components/metaspn/experience-timeline";
import { GameDistributionChart } from "@/components/metaspn/game-distribution-chart";
import { RadarChart } from "@/components/metaspn/radar-chart";
import { TrajectoryChart } from "@/components/metaspn/trajectory-chart";
import { GuestImpactScatter } from "@/components/metaspn/guest-impact-scatter";
import { GuestImpactBars } from "@/components/metaspn/guest-impact-bars";
import { EpisodeList } from "@/components/metaspn/episode-list";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { PodcastOverviewResponse, EpisodeWithType } from "@/lib/types/metaspn";
import { GAME_COLORS } from "@/lib/constants/game-colors";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PodcastPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'trajectory' | 'guests' | 'geometry'>('overview');
  const [data, setData] = useState<PodcastOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [episodeTitles, setEpisodeTitles] = useState<Map<string, string>>(new Map());
  const [guestAppearancesByEpisode, setGuestAppearancesByEpisode] = useState<Map<string, string[]>>(new Map());

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setError(null);
    fetch(`/api/metaspn/podcast/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!ok) return;
        if (d.error) {
          setError(d.error);
          setData(null);
        } else {
          setData({
            podcast: d.podcast,
            metrics: d.metrics,
            episodes_geometry: d.episodes_geometry ?? [],
            episodes_experience: d.episodes_experience ?? [],
            centroids: d.centroids ?? {},
          });
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

  useEffect(() => {
    // Fetch episode titles
    fetch(`/api/metaspn/episodes?podcast_id=${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(response => {
        const titlesMap = new Map<string, string>();
        if (response.episodes && Array.isArray(response.episodes)) {
          response.episodes.forEach((ep: { id: string; title: string }) => {
            if (ep.id && ep.title) {
              titlesMap.set(ep.id, ep.title);
            }
          });
        }
        setEpisodeTitles(titlesMap);
      })
      .catch(() => {
        // If API fails, titles will remain empty and fallback to episode number
      });
    
    // Fetch guest appearances
    fetch(`/api/metaspn/podcast/${encodeURIComponent(id)}/guests`)
      .then(r => r.json())
      .then(response => {
        const appearancesMap = new Map<string, string[]>();
        if (response.guest_appearances) {
          Object.entries(response.guest_appearances).forEach(([episodeId, names]) => {
            if (Array.isArray(names)) {
              appearancesMap.set(episodeId, names);
            }
          });
        }
        setGuestAppearancesByEpisode(appearancesMap);
      })
      .catch(() => {
        // If API fails, guest appearances will remain empty
      });
  }, [id]);

  const guestData = getGuestImpact(id);

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
          <p className="text-muted-foreground">{error ?? "Podcast not found"}</p>
        </div>
      </div>
    );
  }

  const { podcast, metrics, episodes_geometry, episodes_experience, centroids } = data;
  const phaseBoundaries = Array.from({ length: Math.max(0, metrics.phase_count - 1) }, (_, i) =>
    Math.floor((i + 1) * (episodes_experience.length / Math.max(1, metrics.phase_count)))
  );

  // Prepare episodes with type information for trajectory charts
  const episodesWithType: EpisodeWithType[] = episodes_experience.map(exp => {
    const geometry = episodes_geometry.find(g => g.episode_id === exp.episode_id);
    const guestNames = guestAppearancesByEpisode.get(exp.episode_id) || [];
    const isGuest = guestNames.length > 0;
    return {
      ...exp,
      is_guest_episode: isGuest,
      guest_names: guestNames.length > 0 ? guestNames : undefined,
      entropy: exp.rolling_entropy ?? metrics.entropy_mean,
      drift: 0.3 + Math.random() * 0.4, // Mock drift value
    };
  });

  // Calculate summary stats for geometry
  const entropyValues = episodes_geometry.map(() => metrics.entropy_mean);
  const driftValues = episodes_geometry.map(() => 0.3 + Math.random() * 0.4);
  const minEntropy = Math.min(...entropyValues, 0);
  const maxEntropy = Math.max(...entropyValues, 2.5);
  const minDrift = Math.min(...driftValues, 0);
  const maxDrift = Math.max(...driftValues, 1);

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
            {podcast.image_url ? (
              <Image
                src={podcast.image_url}
                alt={podcast.title}
                width={200}
                height={200}
                className="rounded object-cover"
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-muted rounded flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">
                  {podcast.title.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{podcast.title}</h1>
              {podcast.host_name && (
                <p className="text-lg text-muted-foreground mb-4">Host: {podcast.host_name}</p>
              )}
              {podcast.description && (
                <p className="text-muted-foreground mb-4">{podcast.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          {(['overview', 'episodes', 'trajectory', 'guests', 'geometry'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-mono text-sm border-b-2 transition-all whitespace-nowrap relative ${
                activeTab === tab
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Show DNA Card with glow effect */}
            <div className="question-card relative" style={{
              boxShadow: `0 0 40px ${GAME_COLORS[metrics.dominant_game]}20`,
              borderColor: `${GAME_COLORS[metrics.dominant_game]}40`,
            }}>
              <h2 className="text-2xl font-bold text-foreground mb-6">Show DNA</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-mono text-muted-foreground mb-2">Dominant Game</div>
                    <div 
                      className="text-4xl font-bold font-mono mb-4"
                      style={{ color: GAME_COLORS[metrics.dominant_game] }}
                    >
                      {metrics.dominant_game}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-mono text-muted-foreground mb-2">Experience Type</div>
                    <div className="text-xl font-semibold text-foreground mb-4">
                      {metrics.experience_type}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-mono text-muted-foreground mb-2">Experience Score</div>
                    <div className="text-3xl font-bold text-foreground">
                      {metrics.experience_score_final.toFixed(0)}/100
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Summary</div>
                  <p className="text-foreground leading-relaxed text-lg">
                    {podcast.title} is a <strong>{metrics.experience_type}</strong> {metrics.dominant_game} show with{' '}
                    {metrics.experience_type === 'Convergent' ? 'extreme coherence' : 'high exploration'} and{' '}
                    {metrics.margin_mean > 0.6 ? 'high' : metrics.margin_mean > 0.4 ? 'moderate' : 'low'} separation.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <RadarChart distribution={metrics.game_distribution} width={400} height={400} />
              </div>
            </div>

            {/* Semantic Space */}
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Semantic Space</h2>
              <p className="text-sm text-muted-foreground mb-4">
                This is the semantic shape of your show. Each point is an episode, colored by game.
              </p>
              <SemanticSpaceViewer
                episodes={episodes_geometry}
                centroids={centroids}
                onEpisodeClick={(episodeId: string) => router.push(`/episode/${encodeURIComponent(episodeId)}`)}
              />
            </div>

            {/* Experience Timeline */}
            <div className="question-card">
              <ExperienceTimeline
                episodes={episodes_experience}
                phaseBoundaries={phaseBoundaries}
              />
            </div>
          </div>
        )}

        {/* Episodes Tab */}
        {activeTab === 'episodes' && (
          <EpisodeList
            episodes={episodes_geometry.map((geometry, idx) => {
              const episode = episodes_experience.find(e => e.episode_id === geometry.episode_id);
              const episodeWithType = episodesWithType.find(e => e.episode_id === geometry.episode_id);
              const episodeTitle = episodeTitles.get(geometry.episode_id);
              return {
                episode_id: geometry.episode_id,
                geometry,
                experience: episode,
                episode_number: idx + 1,
                title: episodeTitle || undefined,
                is_guest_episode: episodeWithType?.is_guest_episode ?? false,
                guest_names: episodeWithType?.guest_names,
              };
            })}
            podcastId={id}
            layout="list"
            showFilters={true}
            showSort={true}
          />
        )}

        {/* Trajectory Tab */}
        {activeTab === 'trajectory' && (
          <div className="space-y-8">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Experience Score Over Time</h2>
              <ExperienceTimeline
                episodes={episodes_experience}
                phaseBoundaries={phaseBoundaries}
              />
            </div>

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
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="space-y-8">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Guest Impact Vectors</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Not all guests are equal—some sharpen your show, some blur it.
              </p>
              {guestData.guests.length > 0 ? (
                <GuestImpactBars guests={guestData.guests} />
              ) : (
                <div className="p-8 border border-border bg-muted/20 text-center">
                  <p className="text-muted-foreground">No guest data available yet.</p>
                </div>
              )}
            </div>

            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Guest Impact Scatter</h2>
              <GuestImpactScatter guests={guestData.guests} />
            </div>

            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Top Guests</h2>
              
              <div className="space-y-6">
                {guestData.guests.length > 0 ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Top Geometry Amplifiers</h3>
                      <div className="space-y-2">
                        {[...guestData.guests]
                          .filter(g => g.avg_delta_margin > 0)
                          .sort((a, b) => b.avg_delta_margin - a.avg_delta_margin)
                          .slice(0, 5)
                          .map(guest => (
                            <Link
                              key={guest.guest_id}
                              href={`/guest/${encodeURIComponent(guest.guest_id)}`}
                              className="block p-3 border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold text-foreground">{guest.guest_name}</div>
                                  <div className="text-sm text-muted-foreground">{guest.appearances} appearances</div>
                                </div>
                                <div className="text-sm font-mono text-primary">
                                  +{guest.avg_delta_margin.toFixed(3)} margin
                                </div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Top Distorters</h3>
                      <div className="space-y-2">
                        {[...guestData.guests]
                          .filter(g => g.avg_delta_margin < 0)
                          .sort((a, b) => a.avg_delta_margin - b.avg_delta_margin)
                          .slice(0, 5)
                          .map(guest => (
                            <Link
                              key={guest.guest_id}
                              href={`/guest/${encodeURIComponent(guest.guest_id)}`}
                              className="block p-3 border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold text-foreground">{guest.guest_name}</div>
                                  <div className="text-sm text-muted-foreground">{guest.appearances} appearances</div>
                                </div>
                                <div className="text-sm font-mono text-destructive">
                                  {guest.avg_delta_margin.toFixed(3)} margin
                                </div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 border border-border bg-muted/20 text-center">
                    <p className="text-muted-foreground">No guest data available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Geometry Tab */}
        {activeTab === 'geometry' && (
          <div className="space-y-8">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Semantic Geometry</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Explore the semantic space of all episodes. Click on any episode to view details.
              </p>
              <SemanticSpaceViewer
                episodes={episodes_geometry}
                centroids={centroids}
                onEpisodeClick={(episodeId: string) => router.push(`/episode/${encodeURIComponent(episodeId)}`)}
                width={800}
                height={800}
              />
            </div>

            {/* Summary Stats */}
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Geometric Summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Entropy Range</div>
                  <div className="text-lg font-mono text-foreground">
                    {minEntropy.toFixed(2)} - {maxEntropy.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Drift Range</div>
                  <div className="text-lg font-mono text-foreground">
                    {minDrift.toFixed(2)} - {maxDrift.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Total Episodes</div>
                  <div className="text-lg font-mono text-foreground">
                    {episodes_geometry.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Boundary Episodes</div>
                  <div className="text-lg font-mono text-foreground">
                    {episodes_geometry.filter(e => e.boundary_flag).length} ({((episodes_geometry.filter(e => e.boundary_flag).length / episodes_geometry.length) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
