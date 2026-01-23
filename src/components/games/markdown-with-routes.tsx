"use client";

import ReactMarkdown from "react-markdown";
import { CrossLink } from "./cross-link";
import type { GameConfig } from "@/lib/games/types";

const ROUTE_MARKER = /(\*\*→\s*([^*]+)\*\*)?\s*\[([a-z_0-9]+)\]/g;

type Part = 
  | { type: "md"; text: string } 
  | { type: "link"; label?: string; target: string; trailingText?: string }
  | { type: "link-group"; label?: string; targets: string[] };

function parseRouteMarkers(content: string): Part[] {
  const parts: Part[] = [];
  let lastEnd = 0;
  const matches = Array.from(content.matchAll(ROUTE_MARKER));
  
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const start = m.index!;
    const end = start + m[0].length;
    
    if (start > lastEnd) {
      const textBefore = content.slice(lastEnd, start).trimEnd();
      if (textBefore) {
        parts.push({ type: "md", text: textBefore });
      }
    }
    
    const label = m[2]?.trim();
    const target = m[3];
    
    // Check for trailing text on the same line (text after the link before newline)
    const lineEnd = content.indexOf('\n', end);
    const trailingText = lineEnd > end 
      ? content.slice(end, lineEnd).trim()
      : content.slice(end).trim();
    const hasTrailingText = trailingText && !trailingText.match(/^\s*[·•]\s*$/);
    
    // Check if this starts a link group (has label and next link is close with separator)
    const nextMatch = matches[i + 1];
    const hasLabel = label !== undefined;
    const hasNextLink = nextMatch !== undefined;
    const isClose = hasNextLink && (nextMatch.index! - end) < 15; // Links close together
    const hasSeparator = hasNextLink && /^\s*[·•]\s*$/.test(content.slice(end, nextMatch.index!));
    
    // If this has a label and next link is part of a group, collect all links
    if (hasLabel && hasNextLink && isClose && hasSeparator && !hasTrailingText) {
      const groupTargets = [target];
      let groupEnd = end;
      let j = i + 1;
      
      // Collect all consecutive links separated by · or •
      while (j < matches.length) {
        const nextM = matches[j];
        const gap = content.slice(groupEnd, nextM.index!);
        
        // Check if next link is part of the group (separated by · or •)
        if (/^\s*[·•]\s*$/.test(gap)) {
          groupTargets.push(nextM[3]);
          groupEnd = nextM.index! + nextM[0].length;
          j++;
        } else {
          break;
        }
      }
      
      parts.push({ type: "link-group", label, targets: groupTargets });
      lastEnd = groupEnd;
      i = j - 1; // Skip the links we just processed
    } else {
      // Single link - include trailing text if present
      parts.push({ 
        type: "link", 
        label: label || undefined, 
        target,
        trailingText: hasTrailingText ? trailingText : undefined
      });
      lastEnd = hasTrailingText ? (lineEnd > 0 ? lineEnd : content.length) : end;
    }
  }
  
  if (lastEnd < content.length) {
    const remaining = content.slice(lastEnd).trimStart();
    // Only add remaining text if it's not just whitespace or empty
    if (remaining && remaining.trim()) {
      parts.push({ type: "md", text: remaining });
    }
  }
  
  return parts;
}

interface MarkdownWithRoutesProps {
  content: string;
  gameNumber: number;
  config: GameConfig | null;
  className?: string;
  /** Current node context for tracking "from" state */
  fromNodeType?: "intro" | "fork" | "path" | "shared" | "ending";
  fromNodeId?: string;
}

/**
 * Renders markdown and turns route markers into links.
 * Markers: **→ Label** [target] or [target]. Targets: intro, fork, path_a/b/c, core_problem, cycle, ending.
 */
export function MarkdownWithRoutes({
  content,
  gameNumber,
  config,
  className = "",
  fromNodeType,
  fromNodeId,
}: MarkdownWithRoutesProps) {
  const parts = parseRouteMarkers(content);

  return (
    <div className={`games-prose ${className}`}>
      {parts.map((p, i) => {
        if (p.type === "md") {
          return (
            <ReactMarkdown
              key={i}
              components={{
                p: ({ children }) => <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>,
                h1: ({ children }) => <h1 className="text-3xl font-bold text-foreground mb-4 mt-8 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mb-3 mt-6">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium text-foreground mb-2 mt-4">{children}</h3>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground pl-0">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground pl-0">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed ml-4">{children}</li>,
                pre: ({ children }) => <pre className="bg-muted/50 border border-border p-4 overflow-x-auto mb-4 font-mono text-sm text-foreground">{children}</pre>,
                code: ({ className, children, ...rest }) =>
                  className ? (
                    <code className={className} {...rest}>{children}</code>
                  ) : (
                    <code className="bg-muted/50 px-1.5 py-0.5 rounded font-mono text-sm" {...rest}>{children}</code>
                  ),
                hr: () => <hr className="border-border my-8" />,
                img: ({ src, alt }) => (
                  <span className="block my-6 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src ?? ""}
                      alt={alt ?? ""}
                      className="mx-auto max-w-full h-auto rounded-sm border border-border"
                      loading="lazy"
                    />
                  </span>
                ),
              }}
            >
              {p.text}
            </ReactMarkdown>
          );
        }
        
        // Handle link groups (multiple links on one line)
        if (p.type === "link-group") {
          return (
            <div key={i} className="my-4 first:mt-0">
              {p.label && (
                <div className="text-muted-foreground mb-2 font-medium">{p.label}</div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {p.targets.map((target, idx) => (
                  <span key={idx} className="inline-flex items-center">
                    <CrossLink
                      gameNumber={gameNumber}
                      target={target}
                      config={config}
                      fromNodeType={fromNodeType}
                      fromNodeId={fromNodeId}
                    />
                    {idx < p.targets.length - 1 && (
                      <span className="mx-2 text-muted-foreground">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        
        // Single link with label - render as block
        if (p.type === "link" && p.label) {
          return (
            <div key={i} className="my-4 first:mt-0">
              <div className="text-muted-foreground mb-2 font-medium">{p.label}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <CrossLink
                  gameNumber={gameNumber}
                  target={p.target}
                  config={config}
                  fromNodeType={fromNodeType}
                  fromNodeId={fromNodeId}
                />
                {p.trailingText && (
                  <span className="text-muted-foreground text-sm">{p.trailingText}</span>
                )}
              </div>
            </div>
          );
        }
        
        // Single link without label - render inline
        return (
          <span key={i} className="inline-flex items-center">
            <CrossLink
              gameNumber={gameNumber}
              target={p.target}
              config={config}
              fromNodeType={fromNodeType}
              fromNodeId={fromNodeId}
            />
          </span>
        );
      })}
    </div>
  );
}
