"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Header from "@/components/header";
import { getGuestImpact } from "@/lib/mock-data/metaspn";
import { SemanticSpaceViewer } from "@/components/metaspn/semantic-space-viewer";
import { ExperienceTimeline } from "@/components/metaspn/experience-timeline";
import { GameDistributionChart } from "@/components/metaspn/game-distribution-chart";
import { GuestImpactScatter } from "@/components/metaspn/guest-impact-scatter";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { PodcastOverviewResponse } from "@/lib/types/metaspn";

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
              className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Show DNA Card */}
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Show DNA</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Dominant Game</div>
                  <div className="text-3xl font-bold font-mono text-primary mb-4">
                    {metrics.dominant_game}
                  </div>
                  
                  <div className="text-sm font-mono text-muted-foreground mb-2">Experience Type</div>
                  <div className="text-xl font-semibold text-foreground mb-4">
                    {metrics.experience_type}
                  </div>
                  
                  <div className="text-sm font-mono text-muted-foreground mb-2">Experience Score</div>
                  <div className="text-3xl font-bold text-foreground">
                    {metrics.experience_score_final.toFixed(0)}/100
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Summary</div>
                  <p className="text-foreground leading-relaxed">
                    {podcast.title} is a <strong>{metrics.experience_type}</strong> {metrics.dominant_game} show with{' '}
                    {metrics.experience_type === 'Convergent' ? 'extreme coherence' : 'high exploration'} and{' '}
                    {metrics.margin_mean > 0.6 ? 'high' : metrics.margin_mean > 0.4 ? 'moderate' : 'low'} separation.
                  </p>
                </div>
              </div>
              
              <GameDistributionChart distribution={metrics.game_distribution} />
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
                onEpisodeClick={(episodeId) => router.push(`/episode/${encodeURIComponent(episodeId)}`)}
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
          <div className="space-y-4">
            {episodes_geometry.map((geometry, idx) => {
              const episode = episodes_experience.find(e => e.episode_id === geometry.episode_id);
              return (
                <Link
                  key={geometry.episode_id}
                  href={`/episode/${encodeURIComponent(geometry.episode_id)}`}
                  className="block question-card lift-on-hover"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono border border-primary/30">
                          {geometry.primary_game}
                        </span>
                        {geometry.secondary_game && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-mono border border-border">
                            {geometry.secondary_game}
                          </span>
                        )}
                        {geometry.boundary_flag && (
                          <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-mono border border-destructive/30">
                            Boundary
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-foreground mb-1">
                        Episode {idx + 1}
                      </div>
                      {episode && (
                        <div className="text-sm text-muted-foreground">
                          Experience: {episode.experience_score.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-mono text-muted-foreground">
                      Margin: {geometry.margin.toFixed(2)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Trajectory Tab */}
        {activeTab === 'trajectory' && (
          <div className="space-y-8">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Experience Trajectory</h2>
              <ExperienceTimeline
                episodes={episodes_experience}
                phaseBoundaries={phaseBoundaries}
              />
            </div>

            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Game Distribution Over Time</h2>
              <p className="text-sm text-muted-foreground mb-4">
                How the show's game distribution evolved over time
              </p>
              <div className="h-64 flex items-center justify-center border border-border bg-muted/20">
                <p className="text-muted-foreground">Stacked area chart visualization (coming soon)</p>
              </div>
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="space-y-8">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Guest Impact Analysis</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Not all guests are equal—some sharpen your show, some blur it.
              </p>
              <GuestImpactScatter guests={guestData.guests} />
            </div>

            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Guest Leaderboards</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Top Geometry Amplifiers</h3>
                  <div className="space-y-2">
                    {[...guestData.guests]
                      .filter(g => g.avg_delta_margin > 0)
                      .sort((a, b) => b.avg_delta_margin - a.avg_delta_margin)
                      .slice(0, 5)
                      .map(guest => (
                        <div key={guest.guest_id} className="flex justify-between items-center p-3 border border-border bg-muted/20">
                          <div>
                            <div className="font-semibold text-foreground">{guest.guest_name}</div>
                            <div className="text-sm text-muted-foreground">{guest.appearances} appearances</div>
                          </div>
                          <div className="text-sm font-mono text-primary">
                            +{guest.avg_delta_margin.toFixed(3)} margin
                          </div>
                        </div>
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
                        <div key={guest.guest_id} className="flex justify-between items-center p-3 border border-border bg-muted/20">
                          <div>
                            <div className="font-semibold text-foreground">{guest.guest_name}</div>
                            <div className="text-sm text-muted-foreground">{guest.appearances} appearances</div>
                          </div>
                          <div className="text-sm font-mono text-destructive">
                            {guest.avg_delta_margin.toFixed(3)} margin
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Geometry Tab */}
        {activeTab === 'geometry' && (
          <div className="question-card">
            <h2 className="text-2xl font-bold text-foreground mb-4">Semantic Geometry</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Explore the semantic space of all episodes. Click on any episode to view details.
            </p>
            <SemanticSpaceViewer
              episodes={episodes_geometry}
              centroids={centroids}
              onEpisodeClick={(episodeId) => router.push(`/episode/${encodeURIComponent(episodeId)}`)}
              width={800}
              height={800}
            />
          </div>
        )}
      </main>
    </div>
  );
}
