# MetaSPN Podcast DB & Test Data

## SQLite (`podcast_data.db`)

- **Default path:** `/Users/leoguinan/founder_scraper/podcast_data.db`
- **Override:** set `PODCAST_DB_PATH` to your DB path (e.g. in `.env` or env when running scripts).

When the DB is available, MetaSPN API routes and the dump script use live data from it.

## Test data (fallback)

When the DB is **not** available (e.g. missing file or wrong path), the API falls back to static test-data JSON under `src/lib/test-data/`.

### Generating test data

From the project root:

```bash
# Use default DB path
pnpm run dump:podcast

# Or set path explicitly
PODCAST_DB_PATH=/path/to/podcast_data.db pnpm run dump:podcast
```

This:

1. Connects to `podcast_data.db`
2. Runs discovery queries (podcasts, episodes, classification, geometry)
3. Writes JSON into `src/lib/test-data/`:
   - `podcasts-index.json` – all podcasts + metrics
   - `podcast/{id}.json` – full overview per podcast
   - `episode/{safe-id}.json` – episode page payload (sample episodes per podcast)
   - `episode-index.json` – map `episode_id` → filename
   - `compare/{id1}_vs_{id2}.json` – compare payload
   - `meta.json` – source path, generated timestamp, podcast IDs

## API routes

| Route | Purpose |
|-------|---------|
| `GET /api/metaspn/podcasts` | List all podcasts + metrics |
| `GET /api/metaspn/podcast/[id]` | Podcast overview (metrics, geometry, experience, centroids) |
| `GET /api/metaspn/episode/[id]` | Episode page (classification, geometry, experience, segments, evidence) |
| `GET /api/metaspn/episodes?game=G2` | Episodes by game |
| `GET /api/metaspn/episodes?boundary=1` | Boundary episodes |
| `GET /api/metaspn/compare?podcast1=&podcast2=` | Compare two podcasts |

Responses include `"source": "db"` or `"source": "test-data"` depending on whether live DB or test-data was used.

## Chroma (`podcast_data_chroma`)

Chroma stores embeddings. The app currently uses **SQLite only**; embeddings are referenced via `episode_embedding.embedding_id_*` in the DB. Hooking up Chroma (e.g. for similarity search or richer semantics) would require a small Python service or similar that the Next.js app can call, since Chroma is typically used from Python.
