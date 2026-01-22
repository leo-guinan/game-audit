// MetaSPN Type Definitions

export type Game = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6';
export type ExperienceType = 'Convergent' | 'Boundary';

export interface Podcast {
  id: string;
  title: string;
  image_url: string | null;
  description?: string;
  host_name?: string;
  rss_feed_url?: string;
}

export interface PodcastMetrics {
  podcast_id: string;
  dominant_game: Game;
  experience_type: ExperienceType;
  experience_score_final: number; // 0-100
  margin_mean: number;
  entropy_mean: number;
  phase_count: number;
  game_distribution: Record<Game, number>; // percentages
}

export interface Episode {
  id: string;
  podcast_id: string;
  title: string;
  episode_number?: number;
  published_at?: string;
  duration_seconds?: number;
  transcript_url?: string;
}

export interface EpisodeGeometry {
  episode_id: string;
  pca: {
    pc1: number;
    pc2: number;
  };
  primary_game: Game;
  secondary_game?: Game;
  margin: number; // 0-1, higher = more pure
  boundary_flag: boolean;
  distances_to_manifolds: Record<Game, number>;
}

export interface EpisodeClassification {
  episode_id: string;
  game_top1: Game;
  game_top2?: Game;
  confidence_top1: number;
  confidence_top2?: number;
}

export interface EpisodeExperience {
  episode_id: string;
  experience_score: number; // 0-100
  rolling_entropy?: number;
  rolling_margin_median?: number;
}

export interface PodcastManifolds {
  podcast_id: string;
  games: Record<Game, {
    centroid: {
      pc1: number;
      pc2: number;
    };
    radius?: number;
  }>;
}

export interface Guest {
  id: string;
  name: string;
  image_url?: string;
  bio?: string;
}

export interface GuestAppearance {
  id: string;
  episode_id: string;
  guest_id: string;
  guest_name: string;
}

export interface GuestImpactSummary {
  guest_id: string;
  guest_name: string;
  appearances: number;
  avg_delta_margin: number;
  avg_impact_magnitude: number;
  avg_delta_drift: number;
  boundary_rate: number; // percentage of episodes that were boundary
}

export interface EpisodeSegment {
  id: string;
  episode_id: string;
  start_time: number; // seconds
  end_time: number;
  boundary_flag: boolean;
  game?: Game;
  transcript?: string;
}

export interface EpisodeEvidence {
  id: string;
  episode_id: string;
  segment_id?: string;
  quote: string;
  timestamp: number;
  game?: Game;
  evidence_type: 'boundary_moment' | 'game_shift' | 'coherence';
}

// API Response Types
export interface PodcastOverviewResponse {
  podcast: Podcast;
  metrics: PodcastMetrics;
  episodes_geometry: EpisodeGeometry[];
  episodes_experience: EpisodeExperience[];
  centroids: PodcastManifolds['games'];
}

export interface EpisodePageResponse {
  episode: Episode;
  classification: EpisodeClassification;
  geometry: EpisodeGeometry;
  experience: EpisodeExperience;
  segments: EpisodeSegment[];
  evidence: EpisodeEvidence[];
}

export interface GuestImpactResponse {
  guests: GuestImpactSummary[];
  appearances: GuestAppearance[];
  solo_baseline: {
    avg_margin: number;
    avg_experience_score: number;
    boundary_rate: number;
  };
}

export interface CompareResponse {
  podcast1: {
    podcast: Podcast;
    metrics: PodcastMetrics;
  };
  podcast2: {
    podcast: Podcast;
    metrics: PodcastMetrics;
  };
  comparison: {
    game_overlap: Record<Game, { podcast1: number; podcast2: number }>;
    experience_trajectory_diff: number;
    margin_distribution_diff: number;
  };
}
