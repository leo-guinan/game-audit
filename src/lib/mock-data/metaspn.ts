// Mock Data Generators for MetaSPN

import type {
  Podcast,
  PodcastMetrics,
  Episode,
  EpisodeGeometry,
  EpisodeClassification,
  EpisodeExperience,
  Guest,
  GuestImpactSummary,
  GuestAppearance,
  Game,
  ExperienceType,
  PodcastOverviewResponse,
  EpisodePageResponse,
  GuestImpactResponse,
  CompareResponse,
  Host,
  HostMetrics,
  HostPageResponse,
  GuestMetrics,
  GuestPageResponse,
  GuestEpisodeAppearance,
} from '../types/metaspn';

const GAMES: Game[] = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

// Helper to generate random game distribution
function generateGameDistribution(dominant: Game): Record<Game, number> {
  const dist: Record<Game, number> = {
    G1: 0, G2: 0, G3: 0, G4: 0, G5: 0, G6: 0,
  };
  
  const dominantPct = 45 + Math.random() * 30; // 45-75%
  dist[dominant] = dominantPct;
  
  const remaining = 100 - dominantPct;
  const otherGames = GAMES.filter(g => g !== dominant);
  let allocated = 0;
  
  otherGames.forEach((game, idx) => {
    if (idx === otherGames.length - 1) {
      dist[game] = remaining - allocated;
    } else {
      const pct = Math.random() * (remaining - allocated) * 0.4;
      dist[game] = pct;
      allocated += pct;
    }
  });
  
  return dist;
}

// Mock Podcasts
export const MOCK_PODCASTS: Podcast[] = [
  {
    id: 'pod-1',
    title: 'Creator Science',
    image_url: null,
    description: 'A podcast about building sustainable creator businesses',
    host_name: 'Jenny Blake',
  },
  {
    id: 'pod-2',
    title: 'The Tim Ferriss Show',
    image_url: null,
    description: 'Interviews with world-class performers',
    host_name: 'Tim Ferriss',
  },
  {
    id: 'pod-3',
    title: 'My First Million',
    image_url: null,
    description: 'Business ideas and strategies',
    host_name: 'Sam Parr & Shaan Puri',
  },
  {
    id: 'pod-4',
    title: 'How I Built This',
    image_url: null,
    description: 'Stories of entrepreneurs',
    host_name: 'Guy Raz',
  },
  {
    id: 'pod-5',
    title: 'The Knowledge Project',
    image_url: null,
    description: 'Mastering the best of what other people have figured out',
    host_name: 'Shane Parrish',
  },
];

// Mock Podcast Metrics
export const MOCK_PODCAST_METRICS: Record<string, PodcastMetrics> = {
  'pod-1': {
    podcast_id: 'pod-1',
    dominant_game: 'G2',
    experience_type: 'Convergent',
    experience_score_final: 87,
    margin_mean: 0.72,
    entropy_mean: 0.18,
    phase_count: 3,
    game_distribution: generateGameDistribution('G2'),
  },
  'pod-2': {
    podcast_id: 'pod-2',
    dominant_game: 'G4',
    experience_type: 'Boundary',
    experience_score_final: 65,
    margin_mean: 0.45,
    entropy_mean: 0.35,
    phase_count: 5,
    game_distribution: generateGameDistribution('G4'),
  },
  'pod-3': {
    podcast_id: 'pod-3',
    dominant_game: 'G3',
    experience_type: 'Convergent',
    experience_score_final: 78,
    margin_mean: 0.68,
    entropy_mean: 0.22,
    phase_count: 2,
    game_distribution: generateGameDistribution('G3'),
  },
  'pod-4': {
    podcast_id: 'pod-4',
    dominant_game: 'G1',
    experience_type: 'Convergent',
    experience_score_final: 82,
    margin_mean: 0.75,
    entropy_mean: 0.15,
    phase_count: 4,
    game_distribution: generateGameDistribution('G1'),
  },
  'pod-5': {
    podcast_id: 'pod-5',
    dominant_game: 'G5',
    experience_type: 'Boundary',
    experience_score_final: 58,
    margin_mean: 0.38,
    entropy_mean: 0.42,
    phase_count: 6,
    game_distribution: generateGameDistribution('G5'),
  },
};

