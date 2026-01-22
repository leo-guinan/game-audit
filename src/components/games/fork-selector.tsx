"use client";

import Link from "next/link";
import type { ForkOption } from "@/lib/games/types";

interface ForkSelectorProps {
  gameNumber: number;
  options: ForkOption[];
  className?: string;
}

export function ForkSelector({
  gameNumber,
  options,
  className = "",
}: ForkSelectorProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      {options.map((opt) => {
        const href = opt.id.startsWith("path_")
          ? `/games/${gameNumber}/path/${opt.id}`
          : `/games/${gameNumber}/fork`;
        return (
          <Link
            key={opt.id}
            href={href}
            className="group block p-6 border border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all lift-on-hover"
          >
            <div className="font-mono text-xs uppercase tracking-wider text-primary mb-2">
              {opt.label}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">
              {opt.description}
            </p>
            <span className="mt-3 inline-block font-mono text-xs text-primary group-hover:underline">
              Enter →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
