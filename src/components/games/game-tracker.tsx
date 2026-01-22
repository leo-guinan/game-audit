"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackFathomEvent, GameEvents } from "@/lib/analytics/fathom";
import { addPathStep, enterNode, initSession } from "@/lib/analytics/path-tracker";

interface GameTrackerProps {
  gameNumber: number;
  nodeType: "intro" | "fork" | "path" | "shared" | "ending";
  nodeId?: string; // path_a, core_problem, etc.
  children: React.ReactNode;
}

/**
 * Client component that tracks game page views and adds to path
 */
export function GameTracker({
  gameNumber,
  nodeType,
  nodeId,
  children,
}: GameTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize session on first visit
    if (typeof window !== "undefined") {
      initSession();
    }

    // Track Fathom event
    if (nodeType === "intro") {
      trackFathomEvent(GameEvents.gameIntro(gameNumber));
    } else if (nodeType === "fork") {
      trackFathomEvent(GameEvents.gameFork(gameNumber));
    } else if (nodeType === "path" && nodeId) {
      trackFathomEvent(GameEvents.gamePath(gameNumber, nodeId));
    } else if (nodeType === "shared" && nodeId) {
      trackFathomEvent(GameEvents.gameShared(gameNumber, nodeId));
    } else if (nodeType === "ending") {
      trackFathomEvent(GameEvents.gameEnding(gameNumber));
    }

    // Track node entry for time calculation
    enterNode(gameNumber, nodeType, nodeId);

    // Add to path tracker (this will calculate time spent on previous node)
    addPathStep({
      gameNumber,
      nodeType,
      nodeId,
    });
  }, [gameNumber, nodeType, nodeId, pathname]);

  return <>{children}</>;
}
