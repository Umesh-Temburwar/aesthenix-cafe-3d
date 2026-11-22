import React, { useState } from 'react';
import { ProductCategory } from '../../types';
import { Compass, Sparkles } from 'lucide-react';

export interface FlavorProfile {
  acidity: number;
  body: number;
  sweetness: number;
  aroma: number;
  finish: number;
}

interface FlavorRadarChartProps {
  flavorProfile?: FlavorProfile;
  category: ProductCategory;
  roastLevel?: string;
  tastingNotes?: string[];
}

const AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'acidity', label: 'Acidity' },
  { key: 'body', label: 'Body' },
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'finish', label: 'Finish' },
  { key: 'aroma', label: 'Aroma' },
];

export const FlavorRadarChart: React.FC<FlavorRadarChartProps> = ({
  flavorProfile,
  category,
  roastLevel,
  tastingNotes,
}) => {
  const [activeAxis, setActiveAxis] = useState<string | null>(null);

  // Compute fallback sensory values if not explicitly provided
  const profile: FlavorProfile = flavorProfile || (() => {
    if (roastLevel?.includes('Light')) {
      return { acidity: 88, body: 62, sweetness: 74, finish: 80, aroma: 94 };
    }
    if (roastLevel?.includes('Dark')) {
      return { acidity: 40, body: 95, sweetness: 68, finish: 92, aroma: 86 };
    }
    if (category === 'cold') {
      return { acidity: 52, body: 80, sweetness: 84, finish: 82, aroma: 78 };
    }
    if (category === 'tea') {
      return { acidity: 32, body: 56, sweetness: 82, finish: 88, aroma: 96 };
    }
    if (category === 'desserts' || category === 'bakery') {
      return { acidity: 18, body: 86, sweetness: 98, finish: 85, aroma: 90 };
    }
    return { acidity: 68, body: 82, sweetness: 80, finish: 84, aroma: 88 };
  })();

  const cx = 110;
  const cy = 90;
  const radius = 62;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Helper to calculate coordinates
  const getCoordinates = (index: number, ratio: number) => {
    const angle = -Math.PI / 2 + index * ((2 * Math.PI) / 5);
    const x = cx + radius * ratio * Math.cos(angle);
    const y = cy + radius * ratio * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string
  const dataPoints = AXES.map((axis, i) => {
    const val = profile[axis.key];
    const ratio = Math.max(0.15, Math.min(val / 100, 1));
    return getCoordinates(i, ratio);
  });

  const polygonPointsStr = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="rounded-2xl bg-aura-bg/60 border border-aura-border p-3.5 my-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-aura-cream">
          <Compass className="w-3.5 h-3.5 text-aura-gold" />
          <span>Terroir Sensory Radar</span>
        </div>
        <span className="text-[10px] text-aura-gold font-mono uppercase tracking-wider">
          SCA 100-Pt Matrix
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 220 180"
          className="w-full max-w-[210px] h-auto overflow-visible select-none"
        >
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </radialGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Guide Pentagons */}
          {levels.map((lvl) => {
            const pts = Array.from({ length: 5 })
              .map((_, i) => {
                const c = getCoordinates(i, lvl);
                return `${c.x.toFixed(1)},${c.y.toFixed(1)}`;
              })
              .join(' ');
            return (
              <polygon
                key={lvl}
                points={pts}
                fill="none"
                stroke="#C5A059"
                strokeOpacity={lvl === 1.0 ? 0.35 : 0.15}
                strokeWidth={lvl === 1.0 ? 1.2 : 0.8}
                strokeDasharray={lvl < 1.0 ? '2,2' : undefined}
              />
            );
          })}

          {/* Radial Spokes */}
          {AXES.map((_, i) => {
            const edge = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={edge.x}
                y2={edge.y}
                stroke="#C5A059"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
            );
          })}

          {/* Filled Data Radar */}
          <polygon
            points={polygonPointsStr}
            fill="url(#radarFill)"
            stroke="#D4AF37"
            strokeWidth="1.8"
            filter="url(#goldGlow)"
            className="transition-all duration-500 ease-out"
          />

          {/* Vertex Points & Labels */}
          {AXES.map((axis, i) => {
            const pt = dataPoints[i];
            const labelPos = getCoordinates(i, 1.25);
            const val = profile[axis.key];
            const isHovered = activeAxis === axis.key;

            return (
              <g
                key={axis.key}
                onMouseEnter={() => setActiveAxis(axis.key)}
                onMouseLeave={() => setActiveAxis(null)}
                className="cursor-pointer"
              >
                {/* Vertex circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5 : 3.5}
                  fill={isHovered ? '#FFFFFF' : '#D4AF37'}
                  stroke="#1F130E"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />

                {/* Label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fontWeight={isHovered ? '700' : '500'}
                  fill={isHovered ? '#FFFFFF' : '#E6DAC8'}
                  className="transition-colors duration-200"
                >
                  {axis.label}
                </text>

                {/* Score badge next to label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 9}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7.5"
                  fill="#C5A059"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {val}/100
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tasting notes chips */}
      {tastingNotes && tastingNotes.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-aura-border/60">
          <div className="flex items-center gap-1 text-[10px] text-aura-muted uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3 text-aura-gold" />
            <span>Artisan Tasting Notes</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tastingNotes.map((note) => (
              <span
                key={note}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-aura-card border border-aura-border text-aura-cream hover:border-aura-gold/50 transition-colors"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
