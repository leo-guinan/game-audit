/**
 * API endpoint to seed the database with pre-processed analysis results
 * POST /api/demo/seed
 * 
 * This processes all episode × game combinations and stores them in the database.
 * Safe to run multiple times - will skip already-processed combinations.
 */

import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "../../../../../scripts/seed-demo-analysis";

export const maxDuration = 300; // 5 minutes for seed operation

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization check here
    // For now, allowing any POST request
    
    console.log('Starting database seed via API...');
    
    await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seed completed successfully',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
