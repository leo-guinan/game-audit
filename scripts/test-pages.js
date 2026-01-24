#!/usr/bin/env node

/**
 * Integration tests for host/guest/podcast pages using agent-browser
 * Tests that data is rendering correctly on each page type
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';
const SCREENSHOT_DIR = path.join(process.cwd(), 'test-screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Test data - using IDs from static data files
const TEST_CASES = [
  { type: 'host', id: 'person_jay_clouse', name: 'Jay Clouse' },
  { type: 'guest', id: 'person_10k_diver', name: '10-K Diver' },
  { type: 'podcast', id: 'creator_science', name: 'Creator Science' },
];

function runCommand(cmd, description) {
  try {
    const result = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: error.stdout || error.stderr || ''
    };
  }
}

function checkAgentBrowser() {
  console.log('🔍 Checking for agent-browser...');
  const check = runCommand('agent-browser --version', 'check version');
  if (!check.success) {
    console.log('❌ agent-browser not found. Installing...');
    runCommand('npm install -g agent-browser', 'install agent-browser');
    runCommand('agent-browser install', 'install browser');
  } else {
    console.log('✅ agent-browser found');
  }
}

async function testPage(testCase) {
  const { type, id, name } = testCase;
  const url = `${BASE_URL}/${type}/${encodeURIComponent(id)}`;
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🧪 Testing ${type} page: ${name} (${id})`);
  console.log(`📍 URL: ${url}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Navigate to page
  console.log('  📍 Navigating to page...');
  const openResult = runCommand(`agent-browser open "${url}"`, 'open page');
  if (!openResult.success) {
    console.log(`  ❌ Failed to open page: ${openResult.error}`);
    return false;
  }
  
  // Wait for page to load
  console.log('  ⏳ Waiting for page to load...');
  runCommand('agent-browser wait 3000', 'wait for load');
  
  // Get page title
  const titleResult = runCommand('agent-browser get title', 'get title');
  if (titleResult.success) {
    console.log(`  📄 Page title: ${titleResult.output.trim()}`);
  }
  
  // Get snapshot to verify content
  console.log('  🔍 Checking page content...');
  const snapshotResult = runCommand('agent-browser snapshot -i -c', 'get snapshot');
  
  // Check for key elements based on page type
  let checks = [];
  
  switch (type) {
    case 'host':
      checks = [
        { selector: 'h1', description: 'Host name (h1)' },
        { text: 'Host Overview', description: 'Host Overview section' },
        { text: 'Geometric Range', description: 'Geometric Range section' },
        { text: 'Solo vs Guest Episodes', description: 'Solo vs Guest comparison' },
      ];
      break;
    case 'guest':
      checks = [
        { selector: 'h1', description: 'Guest name (h1)' },
        { text: 'Overview Stats', description: 'Overview Stats section' },
        { text: 'Impact Breakdown', description: 'Impact Breakdown section' },
        { text: 'Notable Hosts', description: 'Notable Hosts section' },
      ];
      break;
    case 'podcast':
      checks = [
        { selector: 'h1', description: 'Podcast title (h1)' },
        { text: 'Overview', description: 'Overview tab', required: true },
        { text: 'Episodes', description: 'Episodes tab', required: true },
        { text: 'Trajectory', description: 'Trajectory tab', required: false }, // Tab exists but may not be visible until clicked
        { text: 'Guests', description: 'Guests tab', required: false },
        { text: 'Geometry', description: 'Geometry tab', required: false },
      ];
      break;
  }
  
  let allChecksPassed = true;
  for (const check of checks) {
    const isRequired = check.required !== false; // Default to required unless explicitly false
    if (check.selector) {
      const result = runCommand(`agent-browser get text "${check.selector}"`, `check ${check.description}`);
      if (result.success && result.output.trim()) {
        console.log(`  ✅ ${check.description}: "${result.output.trim().substring(0, 50)}"`);
      } else {
        if (isRequired) {
          console.log(`  ❌ ${check.description}: Not found (required)`);
          allChecksPassed = false;
        } else {
          console.log(`  ⚠️  ${check.description}: Not found (optional)`);
        }
      }
    } else if (check.text) {
      const result = runCommand(`agent-browser is visible "text=${check.text}"`, `check ${check.description}`);
      if (result.success) {
        console.log(`  ✅ ${check.description}: Found`);
      } else {
        if (isRequired) {
          console.log(`  ❌ ${check.description}: Not found (required)`);
          allChecksPassed = false;
        } else {
          console.log(`  ⚠️  ${check.description}: Not found (optional)`);
        }
      }
    }
  }
  
  // Take screenshot
  const screenshotPath = path.join(SCREENSHOT_DIR, `${type}-${id.replace(/[^a-z0-9]/gi, '_')}.png`);
  console.log(`  📸 Taking screenshot...`);
  const screenshotResult = runCommand(`agent-browser screenshot "${screenshotPath}"`, 'take screenshot');
  if (screenshotResult.success) {
    console.log(`  ✅ Screenshot saved: ${screenshotPath}`);
  } else {
    console.log(`  ⚠️  Screenshot failed: ${screenshotResult.error}`);
  }
  
  return allChecksPassed;
}

async function runTests() {
  console.log('🧪 Starting integration tests for MetaSPN pages');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('');
  
  // Check agent-browser
  checkAgentBrowser();
  
  // Run tests
  const results = [];
  for (const testCase of TEST_CASES) {
    const passed = await testPage(testCase);
    results.push({ ...testCase, passed });
  }
  
  // Close browser
  console.log('');
  console.log('🔒 Closing browser...');
  runCommand('agent-browser close', 'close browser');
  
  // Summary
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  let allPassed = true;
  for (const result of results) {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.type}: ${result.name} (${result.id})`);
    if (!result.passed) allPassed = false;
  }
  
  console.log('');
  if (allPassed) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed. Check the output above for details.');
    process.exit(1);
  }
  
  console.log(`📸 Screenshots saved in: ${SCREENSHOT_DIR}`);
  console.log('');
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
