"use client";

import type { GuestImpactSummary } from "@/lib/types/metaspn";

interface GuestImpactBarsProps {
  guests: GuestImpactSummary[];
  maxGuests?: number;
  width?: number;
}

export function GuestImpactBars({
  guests,
  maxGuests = 10,
  width = 600,
}: GuestImpactBarsProps) {
  // Sort by impact magnitude and take top N
  const topGuests = [...guests]
    .sort((a, b) => b.avg_impact_magnitude - a.avg_impact_magnitude)
    .slice(0, maxGuests);

  // Find max absolute values for scaling
  const maxDeltaEntropy = Math.max(
    ...topGuests.map(g => Math.abs(g.avg_delta_margin)), // Using delta_margin as proxy for entropy
    0.1
  );
  const maxDeltaDrift = Math.max(
    ...topGuests.map(g => Math.abs(g.avg_delta_drift)),
    0.1
  );

  const barHeight = 30;
  const barSpacing = 10;
  const chartHeight = topGuests.length * (barHeight + barSpacing);
  const barMaxWidth = width - 200; // Leave space for labels

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Guest Impact Vectors</h3>
      <p className="text-sm text-muted-foreground">
        Average change in metrics when this guest appears
      </p>
      
      <div className="relative border border-border bg-muted/20 p-4" style={{ width, minHeight: chartHeight }}>
        <div className="space-y-6">
          {topGuests.map((guest, index) => {
            const deltaEntropy = guest.avg_delta_margin; // Using margin as proxy
            const deltaDrift = guest.avg_delta_drift;
            
            const entropyWidth = (Math.abs(deltaEntropy) / maxDeltaEntropy) * barMaxWidth;
            const driftWidth = (Math.abs(deltaDrift) / maxDeltaDrift) * barMaxWidth;
            
            const entropyColor = deltaEntropy >= 0 ? '#50c878' : '#c41e3a'; // green for increase, red for decrease
            const driftColor = deltaDrift >= 0 ? '#50c878' : '#c41e3a';

            return (
              <div key={guest.guest_id} className="space-y-2">
                {/* Guest name and appearances */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-mono text-foreground">
                      {guest.guest_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{guest.guest_name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {guest.appearances} appearance{guest.appearances !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Impact bars */}
                <div className="space-y-2 pl-10">
                  {/* ΔEntropy (using margin as proxy) */}
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-muted-foreground w-20">
                      ΔMargin:
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-4 bg-muted rounded relative overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${entropyWidth}px`,
                            backgroundColor: entropyColor,
                            marginLeft: deltaEntropy < 0 ? `${barMaxWidth - entropyWidth}px` : '0',
                          }}
                        />
                      </div>
                      <div
                        className="absolute text-xs font-mono"
                        style={{
                          left: deltaEntropy >= 0
                            ? `${entropyWidth + 10}px`
                            : `${barMaxWidth - entropyWidth - 50}px`,
                          top: '0',
                          color: entropyColor,
                        }}
                      >
                        {deltaEntropy >= 0 ? '+' : ''}{deltaEntropy.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  
                  {/* ΔDrift */}
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-muted-foreground w-20">
                      ΔDrift:
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-4 bg-muted rounded relative overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${driftWidth}px`,
                            backgroundColor: driftColor,
                            marginLeft: deltaDrift < 0 ? `${barMaxWidth - driftWidth}px` : '0',
                          }}
                        />
                      </div>
                      <div
                        className="absolute text-xs font-mono"
                        style={{
                          left: deltaDrift >= 0
                            ? `${driftWidth + 10}px`
                            : `${barMaxWidth - driftWidth - 50}px`,
                          top: '0',
                          color: driftColor,
                        }}
                      >
                        {deltaDrift >= 0 ? '+' : ''}{deltaDrift.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#50c878] rounded" />
          <span>Increase</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#c41e3a] rounded" />
          <span>Decrease</span>
        </div>
      </div>
    </div>
  );
}
