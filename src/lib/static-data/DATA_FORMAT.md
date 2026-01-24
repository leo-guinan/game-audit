# Static Data Format Guide

## Current Status

Your current data files (`hosts.json` and `guests.json`) contain **minimal data** (just basic host/guest info). To enable static page generation with full functionality, you need to add **metrics data**.

## Required Data Structure

### hosts.json

Currently you have:
```json
[
  {
    "id": "person_jay_clouse",
    "name": "Jay Clouse",
    "podcast_ids": ["creator_science"]
  }
]
```

**You need to transform it to:**
```json
[
  {
    "host": {
      "id": "person_jay_clouse",
      "name": "Jay Clouse",
      "image_url": null,
      "bio": null,
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

### guests.json

Currently you have:
```json
[
  {
    "id": "person_paul_millerd",
    "name": "Paul Millerd"
  }
]
```

**You need to transform it to:**
```json
[
  {
    "guest": {
      "id": "person_paul_millerd",
      "name": "Paul Millerd",
      "image_url": null,
      "bio": null
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

## Page Locations

The redesigned pages are located at:

- **Podcast Page**: `src/app/podcast/[id]/page.tsx`
  - Enhanced with radar charts, trajectory charts, guest impact bars, and episode lists
  
- **Host Page**: `src/app/host/[id]/page.tsx` (NEW)
  - Shows geometric range, entropy/drift history, solo vs guest comparisons, and top guests
  
- **Guest Page**: `src/app/guest/[id]/page.tsx` (NEW)
  - Shows overview stats, impact breakdown, notable hosts, and episode appearances

## Static Generation

The pages include `generateStaticParams` functions that will:
1. Read from `hosts.json` and `guests.json` at build time
2. Generate static paths for all hosts and guests
3. Pre-render pages during build

**Note**: Currently, the loader filters out entries without full metrics. Once you add metrics to your data files, static generation will work automatically.

## Next Steps

1. **Add metrics to hosts.json**: Calculate and add the `metrics` object for each host
2. **Add metrics to guests.json**: Calculate and add the `metrics`, `appearances`, and `episodes` arrays for each guest
3. **Update podcast-hosts.json**: Ensure all podcast-host relationships are mapped
4. **Update guest-appearances.json**: Add all guest appearance records with impact data

Once the data is in the correct format, the pages will automatically:
- Generate static paths at build time
- Pre-render with actual data
- Fall back to mock data if static data is incomplete
