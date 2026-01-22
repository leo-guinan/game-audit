/**
 * Analyze user's path to generate interpretations and insights
 */

import type { FullJourney, GameJourney } from "./path-tracker";

export type PathInterpretation = {
  primaryGame?: number;
  secondaryGame?: number;
  entryPosition?: string;
  engagementPattern: "linear" | "exploratory" | "direct" | "deep_dive";
  pathSignature: string;
  interpretation: {
    primaryStruggle: string;
    secondaryPattern?: string;
    engagementStyle: string;
    predictedInterests: string[];
  };
};

const GAME_NAMES: Record<number, string> = {
  1: "Identity/Canon",
  2: "Idea Mining",
  3: "Model/Understanding",
  4: "Performance/Coaching",
  5: "Meaning/Sensemaking",
  6: "Network/Coordination",
};

const ENTRY_POSITIONS: Record<string, Record<string, string>> = {
  1: {
    path_a: "invisible",
    path_b: "frozen",
    path_c: "crossroads",
  },
  2: {
    path_a: "unmined",
    path_b: "stolen",
    path_c: "loop",
  },
  3: {
    path_a: "armchair",
    path_b: "unused_map",
    path_c: "illegible",
  },
  4: {
    path_a: "window",
    path_b: "mirror",
    path_c: "bottleneck",
  },
  5: {
    path_a: "reluctant",
    path_b: "weaponized",
    path_c: "empty",
  },
  6: {
    path_a: "leaky",
    path_b: "indispensable",
    path_c: "isolated",
  },
};

/**
 * Analyze journey and generate interpretation
 */
export function analyzePath(journey: FullJourney): PathInterpretation {
  const games = journey.gamesVisited;
  const primaryGame = games[0]?.game;
  const secondaryGame = games.length > 1 ? games[1].game : undefined;

  // Determine entry position
  const entryPosition = primaryGame && games[0].entryPoint
    ? ENTRY_POSITIONS[primaryGame]?.[games[0].entryPoint]
    : undefined;

  // Determine engagement pattern
  const engagementPattern = determineEngagementPattern(journey);

  // Generate interpretation
  const interpretation = generateInterpretation(journey, primaryGame, secondaryGame, entryPosition, engagementPattern);

  return {
    primaryGame,
    secondaryGame,
    entryPosition,
    engagementPattern,
    pathSignature: journey.pathSignature,
    interpretation,
  };
}

function determineEngagementPattern(journey: FullJourney): PathInterpretation["engagementPattern"] {
  const games = journey.gamesVisited;
  
  // Count revisits (exploratory)
  const nodeVisits = new Map<string, number>();
  games.forEach((g) => {
    g.nodesVisited.forEach((node) => {
      nodeVisits.set(node, (nodeVisits.get(node) || 0) + 1);
    });
  });
  const revisits = Array.from(nodeVisits.values()).filter((v) => v > 1).length;

  // Check if they visited shared nodes (deep dive)
  const hasSharedNodes = games.some((g) =>
    g.nodesVisited.some((n) => n === "core_problem" || n === "cycle")
  );

  // Check if they completed any game (linear)
  const completed = games.some((g) => g.completed);

  // Check if they jumped between games (exploratory)
  const crossGame = games.length > 1;

  // Average time per node
  const avgTime = games.reduce((sum, g) => {
    const total = Object.values(g.timePerNode).reduce((s, t) => s + t, 0);
    return sum + total / (g.nodesVisited.length || 1);
  }, 0) / games.length;

  if (hasSharedNodes && avgTime > 60000) {
    return "deep_dive";
  }
  if (revisits > 2 || crossGame) {
    return "exploratory";
  }
  if (completed && games.length === 1) {
    return "linear";
  }
  return "direct";
}

function generateInterpretation(
  journey: FullJourney,
  primaryGame?: number,
  secondaryGame?: number,
  entryPosition?: string,
  engagementPattern: PathInterpretation["engagementPattern"] = "direct"
): PathInterpretation["interpretation"] {
  const primaryStruggle = getPrimaryStruggle(primaryGame, entryPosition);
  const secondaryPattern = secondaryGame
    ? getCrossGamePattern(primaryGame, secondaryGame)
    : undefined;
  const engagementStyle = getEngagementStyle(engagementPattern);
  const predictedInterests = getPredictedInterests(journey, primaryGame, secondaryGame);

  return {
    primaryStruggle,
    secondaryPattern,
    engagementStyle,
    predictedInterests,
  };
}

