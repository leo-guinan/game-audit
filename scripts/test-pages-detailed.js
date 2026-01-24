#!/usr/bin/env node

/**
 * Detailed integration tests for host/guest/podcast pages using agent-browser
 * Tests specific data elements and visualizations
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

async function testHostPage() {
  const hostId = 'person_jay_clouse';
  const url = `${BASE_URL}/host/${hostId}`;
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 Testing Host Page: Jay Clouse');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  runCommand(`agent-browser open "${url}"`, 'open page');
  runCommand('agent-browser wait 3000', 'wait for load');
  
  const results = {
    pageLoaded: false,
    hostName: false,
    metrics: false,
    charts: false,
    episodes: false,
  };
  
  // Check page loaded
  const title = runCommand('agent-browser get title', 'get title');
  results.pageLoaded = title.success;
  console.log(`  📄 Page title: ${title.output || 'N/A'}`);
  
  // Check host name
  const hostName = checkElement('h1', 'host name');
  if (hostName.found) {
    console.log(`  ✅ Host name found: "${hostName.text}"`);
    results.hostName = hostName.text.includes('Jay Clouse');
  } else {
    console.log('  ❌ Host name not found');
  }
  
  // Check metrics section
  const metrics = checkVisible('Host Overview', 'Host Overview');
  if (metrics.found) {
    console.log('  ✅ Host Overview section found');
    results.metrics = true;
    
    // Check for specific metrics
    const totalEpisodes = checkElement('text=episodes', 'total episodes');
    if (totalEpisodes.found) {
      console.log(`  ✅ Episodes count found`);
    }
  } else {
    console.log('  ❌ Host Overview section not found');
  }
  
  // Check charts
  const geometricRange = checkVisible('Geometric Range', 'Geometric Range');
  if (geometricRange.found) {
    console.log('  ✅ Geometric Range section found');
    results.charts = true;
  }
  
  const trajectory = checkVisible('Entropy Over Time', 'Entropy chart');
  if (trajectory.found) {
    console.log('  ✅ Trajectory charts found');
  }
  
  // Check solo vs guest comparison
  const soloGuest = checkVisible('Solo vs Guest Episodes', 'Solo vs Guest');
  if (soloGuest.found) {
    console.log('  ✅ Solo vs Guest comparison found');
    results.episodes = true;
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
  
  const results = {
    pageLoaded: false,
    guestName: false,
    impactMetrics: false,
    hosts: false,
  };
  
  const title = runCommand('agent-browser get title', 'get title');
  results.pageLoaded = title.success;
  console.log(`  📄 Page title: ${title.output || 'N/A'}`);
  
  // Check guest name
  const guestName = checkElement('h1', 'guest name');
  if (guestName.found) {
    console.log(`  ✅ Guest name found: "${guestName.text}"`);
    results.guestName = guestName.text.includes('10-K Diver');
  }
  
  // Check impact metrics
  const overview = checkVisible('Overview Stats', 'Overview Stats');
  if (overview.found) {
    console.log('  ✅ Overview Stats found');
    results.impactMetrics = true;
  }
  
  const impact = checkVisible('Impact Breakdown', 'Impact Breakdown');
  if (impact.found) {
    console.log('  ✅ Impact Breakdown found');
  }
  
  // Check notable hosts
  const hosts = checkVisible('Notable Hosts', 'Notable Hosts');
  if (hosts.found) {
    console.log('  ✅ Notable Hosts section found');
    results.hosts = true;
  }
  
  // Screenshot
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
  
  const results = {
    pageLoaded: false,
    podcastTitle: false,
    tabs: false,
    charts: false,
  };
  
  const title = runCommand('agent-browser get title', 'get title');
  results.pageLoaded = title.success;
  console.log(`  📄 Page title: ${title.output || 'N/A'}`);
  
  // Check podcast title
  const podcastTitle = checkElement('h1', 'podcast title');
  if (podcastTitle.found) {
    console.log(`  ✅ Podcast title found: "${podcastTitle.text}"`);
    results.podcastTitle = true;
  }
  
  // Check tabs
  const overviewTab = checkVisible('Overview', 'Overview tab');
  const episodesTab = checkVisible('Episodes', 'Episodes tab');
  if (overviewTab.found && episodesTab.found) {
    console.log('  ✅ Tabs found (Overview, Episodes)');
    results.tabs = true;
  }
  
  // Click on Overview tab to check content
  if (overviewTab.found) {
    runCommand('agent-browser click "text=Overview"', 'click Overview tab');
    runCommand('agent-browser wait 1000', 'wait for tab switch');
    
    // Check for radar chart or DNA card
    const radar = checkVisible('DNA', 'DNA card');
    if (radar.found) {
      console.log('  ✅ Overview content (DNA card) found');
      results.charts = true;
    }
  }
  
  // Screenshot
  const screenshot = path.join(SCREENSHOT_DIR, `podcast-${podcastId}.png`);
  runCommand(`agent-browser screenshot "${screenshot}"`, 'screenshot');
  console.log(`  📸 Screenshot: ${screenshot}`);
  
  return results;
}

async function runAllTests() {
  console.log('🧪 Starting detailed integration tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  
  // Check agent-browser
  const check = runCommand('agent-browser --version', 'check agent-browser');
  if (!check.success) {
    console.log('❌ agent-browser not found. Please install: npm install -g agent-browser');
    process.exit(1);
  }
  
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
  
  const pageResults = {
    host: Object.values(allResults.host).every(v => v === true),
    guest: Object.values(allResults.guest).every(v => v === true),
    podcast: Object.values(allResults.podcast).every(v => v === true),
  };
  
  console.log(`Host Page:    ${pageResults.host ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Guest Page:   ${pageResults.guest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Podcast Page: ${pageResults.podcast ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(pageResults).every(v => v === true);
  console.log('');
  console.log(`Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log(`📸 Screenshots: ${SCREENSHOT_DIR}`);
  
  if (!allPassed) {
    process.exit(1);
  }
}

runAllTests().catch((error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
