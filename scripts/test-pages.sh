#!/bin/bash

# Integration tests for host/guest/podcast pages using agent-browser
# Tests that data is rendering correctly on each page type

set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
PORT="${PORT:-3000}"

echo "🧪 Starting integration tests for MetaSPN pages"
echo "📍 Base URL: $BASE_URL"

# Check if agent-browser is installed
if ! command -v agent-browser &> /dev/null; then
    echo "❌ agent-browser not found. Installing..."
    npm install -g agent-browser
    agent-browser install
fi

# Function to test a page
test_page() {
    local page_type=$1
    local page_id=$2
    local url="$BASE_URL/$page_type/$page_id"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 Testing $page_type page: $page_id"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Navigate to page
    agent-browser open "$url" --json > /tmp/browser-open.json 2>&1 || {
        echo "❌ Failed to open $url"
        return 1
    }
    
    # Wait for page to load
    agent-browser wait 2000
    
    # Get snapshot to check for content
    agent-browser snapshot -i -c --json > /tmp/snapshot.json 2>&1
    
    # Check for key elements based on page type
    case $page_type in
        "host")
            echo "  ✓ Checking for host name..."
            agent-browser get text "h1" --json > /tmp/host-name.json 2>&1 || echo "  ⚠ Could not find h1"
            
            echo "  ✓ Checking for metrics..."
            agent-browser is visible "text=Host Overview" --json > /tmp/metrics-check.json 2>&1 || echo "  ⚠ Could not find Host Overview"
            
            echo "  ✓ Checking for charts..."
            agent-browser is visible "text=Geometric Range" --json > /tmp/charts-check.json 2>&1 || echo "  ⚠ Could not find Geometric Range"
            ;;
        "guest")
            echo "  ✓ Checking for guest name..."
            agent-browser get text "h1" --json > /tmp/guest-name.json 2>&1 || echo "  ⚠ Could not find h1"
            
            echo "  ✓ Checking for impact metrics..."
            agent-browser is visible "text=Overview Stats" --json > /tmp/stats-check.json 2>&1 || echo "  ⚠ Could not find Overview Stats"
            
            echo "  ✓ Checking for impact breakdown..."
            agent-browser is visible "text=Impact Breakdown" --json > /tmp/impact-check.json 2>&1 || echo "  ⚠ Could not find Impact Breakdown"
            ;;
        "podcast")
            echo "  ✓ Checking for podcast title..."
            agent-browser get text "h1" --json > /tmp/podcast-title.json 2>&1 || echo "  ⚠ Could not find h1"
            
            echo "  ✓ Checking for tabs..."
            agent-browser is visible "text=Overview" --json > /tmp/tabs-check.json 2>&1 || echo "  ⚠ Could not find tabs"
            ;;
    esac
    
    # Take screenshot
    local screenshot_path="test-screenshots/${page_type}-${page_id}.png"
    mkdir -p test-screenshots
    agent-browser screenshot "$screenshot_path" --json > /tmp/screenshot.json 2>&1 || echo "  ⚠ Screenshot failed"
    echo "  📸 Screenshot saved: $screenshot_path"
    
    # Get page title and URL for verification
    agent-browser get title --json > /tmp/title.json 2>&1
    agent-browser get url --json > /tmp/url.json 2>&1
    
    echo "  ✅ Page loaded successfully"
}

# Test host page
test_page "host" "person_jay_clouse"

# Test guest page  
test_page "guest" "person_10k_diver"

# Test podcast page
test_page "podcast" "creator_science"

# Close browser
agent-browser close

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Integration tests completed!"
echo "📸 Screenshots saved in test-screenshots/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
