/**
 * Seed script to pre-process all episode × game combinations
 * Run with: pnpm tsx scripts/seed-demo-analysis.ts
 * Or via API: POST /api/demo/seed
 * 
 * This script calls the dev API endpoints instead of loading Mastra directly.
 * Make sure the dev server is running: pnpm dev
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

const episodes = [
  { id: 'bill-gates', category: 'founders', file: 'bill_gates.md' },
  { id: 'james-dyson', category: 'founders', file: 'james_dyson.md' },
  { id: 'jenny', category: 'creator_science', file: 'jenny.md' },
  { id: 'paul-millerd', category: 'creator_science', file: 'paul_millerd.md' },
  { id: 'tommy', category: 'creator_science', file: 'tommy.md' },
];

const games = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

async function seedDatabase() {
  console.log('Starting database seed via API...');
  console.log(`API Base: ${API_BASE}`);
  console.log(`Processing ${episodes.length} episodes × ${games.length} games = ${episodes.length * games.length} combinations\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const episode of episodes) {
    console.log(`\n📚 Processing episode: ${episode.id}`);
    
    // Generate generic summary via API
    let genericSummary: string;
    try {
      // Check if already exists (we'll do this check via the API response or skip)
      // For now, always call the API - it will use cache if available
      console.log(`  ⏳ Generating generic summary via API...`);
      
      const response = await fetch(`${API_BASE}/api/demo/analyze/generic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: episode.id }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      genericSummary = data.genericSummary;
      console.log(`  ✓ Got generic summary (${genericSummary.length} characters)`);
    } catch (error) {
      console.error(`  ✗ Failed to generate generic summary:`, error);
      errors++;
      continue;
    }

    // Process each game for this episode
    for (const gameId of games) {
      try {
        console.log(`  ⏳ Processing ${gameId}...`);

        // Call the game analysis API
        const gameResponse = await fetch(`${API_BASE}/api/demo/analyze/game`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            episodeId: episode.id,
            selectedGame: gameId,
          }),
        });

        if (!gameResponse.ok) {
          throw new Error(`API error: ${gameResponse.status} ${gameResponse.statusText}`);
        }

        const gameData = await gameResponse.json();
        
        console.log(`    ✓ Alignment: ${gameData.alignment}%`);
        if (gameData.gameAlignedSummary) {
          console.log(`    ✓ Got game-aligned summary (${gameData.gameAlignedSummary.length} characters)`);
        }

        processed++;
        console.log(`    ✓ Processed ${episode.id} × ${gameId}`);
      } catch (error) {
        console.error(`    ✗ Error processing ${episode.id} × ${gameId}:`, error);
        errors++;
      }
    }
  }

  console.log(`\n\n✅ Seed complete!`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
}

// Run if called directly
if (require.main === module) {
  seedDatabase().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for use in API route
export { seedDatabase };