// Generate mock episodes for a podcast
export function generateMockEpisodes(podcastId: string, count: number = 50): Episode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ep-${podcastId}-${i + 1}`,
    podcast_id: podcastId,
    title: `Episode ${i + 1}: ${generateEpisodeTitle()}`,
    episode_number: i + 1,
    published_at: new Date(Date.now() - (count - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 1800 + Math.random() * 3600, // 30-90 min
  }));
}

function generateEpisodeTitle(): string {
  const titles = [
    'Building Sustainable Systems',
    'The Art of Deep Work',
    'Navigating Complexity',
    'Lessons from Failure',
    'The Future of Work',
    'Mastering Your Craft',
    'Breaking Through Barriers',
    'The Power of Consistency',
    'Innovation and Iteration',
    'Finding Your Voice',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

// Generate mock episode geometry
export function generateMockEpisodeGeometry(
  episodeId: string,
  dominantGame: Game,
  episodeIndex: number
): EpisodeGeometry {
  const isBoundary = Math.random() < 0.15; // 15% boundary episodes
  const margin = isBoundary ? 0.2 + Math.random() * 0.3 : 0.5 + Math.random() * 0.4;
  
  // Generate PCA coordinates with some drift over time
  const baseX = -2 + (episodeIndex / 50) * 4; // drift from left to right
  const baseY = -2 + Math.random() * 4;
  
  const pc1 = baseX + (Math.random() - 0.5) * 1.5;
  const pc2 = baseY + (Math.random() - 0.5) * 1.5;
  
  // Generate distances to manifolds
  const distances: Record<Game, number> = {
    G1: Math.random() * 3,
    G2: Math.random() * 3,
    G3: Math.random() * 3,
    G4: Math.random() * 3,
    G5: Math.random() * 3,
    G6: Math.random() * 3,
  };
  
  // Make dominant game closest
  distances[dominantGame] = Math.random() * 1.5;
  
  // If boundary, make secondary game also close
  if (isBoundary) {
    const secondary = GAMES.filter(g => g !== dominantGame)[Math.floor(Math.random() * 5)];
    distances[secondary] = Math.random() * 1.5 + 0.5;
  }
  
  return {
    episode_id: episodeId,
    pca: { pc1, pc2 },
    primary_game: dominantGame,
    secondary_game: isBoundary ? GAMES.filter(g => g !== dominantGame)[Math.floor(Math.random() * 5)] : undefined,
    margin,
    boundary_flag: isBoundary,
    distances_to_manifolds: distances,
  };
}

// Generate mock episode classification
export function generateMockEpisodeClassification(
  episodeId: string,
  geometry: EpisodeGeometry
): EpisodeClassification {
  return {
    episode_id: episodeId,
    game_top1: geometry.primary_game,
    game_top2: geometry.secondary_game,
    confidence_top1: 0.6 + Math.random() * 0.3,
    confidence_top2: geometry.secondary_game ? 0.3 + Math.random() * 0.3 : undefined,
  };
}

// Generate mock episode experience
export function generateMockEpisodeExperience(
  episodeId: string,
  episodeIndex: number,
  baseScore: number
): EpisodeExperience {
  const variance = 15;
  const score = Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * variance));
  
  return {
    episode_id: episodeId,
    experience_score: score,
    rolling_entropy: 0.15 + Math.random() * 0.3,
    rolling_margin_median: 0.5 + Math.random() * 0.3,
  };
}

// Generate mock centroids
export function generateMockCentroids(podcastId: string, dominantGame: Game) {
  const baseCentroids: Record<Game, { pc1: number; pc2: number }> = {
    G1: { pc1: -2, pc2: -1 },
    G2: { pc1: 0, pc2: -2 },
    G3: { pc1: 2, pc2: -1 },
    G4: { pc1: -1, pc2: 1 },
    G5: { pc1: 1, pc2: 1 },
    G6: { pc1: 0, pc2: 2 },
  };
  
  // Shift dominant game centroid slightly
  const base = baseCentroids[dominantGame];
  const shifted = {
    pc1: base.pc1 + (Math.random() - 0.5) * 0.5,
    pc2: base.pc2 + (Math.random() - 0.5) * 0.5,
  };
  
  // Convert to expected format
  const centroids: Record<Game, { centroid: { pc1: number; pc2: number }; radius?: number }> = {
    G1: { centroid: baseCentroids.G1 },
    G2: { centroid: baseCentroids.G2 },
    G3: { centroid: baseCentroids.G3 },
    G4: { centroid: baseCentroids.G4 },
    G5: { centroid: baseCentroids.G5 },
    G6: { centroid: baseCentroids.G6 },
  };
  
  centroids[dominantGame] = { centroid: shifted };
  
  return centroids;
}

// Mock Guests
export const MOCK_GUESTS: Guest[] = [
  { id: 'guest-1', name: 'Paul Millerd', bio: 'Author and creator' },
  { id: 'guest-2', name: 'Tommy Collison', bio: 'Writer and entrepreneur' },
  { id: 'guest-3', name: 'Bill Gates', bio: 'Founder of Microsoft' },
  { id: 'guest-4', name: 'James Dyson', bio: 'Inventor and entrepreneur' },
];

// Generate mock guest impact
export function generateMockGuestImpact(podcastId: string): GuestImpactResponse {
  // Return empty guest data for now - guest associations need to be properly implemented
  // TODO: Implement proper guest data extraction from intake files or database
  return {
    guests: [],
    appearances: [],
    solo_baseline: {
      avg_margin: 0.65,
      avg_experience_score: 75,
      boundary_rate: 0.12,
    },
  };
}

// API-like functions that return mock data
export function getPodcastOverview(podcastId: string): PodcastOverviewResponse | null {
  const podcast = MOCK_PODCASTS.find(p => p.id === podcastId);
  if (!podcast) return null;
  
  const metrics = MOCK_PODCAST_METRICS[podcastId];
  const episodes = generateMockEpisodes(podcastId, 50);
  
  const episodes_geometry = episodes.map((ep, idx) =>
    generateMockEpisodeGeometry(ep.id, metrics.dominant_game, idx)
  );
  
  const episodes_experience = episodes.map((ep, idx) =>
    generateMockEpisodeExperience(ep.id, idx, metrics.experience_score_final)
  );
  
  const centroids = generateMockCentroids(podcastId, metrics.dominant_game);
  
  return {
    podcast,
    metrics,
    episodes_geometry,
    episodes_experience,
    centroids,
  };
}

export function getEpisodePage(episodeId: string): EpisodePageResponse | null {
  // Extract podcast ID from episode ID
  const podcastId = episodeId.split('-')[1];
  const podcast = MOCK_PODCASTS.find(p => p.id === `pod-${podcastId}`);
  if (!podcast) return null;
  
  const metrics = MOCK_PODCAST_METRICS[`pod-${podcastId}`];
  const episodes = generateMockEpisodes(`pod-${podcastId}`, 50);
  const episode = episodes.find(e => e.id === episodeId);
  if (!episode) return null;
  
  const episodeIndex = episodes.findIndex(e => e.id === episodeId);
  const geometry = generateMockEpisodeGeometry(episodeId, metrics.dominant_game, episodeIndex);
  const classification = generateMockEpisodeClassification(episodeId, geometry);
  const experience = generateMockEpisodeExperience(episodeId, episodeIndex, metrics.experience_score_final);
  
  // Generate segments
  const segments: EpisodePageResponse['segments'] = Array.from({ length: 10 }, (_, i) => ({
    id: `seg-${episodeId}-${i}`,
    episode_id: episodeId,
    start_time: i * 300,
    end_time: (i + 1) * 300,
    boundary_flag: Math.random() < 0.2,
    game: Math.random() < 0.7 ? metrics.dominant_game : GAMES[Math.floor(Math.random() * 6)],
    transcript: `Segment ${i + 1} transcript...`,
  }));
  
  // Generate evidence
  const evidence: EpisodePageResponse['evidence'] = segments
    .filter(s => s.boundary_flag)
    .map((seg, idx) => ({
      id: `ev-${episodeId}-${idx}`,
      episode_id: episodeId,
      segment_id: seg.id,
      quote: `"This is a boundary moment quote from segment ${idx + 1}"`,
      timestamp: seg.start_time,
      game: seg.game,
      evidence_type: 'boundary_moment' as const,
    }));
  
  return {
    episode,
    classification,
    geometry,
    experience,
    segments,
    evidence,
  };
}

export function getGuestImpact(podcastId: string): GuestImpactResponse {
  return generateMockGuestImpact(podcastId);
}

export function getCompare(podcastId1: string, podcastId2: string): CompareResponse | null {
  const pod1 = getPodcastOverview(podcastId1);
  const pod2 = getPodcastOverview(podcastId2);
  
  if (!pod1 || !pod2) return null;
  
  return {
    podcast1: {
      podcast: pod1.podcast,
      metrics: pod1.metrics,
    },
    podcast2: {
      podcast: pod2.podcast,
      metrics: pod2.metrics,
    },
    comparison: {
      game_overlap: GAMES.reduce((acc, game) => {
        acc[game] = {
          podcast1: pod1.metrics.game_distribution[game],
          podcast2: pod2.metrics.game_distribution[game],
        };
        return acc;
      }, {} as Record<Game, { podcast1: number; podcast2: number }>),
      experience_trajectory_diff: Math.abs(pod1.metrics.experience_score_final - pod2.metrics.experience_score_final),
      margin_distribution_diff: Math.abs(pod1.metrics.margin_mean - pod2.metrics.margin_mean),
    },
  };
}

// Get all podcasts for discovery
export function getAllPodcasts() {
  return MOCK_PODCASTS.map(podcast => ({
    podcast,
    metrics: MOCK_PODCAST_METRICS[podcast.id],
  }));
}

// Get episodes by game
export function getEpisodesByGame(game: Game) {
  const allPodcasts = getAllPodcasts();
  const episodes: Array<{
    episode: Episode;
    geometry: EpisodeGeometry;
    podcast: Podcast;
  }> = [];
  
  allPodcasts.forEach(({ podcast, metrics }) => {
    const podcastEpisodes = generateMockEpisodes(podcast.id, 50);
    podcastEpisodes.forEach((ep, idx) => {
      const geometry = generateMockEpisodeGeometry(ep.id, metrics.dominant_game, idx);
      if (geometry.primary_game === game || geometry.secondary_game === game) {
        episodes.push({ episode: ep, geometry, podcast });
      }
    });
  });
  
  return episodes;
}

// Get boundary episodes
export function getBoundaryEpisodes() {
  const allPodcasts = getAllPodcasts();
  const episodes: Array<{
    episode: Episode;
    geometry: EpisodeGeometry;
    podcast: Podcast;
  }> = [];
  
  allPodcasts.forEach(({ podcast, metrics }) => {
    const podcastEpisodes = generateMockEpisodes(podcast.id, 50);
    podcastEpisodes.forEach((ep, idx) => {
      const geometry = generateMockEpisodeGeometry(ep.id, metrics.dominant_game, idx);
      if (geometry.boundary_flag) {
        episodes.push({ episode: ep, geometry, podcast });
      }
    });
  });
  
  return episodes;
}

// Mock Hosts
export const MOCK_HOSTS: Host[] = [
  {
    id: 'host-1',
    name: 'Jenny Blake',
    podcast_ids: ['pod-1'],
  },
  {
    id: 'host-2',
    name: 'Tim Ferriss',
    podcast_ids: ['pod-2'],
  },
  {
    id: 'host-3',
    name: 'Sam Parr & Shaan Puri',
    podcast_ids: ['pod-3'],
  },
  {
    id: 'host-4',
    name: 'Guy Raz',
    podcast_ids: ['pod-4'],
  },
  {
    id: 'host-5',
    name: 'Shane Parrish',
    podcast_ids: ['pod-5'],
  },
];

// Generate mock host data
export function generateMockHostData(hostId: string): HostPageResponse | null {
  const host = MOCK_HOSTS.find(h => h.id === hostId);
  if (!host) return null;

  // Aggregate data from all podcasts for this host
  const allEpisodes: Episode[] = [];
  const allGeometries: EpisodeGeometry[] = [];
  const allExperiences: EpisodeExperience[] = [];
  const gameCounts: Record<Game, number> = { G1: 0, G2: 0, G3: 0, G4: 0, G5: 0, G6: 0 };
  let soloCount = 0;
  let guestCount = 0;
  const soloEntropies: number[] = [];
  const guestEntropies: number[] = [];
  const soloDrifts: number[] = [];
  const guestDrifts: number[] = [];
  const soloScores: number[] = [];
  const guestScores: number[] = [];
  const entropies: number[] = [];
  const drifts: number[] = [];

  host.podcast_ids.forEach(podcastId => {
    const overview = getPodcastOverview(podcastId);
    if (!overview) return;

    overview.episodes_geometry.forEach((geom, idx) => {
      allGeometries.push(geom);
      gameCounts[geom.primary_game]++;
      
      const exp = overview.episodes_experience[idx];
      if (exp) {
        allExperiences.push(exp);
        entropies.push(exp.rolling_entropy ?? 0.5);
        drifts.push(0.3 + Math.random() * 0.4); // Mock drift
        
        // Randomly assign solo vs guest (70% solo)
        const isGuest = Math.random() < 0.3;
        if (isGuest) {
          guestCount++;
          guestEntropies.push(exp.rolling_entropy ?? 0.5);
          guestDrifts.push(0.3 + Math.random() * 0.4);
          guestScores.push(exp.experience_score);
        } else {
          soloCount++;
          soloEntropies.push(exp.rolling_entropy ?? 0.5);
          soloDrifts.push(0.3 + Math.random() * 0.4);
          soloScores.push(exp.experience_score);
        }
      }
    });
  });

  const totalEpisodes = allGeometries.length;
  const dominantGames = (Object.entries(gameCounts) as [Game, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([game]) => game);

  const entropyRange: [number, number] = [
    Math.min(...entropies, 0),
    Math.max(...entropies, 2.5),
  ];
  const driftRange: [number, number] = [
    Math.min(...drifts, 0),
    Math.max(...drifts, 1),
  ];

  const game_distribution: Record<Game, number> = { G1: 0, G2: 0, G3: 0, G4: 0, G5: 0, G6: 0 };
  GAMES.forEach(game => {
    game_distribution[game] = totalEpisodes > 0 ? (100 * gameCounts[game]) / totalEpisodes : 0;
  });

  const experienceType: ExperienceType = dominantGames.length === 1 && gameCounts[dominantGames[0]!]! / totalEpisodes >= 0.6
    ? 'Convergent'
    : 'Boundary';

  const metrics: HostMetrics = {
    total_episodes: totalEpisodes,
    years_active: Math.ceil(totalEpisodes / 12), // Rough estimate
    dominant_games: dominantGames,
    experience_type: experienceType,
    entropy_range: entropyRange,
    drift_range: driftRange,
    solo_episodes: {
      count: soloCount,
      avg_entropy: soloEntropies.length > 0 ? soloEntropies.reduce((a, b) => a + b, 0) / soloEntropies.length : 0,
      avg_drift: soloDrifts.length > 0 ? soloDrifts.reduce((a, b) => a + b, 0) / soloDrifts.length : 0,
      avg_experience_score: soloScores.length > 0 ? soloScores.reduce((a, b) => a + b, 0) / soloScores.length : 0,
    },
    guest_episodes: {
      count: guestCount,
      avg_entropy: guestEntropies.length > 0 ? guestEntropies.reduce((a, b) => a + b, 0) / guestEntropies.length : 0,
      avg_drift: guestDrifts.length > 0 ? guestDrifts.reduce((a, b) => a + b, 0) / guestDrifts.length : 0,
      avg_experience_score: guestScores.length > 0 ? guestScores.reduce((a, b) => a + b, 0) / guestScores.length : 0,
    },
    game_distribution,
  };

  // Generate top guests (mock)
  const topGuests = MOCK_GUESTS.slice(0, 5).map((guest, idx) => ({
    guest_id: guest.id,
    guest_name: guest.name,
    appearances: Math.floor(Math.random() * 10) + 1,
    avg_impact: (Math.random() - 0.5) * 0.5,
  }));

  return {
    host,
    metrics,
    episodes_geometry: allGeometries,
    episodes_experience: allExperiences,
    top_guests: topGuests,
  };
}

// Generate mock guest data
export function generateMockGuestData(guestId: string): GuestPageResponse | null {
  const guest = MOCK_GUESTS.find(g => g.id === guestId);
  if (!guest) return null;

  // Generate mock appearances across podcasts
  const appearances = Math.floor(Math.random() * 15) + 3;
  const episodes: GuestEpisodeAppearance[] = [];
  const deltaEntropies: number[] = [];
  const deltaDrifts: number[] = [];
  const gameShifts: Array<{ from: Game; to: Game }> = [];
  const hostAppearances: Record<string, { host_name: string; count: number; impacts: number[] }> = {};

  for (let i = 0; i < appearances; i++) {
    const podcast = MOCK_PODCASTS[Math.floor(Math.random() * MOCK_PODCASTS.length)]!;
    const episodeId = `ep-${podcast.id}-${i + 1}`;
    const deltaEntropy = (Math.random() - 0.5) * 0.4;
    const deltaDrift = (Math.random() - 0.5) * 0.3;
    
    deltaEntropies.push(deltaEntropy);
    deltaDrifts.push(deltaDrift);

    // Random game shift (30% chance)
    let gameShift: { from: Game; to: Game } | undefined;
    if (Math.random() < 0.3) {
      const from = GAMES[Math.floor(Math.random() * GAMES.length)]!;
      const to = GAMES.filter(g => g !== from)[Math.floor(Math.random() * (GAMES.length - 1))]!;
      gameShift = { from, to };
      gameShifts.push(gameShift);
    }

    episodes.push({
      episode_id: episodeId,
      podcast_id: podcast.id,
      podcast_title: podcast.title,
      episode_title: `Episode ${i + 1}`,
      delta_entropy: deltaEntropy,
      delta_drift: deltaDrift,
      game_shift: gameShift,
    });

    // Track host appearances
    const host = MOCK_HOSTS.find(h => h.podcast_ids.includes(podcast.id));
    if (host) {
      if (!hostAppearances[host.id]) {
        hostAppearances[host.id] = {
          host_name: host.name,
          count: 0,
          impacts: [],
        };
      }
      hostAppearances[host.id]!.count++;
      hostAppearances[host.id]!.impacts.push(Math.abs(deltaEntropy) + Math.abs(deltaDrift));
    }
  }

  const avgDeltaEntropy = deltaEntropies.reduce((a, b) => a + b, 0) / deltaEntropies.length;
  const avgDeltaDrift = deltaDrifts.reduce((a, b) => a + b, 0) / deltaDrifts.length;
  const avgImpactMagnitude = [...deltaEntropies, ...deltaDrifts]
    .map(v => Math.abs(v))
    .reduce((a, b) => a + b, 0) / (deltaEntropies.length + deltaDrifts.length);

  // Determine dominant game influence (most common "to" in shifts, or random)
  const shiftTos = gameShifts.map(s => s.to);
  const gameInfluenceCounts: Record<Game, number> = { G1: 0, G2: 0, G3: 0, G4: 0, G5: 0, G6: 0 };
  shiftTos.forEach(game => gameInfluenceCounts[game]++);
  const dominantGameInfluence = (Object.entries(gameInfluenceCounts) as [Game, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? GAMES[Math.floor(Math.random() * GAMES.length)]!;

  const topHosts = Object.entries(hostAppearances)
    .map(([host_id, data]) => ({
      host_id,
      host_name: data.host_name,
      appearances: data.count,
      avg_impact: data.impacts.reduce((a, b) => a + b, 0) / data.impacts.length,
    }))
    .sort((a, b) => b.appearances - a.appearances);

  const metrics: GuestMetrics = {
    avg_delta_entropy: avgDeltaEntropy,
    avg_delta_drift: avgDeltaDrift,
    avg_impact_magnitude: avgImpactMagnitude,
    games_shifted_count: gameShifts.length,
    dominant_game_influence: dominantGameInfluence,
    top_hosts: topHosts,
  };

  return {
    guest,
    metrics,
    appearances,
    episodes,
  };
}
