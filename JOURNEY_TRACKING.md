# Journey Tracking & The Game About Games

This document describes the deep path tracking system that transforms user navigation into personalized insights and consensual data exchange.

## Overview

Instead of silently collecting data, we:
1. **Track visibly** - Users see their journey as they navigate
2. **Interpret transparently** - Show what we think their path means
3. **Exchange directly** - They choose whether to share
4. **Export freely** - They get their data + prompts for LLM exploration

## How It Works

### 1. Enhanced Path Tracking

**Location**: `src/lib/analytics/path-tracker.ts`

Tracks:
- **Time spent** per node (calculated when leaving)
- **Entry points** (which path they chose: path_a, path_b, path_c)
- **Navigation patterns** (linear, exploratory, direct, deep_dive)
- **Cross-game movement** (which games they visited)
- **Completion state** (did they finish any game?)

**Data Structure**:
```typescript
type FullJourney = {
  sessionId: string;
  timestampStart: number;
  gamesVisited: GameJourney[];
  totalTime: number;
  pathSignature: string; // e.g., "1i→fork→a→core→6i→fork→b→end"
  convertedToSubscriber: boolean;
}
```

### 2. Path Analysis Engine

**Location**: `src/lib/analytics/path-analyzer.ts`

Generates interpretations:
- **Primary Game** - First game they engaged with deeply
- **Entry Position** - Where they see themselves (invisible, frozen, crossroads, etc.)
- **Engagement Pattern** - How they process (linear, exploratory, direct, deep_dive)
- **Path Signature** - Compressed journey representation
- **Interpretation** - What we think it means

**Example Interpretation**:
```typescript
{
  primaryGame: 1,
  entryPosition: "frozen",
  engagementPattern: "exploratory",
  interpretation: {
    primaryStruggle: "You've built something that's captured you...",
    secondaryPattern: "Identity crisis is actually a network problem...",
    engagementStyle: "Pattern-matcher. You're testing fit...",
    predictedInterests: ["Death/rebirth narratives", "Network infrastructure"]
  }
}
```

### 3. Journey Reveal Page

**Location**: `src/app/games/journey/page.tsx`

**URL**: `/games/journey`

Shows users:
1. **Their Path** - Signature, games visited, entry point, time spent
2. **Interpretation** - What we think it means (primary struggle, patterns, interests)
3. **The Choice** - Share / Keep Private / Download

**Features**:
- Transparent interpretation
- Opt-in sharing (not automatic)
- Data export with LLM prompts
- Fathom tracking for reveal views

### 4. Data Export System

When users click "Download your data", they get:

**Files**:
- `journey-data.json` - Raw path data
- `my-interpretation.md` - What we think it means
- `prompts/01-the-mirror.md` - Understand your path
- `prompts/02-the-gap.md` - See what you avoided
- `prompts/03-the-integration.md` - Connect to your life
- `prompts/04-the-comparison.md` - Understand your divergence
- `prompts/05-the-conversation.md` - Go deeper
- `README.md` - How to use

**The Prompts**:
Users can drop these into Claude/ChatGPT with their data to:
- Get their own interpretations
- Explore what they avoided
- Connect insights to their actual situation
- Compare their path to others
- Have a deeper conversation

This exports the "oracle function" - not just the output, but the tools to interpret.

### 5. Consent-Based Sharing

**Location**: `src/app/api/games/journey/share/route.ts`

When users click "Share this with Leo":
- Stores journey data (currently logs, ready for database)
- Associates with email when they subscribe
- Used for personalized email sequences

**Key Principle**: No data collected without explicit consent. They see what we're collecting and choose.

### 6. Enhanced Subscription Tracking

**Location**: `src/components/coordination-game/signup-form.tsx`

When users subscribe, we now send:
- `path_signature` - Compressed journey
- `primary_game` - First game they engaged with
- `entry_position` - Where they see themselves
- `engagement_pattern` - How they process
- `journey_data` - Full journey object

