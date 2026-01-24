"use client";

interface BoxPlotProps {
  soloData: number[];
  guestData: number[];
  label: string;
  yAxisLabel?: string;
  width?: number;
  height?: number;
}

export function BoxPlot({
  soloData,
  guestData,
  label,
  yAxisLabel,
  width = 400,
  height = 200,
}: BoxPlotProps) {
  // Calculate quartiles for box plot
  function calculateQuartiles(data: number[]): {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
  } {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    
    if (n === 0) {
      return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
    }
    
    const min = sorted[0]!;
    const max = sorted[n - 1]!;
    const median = n % 2 === 0
      ? (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2
      : sorted[Math.floor(n / 2)]!;
    
    const lowerHalf = sorted.slice(0, Math.floor(n / 2));
    const upperHalf = sorted.slice(Math.ceil(n / 2));
    
    const q1 = lowerHalf.length % 2 === 0 && lowerHalf.length > 0
      ? (lowerHalf[lowerHalf.length / 2 - 1]! + lowerHalf[lowerHalf.length / 2]!) / 2
      : lowerHalf.length > 0
      ? lowerHalf[Math.floor(lowerHalf.length / 2)]!
      : min;
    
    const q3 = upperHalf.length % 2 === 0 && upperHalf.length > 0
      ? (upperHalf[upperHalf.length / 2 - 1]! + upperHalf[upperHalf.length / 2]!) / 2
      : upperHalf.length > 0
      ? upperHalf[Math.floor(upperHalf.length / 2)]!
      : max;
    
    return { min, q1, median, q3, max };
  }

  const soloStats = calculateQuartiles(soloData);
  const guestStats = calculateQuartiles(guestData);

  const allValues = [...soloData, ...guestData];
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues, 1);
  const range = maxValue - minValue || 1;

  const scaleY = (value: number) => height - 40 - ((value - minValue) / range) * (height - 80);
  const boxWidth = 60;
  const soloX = width / 2 - boxWidth - 20;
  const guestX = width / 2 + 20;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{label}</h3>
      
      <div className="relative border border-border bg-muted/20" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0">
          <defs>
            <pattern id="boxplot-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#boxplot-grid)" />
          
          {/* Y-axis labels (adaptive based on range) */}
          {(() => {
            const tickCount = 5;
            const ticks = Array.from({ length: tickCount }, (_, i) => {
              const ratio = i / (tickCount - 1);
              return minValue + (ratio * range);
            });
            return ticks.map((value, idx) => {
              const y = scaleY(value);
              return (
                <g key={idx}>
                  <line
                    x1={40}
                    y1={y}
                    x2={width - 20}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                    opacity="0.3"
                  />
                  <text
                    x={35}
                    y={y + 4}
                    textAnchor="end"
                    fill="var(--muted-foreground)"
                    fontSize="10"
                    fontFamily="var(--mono)"
                  >
                    {value.toFixed(range > 10 ? 0 : 2)}
                  </text>
                </g>
              );
            });
          })()}
          
          {/* Solo Box Plot */}
          <g>
            {/* Whiskers */}
            <line
              x1={soloX + boxWidth / 2}
              y1={scaleY(soloStats.min)}
              x2={soloX + boxWidth / 2}
              y2={scaleY(soloStats.max)}
              stroke="var(--muted-foreground)"
              strokeWidth="1"
              opacity="0.7"
            />
            <line
              x1={soloX + boxWidth / 2 - 5}
              y1={scaleY(soloStats.min)}
              x2={soloX + boxWidth / 2 + 5}
              y2={scaleY(soloStats.min)}
              stroke="var(--muted-foreground)"
              strokeWidth="1"
              opacity="0.7"
            />
            <line
              x1={soloX + boxWidth / 2 - 5}
              y1={scaleY(soloStats.max)}
              x2={soloX + boxWidth / 2 + 5}
              y2={scaleY(soloStats.max)}
              stroke="var(--muted-foreground)"
              strokeWidth="1"
              opacity="0.7"
            />
            
            {/* Box */}
            <rect
              x={soloX}
              y={scaleY(soloStats.q3)}
              width={boxWidth}
              height={scaleY(soloStats.q1) - scaleY(soloStats.q3)}
              fill="var(--muted-foreground)"
              fillOpacity="0.2"
              stroke="var(--muted-foreground)"
              strokeWidth="1"
              opacity="0.7"
            />
            
            {/* Median line */}
            <line
              x1={soloX}
              y1={scaleY(soloStats.median)}
              x2={soloX + boxWidth}
              y2={scaleY(soloStats.median)}
              stroke="var(--muted-foreground)"
              strokeWidth="2"
              opacity="0.7"
            />
            
            {/* Label */}
            <text
              x={soloX + boxWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontSize="11"
              fontFamily="var(--mono)"
            >
              Solo
            </text>
          </g>
          
          {/* Guest Box Plot */}
          <g>
            {/* Whiskers */}
            <line
              x1={guestX + boxWidth / 2}
              y1={scaleY(guestStats.min)}
              x2={guestX + boxWidth / 2}
              y2={scaleY(guestStats.max)}
              stroke="var(--primary)"
              strokeWidth="1"
            />
            <line
              x1={guestX + boxWidth / 2 - 5}
              y1={scaleY(guestStats.min)}
              x2={guestX + boxWidth / 2 + 5}
              y2={scaleY(guestStats.min)}
              stroke="var(--primary)"
              strokeWidth="1"
            />
            <line
              x1={guestX + boxWidth / 2 - 5}
              y1={scaleY(guestStats.max)}
              x2={guestX + boxWidth / 2 + 5}
              y2={scaleY(guestStats.max)}
              stroke="var(--primary)"
              strokeWidth="1"
            />
            
            {/* Box */}
            <rect
              x={guestX}
              y={scaleY(guestStats.q3)}
              width={boxWidth}
              height={scaleY(guestStats.q1) - scaleY(guestStats.q3)}
              fill="var(--primary)"
              fillOpacity="0.2"
              stroke="var(--primary)"
              strokeWidth="1"
            />
            
            {/* Median line */}
            <line
              x1={guestX}
              y1={scaleY(guestStats.median)}
              x2={guestX + boxWidth}
              y2={scaleY(guestStats.median)}
              stroke="var(--primary)"
              strokeWidth="2"
            />
            
            {/* Label */}
            <text
              x={guestX + boxWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fill="var(--primary)"
              fontSize="11"
              fontFamily="var(--mono)"
            >
              Guest
            </text>
          </g>
        </svg>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1">
          <div className="text-muted-foreground">Solo (n={soloData.length})</div>
          <div className="text-foreground">Median: {soloStats.median.toFixed(2)}</div>
          <div className="text-foreground">Q1-Q3: {soloStats.q1.toFixed(2)} - {soloStats.q3.toFixed(2)}</div>
          <div className="text-foreground">Range: {soloStats.min.toFixed(2)} - {soloStats.max.toFixed(2)}</div>
        </div>
        <div className="space-y-1">
          <div className="text-primary">Guest (n={guestData.length})</div>
          <div className="text-foreground">Median: {guestStats.median.toFixed(2)}</div>
          <div className="text-foreground">Q1-Q3: {guestStats.q1.toFixed(2)} - {guestStats.q3.toFixed(2)}</div>
          <div className="text-foreground">Range: {guestStats.min.toFixed(2)} - {guestStats.max.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
