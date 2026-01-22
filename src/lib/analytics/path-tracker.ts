/**
 * Track user's journey through the games
 * Stores path in sessionStorage and provides methods to read/update it
 */

export type PathStep = {
  gameNumber: number;
  nodeType: "intro" | "fork" | "path" | "shared" | "ending";
  nodeId?: string; // path_a, core_problem, etc.
  timestamp: number;
  timeSpent?: number; // milliseconds spent on this node (calculated when leaving)
};

export type GameJourney = {
  game: number;
  entryPoint?: string; // path_a, path_b, path_c
  nodesVisited: string[]; // ["intro", "fork", "path_a", "core_problem"]
  timePerNode: Record<string, number>; // milliseconds
  exitPoint?: string;
  completed: boolean;
};

export type FullJourney = {
  sessionId: string;
  timestampStart: number;
  gamesVisited: GameJourney[];
  totalTime: number; // milliseconds
  pathSignature: string;
  convertedToSubscriber: boolean;
};

const STORAGE_KEY = "game_audit_path";
const SESSION_START_KEY = "game_audit_session_start";
const CURRENT_NODE_KEY = "game_audit_current_node";

/**
 * Initialize session tracking
 */
export function initSession(): string {
  if (typeof window === "undefined") return "";
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    sessionStorage.setItem(SESSION_START_KEY, sessionId);
    sessionStorage.setItem(CURRENT_NODE_KEY, JSON.stringify({ timestamp: Date.now() }));
  } catch {
    // Ignore
  }
  return sessionId;
}

/**
 * Get session ID
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(SESSION_START_KEY) || initSession();
  } catch {
    return initSession();
  }
}

/**
 * Track when entering a node (for time calculation)
 */
export function enterNode(gameNumber: number, nodeType: PathStep["nodeType"], nodeId?: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      CURRENT_NODE_KEY,
      JSON.stringify({
        gameNumber,
        nodeType,
        nodeId,
        timestamp: Date.now(),
      })
    );
  } catch {
    // Ignore
  }
}

/**
 * Get the current path from sessionStorage
 */
export function getPath(): PathStep[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a step to the path and calculate time spent on previous node
 */
export function addPathStep(step: Omit<PathStep, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const path = getPath();
    const now = Date.now();

    // Calculate time spent on previous node
    const currentNodeData = sessionStorage.getItem(CURRENT_NODE_KEY);
    if (currentNodeData) {
      try {
        const current = JSON.parse(currentNodeData);
        if (current.timestamp) {
          const timeSpent = now - current.timestamp;
          // Update the last step with time spent
          if (path.length > 0) {
            path[path.length - 1].timeSpent = timeSpent;
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Add new step
    path.push({ ...step, timestamp: now });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(path));

    // Update current node
    enterNode(step.gameNumber, step.nodeType, step.nodeId);
  } catch {
    // Storage quota exceeded or disabled
  }
}

/**
 * Get path as a string representation (for ConvertKit custom field)
 * Format: "game1_intro→fork→path_a→core_problem→ending"
 */
export function getPathString(): string {
  const path = getPath();
  return path
    .map((step) => {
      if (step.nodeType === "intro") return `${step.gameNumber}i`;
      if (step.nodeType === "fork") return "fork";
      if (step.nodeType === "ending") return "end";
      if (step.nodeId) {
        // Compress: path_a -> a, core_problem -> core, cycle -> cycle
        if (step.nodeId.startsWith("path_")) {
          return step.nodeId.replace("path_", "");
        }
        return step.nodeId.replace("_", "");
      }
      return step.nodeType;
    })
    .join("→");
}

/**
 * Get full path signature (more detailed)
 * Format: "1i→fork→a→core→6i→fork→b→end"
 */
export function getPathSignature(): string {
  const path = getPath();
  return path
    .map((step) => {
      if (step.nodeType === "intro") return `${step.gameNumber}i`;
      if (step.nodeType === "fork") return "fork";
      if (step.nodeType === "ending") return "end";
      if (step.nodeId) {
        if (step.nodeId.startsWith("path_")) {
          return step.nodeId.replace("path_", "");
        }
        return step.nodeId;
      }
      return step.nodeType;
    })
    .join("→");
}

/**
 * Get path summary (for analytics/debugging)
 */
export function getPathSummary(): {
  games: number[];
  totalSteps: number;
  pathString: string;
  pathSignature: string;
  lastStep?: PathStep;
  totalTime: number;
} {
  const path = getPath();
  const games = [...new Set(path.map((s) => s.gameNumber))];
  const totalTime = path.reduce((sum, step) => sum + (step.timeSpent || 0), 0);
  return {
    games,
    totalSteps: path.length,
    pathString: getPathString(),
    pathSignature: getPathSignature(),
    lastStep: path[path.length - 1],
    totalTime,
  };
}

/**
 * Get full journey data for export
 */
export function getFullJourney(convertedToSubscriber = false): FullJourney {
  const path = getPath();
  const sessionStart = getSessionStartTime();
  const totalTime = Date.now() - sessionStart;

  // Group by game
  const gamesMap = new Map<number, GameJourney>();
  
  path.forEach((step) => {
    if (!gamesMap.has(step.gameNumber)) {
      gamesMap.set(step.gameNumber, {
        game: step.gameNumber,
        nodesVisited: [],
        timePerNode: {},
        completed: false,
      });
    }
    const journey = gamesMap.get(step.gameNumber)!;
    
    const nodeKey = step.nodeId || step.nodeType;
    if (!journey.nodesVisited.includes(nodeKey)) {
      journey.nodesVisited.push(nodeKey);
    }
    
    if (step.timeSpent) {
      journey.timePerNode[nodeKey] = (journey.timePerNode[nodeKey] || 0) + step.timeSpent;
    }

    // Track entry point (first path chosen)
    if (step.nodeType === "path" && !journey.entryPoint) {
      journey.entryPoint = step.nodeId;
    }

    // Track exit point
    if (step.nodeType === "ending") {
      journey.exitPoint = "ending";
      journey.completed = true;
    }
  });

  return {
    sessionId: getSessionId(),
    timestampStart: sessionStart,
    gamesVisited: Array.from(gamesMap.values()),
    totalTime,
    pathSignature: getPathSignature(),
    convertedToSubscriber,
  };
}

/**
 * Get session start time
 */
function getSessionStartTime(): number {
  if (typeof window === "undefined") return Date.now();
  try {
    const path = getPath();
    return path.length > 0 ? path[0].timestamp : Date.now();
  } catch {
    return Date.now();
  }
}

/**
 * Clear the path (e.g., on new session or explicit reset)
 */
export function clearPath() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
