# Integration Tests for MetaSPN Pages

Integration tests using `agent-browser` to verify that host, guest, and podcast pages are rendering correctly with data.

## Prerequisites

1. Install `agent-browser`:
   ```bash
   npm install -g agent-browser
   agent-browser install
   ```

2. Start the development server (default port 3002):
   ```bash
   pnpm dev
   ```
   
   Note: The default test port is 3002. If your server runs on a different port, set `BASE_URL` environment variable.

## Running Tests

### Basic Tests
```bash
pnpm test:pages:dev
```

This will:
- Test host page (`/host/person_jay_clouse`)
- Test guest page (`/guest/person_10k_diver`)
- Test podcast page (`/podcast/creator_science`)
- Take screenshots of each page
- Verify key content is rendering

### Detailed Tests
```bash
pnpm test:pages:detailed
```

This runs more comprehensive checks:
- Verifies specific data elements
- Checks for charts and visualizations
- Validates tab navigation
- Provides detailed pass/fail results

### Tests with Auth Detection
```bash
pnpm test:pages:auth
```

This version:
- Detects authentication requirements
- Handles login redirects gracefully
- Provides guidance for authenticated testing
- Takes screenshots of both content and login pages

### Custom Base URL
```bash
BASE_URL=http://localhost:3002 pnpm test:pages
```

## Test Coverage

### Host Page Tests
- ✅ Page loads successfully
- ✅ Host name displays
- ✅ Host Overview metrics section
- ✅ Geometric Range visualization
- ✅ Trajectory charts (Entropy/Drift)
- ✅ Solo vs Guest Episodes comparison

### Guest Page Tests
- ⚠️  May require authentication
- ✅ Guest name displays (when accessible)
- ✅ Overview Stats with impact metrics
- ✅ Impact Breakdown section
- ✅ Notable Hosts list

### Podcast Page Tests
- ✅ Podcast title displays
- ✅ Tab navigation (Overview, Episodes, Guests, Geometry)
- ✅ Overview tab content (DNA card, radar chart, semantic space)
- ✅ Episode list functionality
- ⚠️  Trajectory tab (optional - may require data to be visible)

## Screenshots

Screenshots are saved in `test-screenshots/` directory:
- `host-person_jay_clouse.png`
- `guest-person_10k_diver.png`
- `podcast-creator_science.png`

## Troubleshooting

### agent-browser not found
```bash
npm install -g agent-browser
agent-browser install
```

### Page not loading
- Ensure dev server is running: `pnpm dev` (default port 3002)
- Check BASE_URL matches your server port (default: http://localhost:3002)
- Verify the test IDs exist in your static data files:
  - Host: `person_jay_clouse` in `src/lib/static-data/hosts.json`
  - Guest: `person_10k_diver` in `src/lib/static-data/guests.json`
  - Podcast: `creator_science` in `src/lib/static-data/podcasts.json`

### Tests failing
- Check browser console for errors
- Verify static data files are in correct format
- Ensure pages are building correctly: `pnpm build`

## Test Scripts

- `scripts/test-pages.js` - Basic integration tests
- `scripts/test-pages-detailed.js` - Detailed tests with element verification
- `scripts/test-pages.sh` - Bash version (alternative)
