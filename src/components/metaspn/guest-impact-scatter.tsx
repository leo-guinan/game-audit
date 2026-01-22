"use client";

import type { GuestImpactSummary } from "@/lib/types/metaspn";

interface GuestImpactScatterProps {
  guests: GuestImpactSummary[];
  width?: number;
  height?: number;
}

export function GuestImpactScatter({
  guests,
  width = 600,
  height = 400,
}: GuestImpactScatterProps) {
  // Normalize data for visualization
  const maxImpact = Math.max(...guests.map(g => Math.abs(g.avg_impact_magnitude)), 1);
  const maxDeltaMargin = Math.max(...guests.map(g => Math.abs(g.avg_delta_margin)), 0.3);

  const scaleX = (impact: number) => ((impact / maxImpact) * (width - 60)) + 30;
  const scaleY = (deltaMargin: number) => {
    const normalized = (deltaMargin + maxDeltaMargin) / (maxDeltaMargin * 2);
    return height - 30 - (normalized * (height - 60));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Guest Impact Analysis</h3>
      
      <div className="relative border border-border bg-muted/20" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0">
          {/* Grid */}
          <defs>
            <pattern id="scatter-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scatter-grid)" />
          
          {/* Axes */}
          <line
            x1={30}
            y1={height - 30}
            x2={width - 30}
            y2={height - 30}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <line
            x1={30}
            y1={30}
            x2={30}
            y2={height - 30}
            stroke="var(--border)"
            strokeWidth="1"
          />
          
          {/* Center lines */}
          <line
            x1={30}
            y1={scaleY(0)}
            x2={width - 30}
            y2={scaleY(0)}
            stroke="var(--border)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.5"
          />
          
          {/* Quadrant labels */}
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize="10"
            fontFamily="var(--mono)"
          >
            Amplifiers
          </text>
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize="10"
            fontFamily="var(--mono)"
          >
            Distorters
          </text>
          
          {/* Guest points */}
          {guests.map((guest) => {
            const x = scaleX(guest.avg_impact_magnitude);
            const y = scaleY(guest.avg_delta_margin);
            const color = guest.avg_delta_margin > 0 ? 'var(--primary)' : 'var(--destructive)';
            
            return (
              <g key={guest.guest_id}>
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill={color}
                  stroke="var(--bg)"
                  strokeWidth="2"
                  opacity="0.8"
                  className="cursor-pointer"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="var(--foreground)"
                  fontSize="9"
                  fontFamily="var(--mono)"
                  fontWeight="500"
                >
                  {guest.guest_name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="text-xs font-mono text-muted-foreground space-y-1">
        <div>X-axis: Impact Magnitude</div>
        <div>Y-axis: Δ Margin (positive = amplifies, negative = distorts)</div>
      </div>
    </div>
  );
}
