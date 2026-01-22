"use client";

import Link from "next/link";

export type BreadcrumbItem =
  | { label: string; href: string }
  | { label: string; current: true };

interface PathBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function PathBreadcrumb({ items, className = "" }: PathBreadcrumbProps) {
  return (
    <nav
      className={`font-mono text-sm text-muted-foreground ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-x-2">
            {i > 0 && <span className="text-muted-foreground/60">/</span>}
            {"current" in item && item.current ? (
              <span className="text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              "href" in item && (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
