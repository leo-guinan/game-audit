/**
 * Types mapping podcast_data.db schema to MetaSPN UI.
 * DB: podcast_id, episode_id, etc. | UI: id, etc.
 */

export type Game = "G1" | "G2" | "G3" | "G4" | "G5" | "G6";
export type ExperienceType = "Convergent" | "Boundary";

export interface DbPodcast {
  podcast_id: string;
  title: string;
  image_url: string | null;
  description: string | null;
  rss_url: string | null;
  episode_count: number;
  hosts: string | null; // JSON array
}

export interface DbEpisode {
  episode_id: string;
  podcast_id: string;
  title: string | null;
  episode_number: number | null;
  published_at: string | null;
  duration_seconds: number | null;
  transcript_url: string | null;
}

export interface DbEpisodeClassification {
  episode_id: string;
  game_top1: string | null;
  game_top2: string | null;
  game_probs: string | null; // JSON
  entropy: number | null;
  quality_score: number | null;
}

export interface DbEpisodeGeometry {
  episode_id: string;
  primary_game: string | null;
  secondary_game: string | null;
  margin: number | null;
  boundary_flag: number; // 0|1
  pca: string | null; // JSON { pc1, pc2 }
  distance_primary: number | null;
  distance_secondary: number | null;
}

export interface DbEpisodeEmbedding {
  episode_id: string;
  embedding_model: string;
  embedding_dim: number;
  embedding_id_full: string | null;
  embedding_id_host_only: string | null;
  embedding_id_guest_only: string | null;
}

export interface GameProbs {
  G1?: number;
  G2?: number;
  G3?: number;
  G4?: number;
  G5?: number;
  G6?: number;
}

export interface PcaPoint {
  pc1: number;
  pc2: number;
}
