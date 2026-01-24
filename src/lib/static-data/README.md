# Static Data Format for MetaSPN

This directory contains JSON data files that are loaded at build time to generate static pages for hosts, guests, and their relationships.

## File Structure

### `hosts.json`
Array of host data objects with full metrics. Each object should match the `HostData` interface:

```json
[
  {
    "host": {
      "id": "person_jay_clouse",
      "name": "Jay Clouse",
      "image_url": "https://example.com/image.jpg",
      "bio": "Host description",
      "podcast_ids": ["creator_science"]
    },
    "metrics": {
      "total_episodes": 150,
      "years_active": 5,
      "dominant_games": ["G2"],
      "experience_type": "Convergent",
      "entropy_range": [0.1, 0.8],
      "drift_range": [0.2, 0.9],
      "solo_episodes": {
        "count": 50,
        "avg_entropy": 0.3,
        "avg_drift": 0.4,
        "avg_experience_score": 75.5
      },
      "guest_episodes": {
        "count": 100,
        "avg_entropy": 0.6,
        "avg_drift": 0.5,
        "avg_experience_score": 82.3
      },
      "game_distribution": {
        "G1": 5.0,
        "G2": 70.0,
        "G3": 10.0,
        "G4": 10.0,
        "G5": 3.0,
        "G6": 2.0
      }
    }
  }
]
```

### `guests.json`
Array of guest data objects with full metrics and episode appearances:

```json
[
  {
    "guest": {
      "id": "person_paul_millerd",
      "name": "Paul Millerd",
      "image_url": "https://example.com/image.jpg",
      "bio": "Guest description"
    },
    "metrics": {
      "avg_delta_entropy": 0.15,
      "avg_delta_drift": 0.08,
      "avg_impact_magnitude": 0.23,
      "games_shifted_count": 3,
      "dominant_game_influence": "G4",
      "top_hosts": [
        {
          "host_id": "person_jay_clouse",
          "host_name": "Jay Clouse",
          "appearances": 5,
          "avg_impact": 0.25
        }
      ]
    },
    "appearances": 8,
    "episodes": [
      {
        "episode_id": "ep-creator_science-123",
        "podcast_id": "creator_science",
        "podcast_title": "Creator Science",
        "episode_title": "Episode 123: Building Sustainable Systems",
        "delta_entropy": 0.12,
        "delta_drift": 0.05,
        "game_shift": {
          "from": "G2",
          "to": "G4"
        }
      }
    ]
  }
]
```

### `podcast-hosts.json`
Mapping between podcasts and their hosts:

```json
[
  {
    "podcast_id": "creator_science",
    "host_id": "person_jay_clouse"
  },
  {
    "podcast_id": "founders",
    "host_id": "person_david_senra"
  }
]
```

### `guest-appearances.json`
All guest appearances across episodes (used for cross-referencing):

```json
[
  {
    "episode_id": "ep-creator_science-123",
    "podcast_id": "creator_science",
    "guest_id": "person_paul_millerd",
    "guest_name": "Paul Millerd",
    "delta_entropy": 0.12,
    "delta_drift": 0.05,
    "game_shift": {
      "from": "G2",
      "to": "G4"
    }
  }
]
```

## Type Definitions

All types are defined in `src/lib/types/metaspn.ts`:
- `Host` - Basic host information
- `HostMetrics` - Aggregated metrics for a host
- `HostData` - Combined host + metrics (used in hosts.json)
- `Guest` - Basic guest information
- `GuestMetrics` - Impact metrics for a guest
- `GuestData` - Combined guest + metrics + episodes (used in guests.json)
- `PodcastHostMapping` - Links podcasts to hosts
- `GuestAppearanceData` - Individual guest appearance record

## Usage

The data loader (`loader.ts`) provides functions to:
- `loadHostsData()` - Load all hosts
- `loadHostData(id)` - Load specific host
- `loadGuestsData()` - Load all guests
- `loadGuestData(id)` - Load specific guest
- `loadPodcastHostMappings()` - Get podcast-host relationships
- `getHostIdForPodcast(podcastId)` - Find host for a podcast
- `getPodcastsForHost(hostId)` - Find all podcasts for a host
- `loadGuestAppearances()` - Load all guest appearances
- `getGuestAppearances(guestId)` - Get appearances for a guest
- `getEpisodeAppearances(episodeId)` - Get guests for an episode

## Static Generation

These files are used during build time to:
1. Generate static paths for all host and guest pages
2. Pre-render pages with data at build time
3. Enable fast page loads without runtime data fetching

See `generateStaticParams` functions in the page components for implementation.
