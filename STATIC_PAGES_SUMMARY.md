# MetaSPN Static Pages Summary

## Page Locations

### Podcast Page
**Location**: `src/app/podcast/[id]/page.tsx`
- Enhanced Overview tab with radar chart and DNA card
- Episodes tab with filtering and sorting
- Trajectory tab with entropy and drift charts
- Guests tab with impact bars and leaderboards
- Geometry tab with enhanced scatterplot

### Host Page (NEW)
**Location**: `src/app/host/[id]/page.tsx`
- Geometric range visualization
- Entropy/drift history charts
- Solo vs guest comparison with box plots
- Top guests list
- **Static Generation**: ✅ Configured with `generateStaticParams`

### Guest Page (NEW)
**Location**: `src/app/guest/[id]/page.tsx`
- Overview stats with impact metrics
- Impact breakdown with sparkline
- Notable hosts list
- Collapsible episodes list
- **Static Generation**: ✅ Configured with `generateStaticParams`

## Static Data Files

### Current Status
Located in: `src/lib/static-data/`

1. **hosts.json** - Currently has minimal data (just basic host info)
2. **guests.json** - Currently has minimal data (just basic guest info)
3. **podcast-hosts.json** - Empty array `[]`
4. **guest-appearances.json** - Empty array `[]`

### Required Format

See `src/lib/static-data/DATA_FORMAT.md` for complete format documentation.

**Key Points:**
- `hosts.json` needs `host` + `metrics` objects
- `guests.json` needs `guest` + `metrics` + `appearances` + `episodes` arrays
- The loader automatically filters out entries without full metrics
- Static generation only works for entries with complete data

## Data Loader

**Location**: `src/lib/static-data/loader.ts`

Functions:
- `loadHostsData()` - Returns only hosts with full metrics
- `loadHostData(id)` - Get specific host
- `loadGuestsData()` - Returns only guests with full metrics
- `loadGuestData(id)` - Get specific guest
- `loadPodcastHostMappings()` - Get podcast-host relationships
- `getHostIdForPodcast(podcastId)` - Find host for podcast
- `getPodcastsForHost(hostId)` - Find podcasts for host

## Static Generation

**Location**: `src/lib/static-data/generate-static-paths.ts`

- `getAllHostIds()` - Returns IDs for static generation
- `getAllGuestIds()` - Returns IDs for static generation
- `hasStaticData()` - Check if data is available

**Implementation:**
- `src/app/host/[id]/page.tsx` exports `generateStaticParams()`
- `src/app/guest/[id]/page.tsx` exports `generateStaticParams()`
- Both read from static data files at build time
- Only generates paths for entries with complete metrics

## API Routes

**Host API**: `src/app/api/metaspn/host/[id]/route.ts`
- Tries static data first
- Falls back to mock data if not found

**Guest API**: `src/app/api/metaspn/guest/[id]/route.ts`
- Tries static data first
- Falls back to mock data if not found

## Next Steps

1. **Transform your data files** to include metrics:
   - Add `metrics` object to each host in `hosts.json`
   - Add `metrics`, `appearances`, and `episodes` to each guest in `guests.json`
   - Populate `podcast-hosts.json` with mappings
   - Populate `guest-appearances.json` with appearance records

2. **Build will automatically**:
   - Generate static paths for all hosts/guests with complete data
   - Pre-render pages at build time
   - Skip entries without metrics (they'll use mock data at runtime)

3. **Format Reference**:
   - See `src/lib/static-data/DATA_FORMAT.md` for detailed format
   - See `src/lib/static-data/schema.example.json` for example structure
   - See `src/lib/static-data/README.md` for type definitions

## Validation

The loader includes validation (`validate-and-transform.ts`) that:
- Checks for required fields
- Ensures game_distribution has all 6 games (G1-G6)
- Filters out incomplete entries
- Returns null for entries missing metrics

This means your current minimal data files won't break anything - they'll just be skipped until you add the metrics.
