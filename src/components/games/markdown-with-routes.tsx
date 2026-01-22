"use client";

import ReactMarkdown from "react-markdown";
import { CrossLink } from "./cross-link";
import type { GameConfig } from "@/lib/games/types";

const ROUTE_MARKER = /(\*\*→\s*([^*]+)\*\*)?\s*\[([a-z_0-9]+)\]/g;

type Part = { type: "md"; text: string } | { type: "link"; label?: string; target: string };

function parseRouteMarkers(content: string): Part[] {
  const parts: Part[] = [];
  let lastEnd = 0;
  for (const m of content.matchAll(ROUTE_MARKER)) {
    const start = m.index!;
    const end = start + m[0].length;
    if (start > lastEnd) {
      const textBefore = content.slice(lastEnd, start).trimEnd();
      // Only add markdown text if it's not empty (after trimming trailing whitespace)
      if (textBefore) {
        parts.push({ type: "md", text: textBefore });
      }
    }
    const label = m[2]?.trim();
    const target = m[3];
    parts.push({ type: "link", label: label || undefined, target });
    lastEnd = end;
  }
  if (lastEnd < content.length) {
    const remaining = content.slice(lastEnd).trimStart();
    if (remaining) {
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
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
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
        // If there's a label (from **→ ...**), render as block; otherwise inline
        if (p.label) {
          return (
            <div key={i} className="my-3">
              <CrossLink
                gameNumber={gameNumber}
                target={p.target}
                label={p.label}
                config={config}
              />
            </div>
          );
        }
        return (
          <span key={i} className="inline-flex items-center gap-2">
            <CrossLink
              gameNumber={gameNumber}
              target={p.target}
              label={p.label}
              config={config}
            />
          </span>
        );
      })}
    </div>
  );
}
