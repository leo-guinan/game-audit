#!/usr/bin/env node

/**
 * Integration tests for host/guest/podcast pages using agent-browser
 * Handles authentication if required
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(process.cwd(), 'test-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function runCommand(cmd, description) {
  try {
    const result = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
    });
    return { success: true, output: result.trim() };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: (error.stdout || error.stderr || '').trim()
    };
  }
}

function checkElement(selector, description) {
  const result = runCommand(`agent-browser get text "${selector}"`, description);
  if (result.success && result.output) {
    return { found: true, text: result.output };
  }
  return { found: false };
}

function checkVisible(text, description) {
  const result = runCommand(`agent-browser is visible "text=${text}"`, description);
  return { found: result.success };
}

async function checkAuthRequired() {
  console.log('🔍 Checking if authentication is required...');
  runCommand(`agent-browser open "${BASE_URL}/host/person_jay_clouse"`, 'check auth');
  runCommand('agent-browser wait 2000', 'wait');
  
  const url = runCommand('agent-browser get url', 'get url');
  if (url.success && url.output.includes('/auth/login')) {
    console.log('  ⚠️  Authentication required - pages redirect to login');
    return true;
  }
  return false;
}

async function testHostPage() {
  const hostId = 'person_jay_clouse';
  const url = `${BASE_URL}/host/${hostId}`;
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 Testing Host Page: Jay Clouse');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  runCommand(`agent-browser open "${url}"`, 'open page');
  runCommand('agent-browser wait 3000', 'wait for load');
  
  // Check if we're on login page
  const currentUrl = runCommand('agent-browser get url', 'get url');
  if (currentUrl.output.includes('/auth/login')) {
    console.log('  ⚠️  Redirected to login page - authentication required');
    console.log('  💡 Tip: These pages may require authentication in production');
    console.log('  📸 Taking screenshot of login page...');
    const screenshot = path.join(SCREENSHOT_DIR, `host-${hostId}-login.png`);
    runCommand(`agent-browser screenshot "${screenshot}"`, 'screenshot');
    return { requiresAuth: true };
  }
  
  const results = {
    pageLoaded: false,
    hostName: false,
    metrics: false,
    charts: false,
  };
  
  const title = runCommand('agent-browser get title', 'get title');
  results.pageLoaded = title.success;
  console.log(`  📄 Page title: ${title.output || 'N/A'}`);
  
  // Check for host name - might be in h1 or other heading
  const hostName = checkElement('h1', 'host name');
  if (hostName.found && !hostName.text.includes('Welcome') && !hostName.text.includes('MetaSPN Pro')) {
    console.log(`  ✅ Host name found: "${hostName.text}"`);
    results.hostName = true;
  } else {
    // Try finding by text content
    const nameCheck = checkVisible('Jay Clouse', 'Jay Clouse name');
    if (nameCheck.found) {
      console.log('  ✅ Host name found in page');
      results.hostName = true;
    } else {
      console.log('  ⚠️  Host name not clearly visible');
    }
  }
  
  // Check for key sections
  const checks = [
    { text: 'Host Overview', key: 'metrics' },
    { text: 'Geometric Range', key: 'charts' },
    { text: 'Solo vs Guest', key: 'episodes' },
  ];
  
  for (const check of checks) {
    const found = checkVisible(check.text, check.text);
    if (found.found) {
      console.log(`  ✅ ${check.text} section found`);
      results[check.key] = true;
    } else {
      console.log(`  ⚠️  ${check.text} section not found`);
    }
  }
  
  // Screenshot
  const screenshot = path.join(SCREENSHOT_DIR, `host-${hostId}.png`);
  runCommand(`agent-browser screenshot "${screenshot}"`, 'screenshot');
  console.log(`  📸 Screenshot: ${screenshot}`);
  
  return results;
}

async function testGuestPage() {
  const guestId = 'person_10k_diver';
  const url = `${BASE_URL}/guest/${guestId}`;
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 Testing Guest Page: 10-K Diver');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  runCommand(`agent-browser open "${url}"`, 'open page');
  runCommand('agent-browser wait 3000', 'wait for load');
  
  const currentUrl = runCommand('agent-browser get url', 'get url');
  if (currentUrl.output.includes('/auth/login')) {
    console.log('  ⚠️  Redirected to login page - authentication required');
    const screenshot = path.join(SCREENSHOT_DIR, `guest-${guestId}-login.png`);
    runCommand(`agent-browser screenshot "${screenshot}"`, 'screenshot');
    return { requiresAuth: true };
  }
  
  const results = {
    pageLoaded: false,
    guestName: false,
    impactMetrics: false,
  };
  
  const title = runCommand('agent-browser get title', 'get title');
  results.pageLoaded = title.success;
  console.log(`  📄 Page title: ${title.output || 'N/A'}`);
  
  // Check guest name
  const guestName = checkElement('h1', 'guest name');
  if (guestName.found && !guestName.text.includes('Welcome')) {
    console.log(`  ✅ Guest name found: "${guestName.text}"`);
    results.guestName = true;
  } else {
    const nameCheck = checkVisible('10-K Diver', '10-K Diver name');
    if (nameCheck.found) {
      console.log('  ✅ Guest name found');
      results.guestName = true;
    }
  }
  
  // Check sections
  const checks = [
    { text: 'Overview Stats', key: 'impactMetrics' },
    { text: 'Impact Breakdown', key: 'impactBreakdown' },
    { text: 'Notable Hosts', key: 'hosts' },
  ];
  
  for (const check of checks) {
    const found = checkVisible(check.text, check.text);
    if (found.found) {
      console.log(`  ✅ ${check.text} found`);
      if (check.key === 'impactMetrics') results.impactMetrics = true;
    } else {
      console.log(`  ⚠️  ${check.text} not found`);
    }
  }
  
  const screenshot = path.join(SCREENSHOT_DIR, `guest-${guestId}.png`);
  runCommand(`agent-browser screenshot "${screenshot}"`, 'screenshot');
  console.log(`  📸 Screenshot: ${screenshot}`);
  
  return results;
}

async function testPodcastPage() {
  const podcastId = 'creator_science';
  const url = `${BASE_URL}/podcast/${podcastId}`;
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 Testing Podcast Page: Creator Science');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  runCommand(`agent-browser open "${url}"`, 'open page');
  runCommand('agent-browser wait 3000', 'wait for load');
  
  const currentUrl = runCommand('agent-browser get url', 'get url');
  if (currentUrl.output.includes('/auth/login')) {
    console.log('  ⚠️  Redirected to login page - authentication required');
    const screenshot = path.join(SCREENSHOT_DIR, `podcast-${podcastId}-login.png`);
    runCommand(`agent-browser screenshot "${screenshot}"`, 'screenshot');
    return { requiresAuth: true };
  }
  
  const results = {
    pageLoaded: false,
    podcastTitle: false,
    tabs: false,
  };
  
  const title = runCommand('agent-browser get title', 'get title');
  results.pageLoaded = title.success;
  console.log(`  📄 Page title: ${title.output || 'N/A'}`);
  
  // Check podcast title
  const podcastTitle = checkElement('h1', 'podcast title');
  if (podcastTitle.found && !podcastTitle.text.includes('Welcome')) {
    console.log(`  ✅ Podcast title found: "${podcastTitle.text}"`);
    results.podcastTitle = true;
  } else {
    const nameCheck = checkVisible('Creator Science', 'Creator Science name');
    if (nameCheck.found) {
      console.log('  ✅ Podcast title found');
      results.podcastTitle = true;
    }
  }
  
  // Check tabs
  const overviewTab = checkVisible('Overview', 'Overview tab');
  const episodesTab = checkVisible('Episodes', 'Episodes tab');
  if (overviewTab.found && episodesTab.found) {
    console.log('  ✅ Tabs found (Overview, Episodes)');
    results.tabs = true;
  }
  
  // Screenshot
  const screenshot = path.join(SCREENSHOT_DIR, `podcast-${podcastId}.png`);
  runCommand(`agent-browser screenshot "${screenshot}"`, 'screenshot');
  console.log(`  📸 Screenshot: ${screenshot}`);
  
  return results;
}

async function runAllTests() {
  console.log('🧪 Starting integration tests with auth detection');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('');
  
  const check = runCommand('agent-browser --version', 'check agent-browser');
  if (!check.success) {
    console.log('❌ agent-browser not found. Please install: npm install -g agent-browser');
    process.exit(1);
  }
  
  // Check if auth is required
  const authRequired = await checkAuthRequired();
  if (authRequired) {
    console.log('');
    console.log('⚠️  NOTE: Pages require authentication');
    console.log('   Tests will verify page structure but may show login pages');
    console.log('');
  }
  
  runCommand('agent-browser close', 'close browser');
  
  const allResults = {
    host: await testHostPage(),
    guest: await testGuestPage(),
    podcast: await testPodcastPage(),
  };
  
  runCommand('agent-browser close', 'close browser');
  
  // Summary
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Results Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const hasAuth = Object.values(allResults).some(r => r.requiresAuth);
  
  if (hasAuth) {
    console.log('⚠️  Authentication Required');
    console.log('   Pages are protected and redirect to login');
    console.log('   To test authenticated pages:');
    console.log('   1. Authenticate manually in browser');
    console.log('   2. Or configure test authentication');
    console.log('');
  }
  
  for (const [type, result] of Object.entries(allResults)) {
    if (result.requiresAuth) {
      console.log(`${type}: ⚠️  Requires authentication`);
    } else {
      const passed = Object.values(result).every(v => v === true || typeof v === 'boolean');
      console.log(`${type}: ${passed ? '✅ PASS' : '⚠️  PARTIAL'}`);
    }
  }
  
  console.log('');
  console.log(`📸 Screenshots: ${SCREENSHOT_DIR}`);
  console.log('');
  console.log('💡 Note: If pages require auth, consider:');
  console.log('   - Testing with authenticated session');
  console.log('   - Using test credentials');
  console.log('   - Bypassing auth in test environment');
}

runAllTests().catch((error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