**ConvertKit Custom Fields**:
- `game_path` - Full path string
- `path_signature` - Compressed signature
- `primary_game` - Game number
- `entry_position` - Entry archetype
- `engagement_pattern` - Pattern type
- `games_played` - Comma-separated game numbers
- `last_game_node` - Last node visited
- `subscription_source` - Where they subscribed

## Entry Positions

Each game has 3 entry positions (path_a, path_b, path_c):

**Game 1 (Identity)**:
- `invisible` - "I'm invisible" (Dog's Path)
- `frozen` - "I'm frozen" (Frozen God)
- `crossroads` - "I'm at a crossroads" (Crossroads)

**Game 2 (Idea Mining)**:
- `unmined` - Ideas not extracted
- `stolen` - Ideas being taken
- `loop` - Stuck in generation loop

**Game 3 (Model/Understanding)**:
- `armchair` - Theoretical understanding
- `unused_map` - Models not applied
- `illegible` - System too complex

**Game 4 (Performance/Coaching)**:
- `window` - Watching others
- `mirror` - Reflecting but not improving
- `bottleneck` - Performance blocked

**Game 5 (Meaning/Sensemaking)**:
- `reluctant` - Hesitant to make meaning
- `weaponized` - Meaning as control
- `empty` - Meaning feels hollow

**Game 6 (Network/Coordination)**:
- `leaky` - Connections don't capture value
- `indispensable` - Trapped by position
- `isolated` - Disconnected from network

## Engagement Patterns

**Linear**: Systematic thinker, wants full picture
- Completes one game start to finish
- Visits intro → fork → path → shared → ending

**Exploratory**: Pattern-matcher, testing fit
- Bounces between paths
- Revisits nodes
- Cross-game movement

**Direct**: Action-oriented, wants answer
- Fork → one path → done
- Minimal exploration

**Deep Dive**: Theory-seeking
- Spends significant time on shared nodes (core_problem, cycle)
- Wants to understand the system

## Cross-Game Patterns

Common movements reveal deeper struggles:

- **1→6**: Identity crisis is actually a network problem
- **2→3**: Idea problem is actually a model problem
- **1→5**: Identity and meaning are entangled
- **3→6**: Understanding reveals network as leverage point
- **4→1**: Performance issues stem from identity confusion
- **5→6**: Meaning-making requires network coordination

## What This Enables

### For Users:
- **Self-knowledge** - Journey reveals something about themselves
- **Agency** - They control what's shared
- **Context** - See where they fit (with aggregate stats)
- **Trust** - We showed our cards first

### For Creator:
- **Signal quality** - Consented data > scraped data
- **Relationship foundation** - Mutual transparency
- **Research data** - Patterns across journeys
- **Differentiation** - Nobody else does this

### For the Thesis:
- **Proof of concept** - Ethical data exchange
- **Demonstration** - Visibility → Legibility → Agency
- **Infrastructure** - Pattern others can use

## Future Enhancements

1. **Aggregate Stats API** - Show path rarity, common next moves
2. **Database Storage** - Store shared journeys for analysis
3. **Email Sequences** - Personalized based on path signatures
4. **Workshop Targeting** - Identify game-mixers, theory-seekers
5. **Product Development Signals** - Which game combinations are most common

## The Meta-Level

This is playing Game 6 (Network/Coordination) while building tools for Game 3 (Model/Understanding).

You're creating infrastructure that makes invisible patterns visible—the exact thesis of MetaSPN. The path data isn't just marketing signal. It's research. You're building an observatory for how people navigate identity and game-mixing.

Over time, this data could reveal:
- Which game combinations are most common (and most dysfunctional)
- Which paths predict which outcomes
- Where people get stuck (and what unsticks them)
- How self-perception differs from actual behavior

That's not just newsletter segmentation. That's the beginning of a legibility engine for the creator economy.