function getPrimaryStruggle(game?: number, entry?: string): string {
  if (!game) return "Exploring the games framework";
  
  const base = GAME_NAMES[game] || `Game ${game}`;
  
  if (entry) {
    const entryMap: Record<string, string> = {
      invisible: "You see yourself as pre-emergence, hidden, not yet visible.",
      frozen: "You've built something that's captured you. You're looking for an exit that isn't destruction.",
      crossroads: "You're at a decision point about who you want to become.",
      unmined: "You have ideas but haven't extracted them yet.",
      stolen: "Your ideas are being taken without credit or value capture.",
      loop: "You're stuck in a pattern of idea generation without application.",
      armchair: "You understand systems theoretically but haven't applied them.",
      unused_map: "You have models but they're not being used.",
      illegible: "The system you're in is too complex to read.",
      window: "You're watching others perform but not performing yourself.",
      mirror: "You're reflecting on performance but not improving.",
      bottleneck: "Performance is blocked by a constraint.",
      reluctant: "You're hesitant to make meaning or take a stance.",
      weaponized: "Meaning has become a tool for control or conflict.",
      empty: "The meaning you're creating feels hollow.",
      leaky: "Your network connections aren't capturing value.",
      indispensable: "You're positioned as essential but it's trapping you.",
      isolated: "You're disconnected from the network you need.",
    };
    return entryMap[entry] || `You're exploring ${base}.`;
  }
  
  return `You're exploring ${base}.`;
}

function getCrossGamePattern(primary?: number, secondary?: number): string {
  if (!primary || !secondary) return "";
  
  const patterns: Record<string, string> = {
    "1→6": "Identity crisis is actually a network problem. Who you are is entangled with where you sit in the system.",
    "2→3": "Idea problem is actually a model problem. You can't extract because you don't understand the system.",
    "1→5": "Identity and meaning are entangled. You're trying to figure out who you are through what it means.",
    "3→6": "Understanding the system reveals network positioning as the real leverage point.",
    "4→1": "Performance issues stem from identity confusion. You don't know who you're performing as.",
    "5→6": "Meaning-making requires network coordination. You need others to validate and amplify meaning.",
  };
  
  const key = `${primary}→${secondary}`;
  return patterns[key] || `You moved from ${GAME_NAMES[primary]} to ${GAME_NAMES[secondary]}.`;
}

function getEngagementStyle(pattern: PathInterpretation["engagementPattern"]): string {
  const styles: Record<PathInterpretation["engagementPattern"], string> = {
    linear: "Systematic thinker. You want the full picture before acting.",
    exploratory: "Pattern-matcher. You're testing fit, exploring connections.",
    direct: "Action-oriented. You want the answer, not the theory.",
    deep_dive: "Theory-seeking. You want to understand the system, not just escape it.",
  };
  return styles[pattern] || "Engaged explorer.";
}

function getPredictedInterests(
  journey: FullJourney,
  primary?: number,
  secondary?: number
): string[] {
  const interests: string[] = [];
  
  if (primary === 1) {
    interests.push("Identity formation", "Emergence narratives");
    if (journey.gamesVisited[0]?.entryPoint === "path_b") {
      interests.push("Death/rebirth narratives", "Elevation");
    }
  }
  
  if (primary === 6 || secondary === 6) {
    interests.push("Network infrastructure", "Coordination games");
  }
  
  if (journey.gamesVisited.some((g) => g.nodesVisited.includes("core_problem"))) {
    interests.push("System design", "Root cause analysis");
  }
  
  if (primary === 3 || secondary === 3) {
    interests.push("Model building", "Understanding complex systems");
  }
  
  if (primary === 5 || secondary === 5) {
    interests.push("Sensemaking", "Meaning-making frameworks");
  }
  
  return interests.length > 0 ? interests : ["The 6 Games framework"];
}
