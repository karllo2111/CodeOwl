import React from 'react';
import { RoadmapGlyph } from './RoadmapGlyphs';

export type TileState = 'completed' | 'active' | 'locked' | 'chest';

export interface IsometricTileProps {
  id: number | string;
  title: string;
  chapterNumber?: number;
  glyphName?: string;
  state: TileState;
  masteryPercent?: number;
  onClick: () => void;
  className?: string;
}

export const IsometricTile: React.FC<IsometricTileProps> = ({
  title,
  chapterNumber,
  glyphName = 'code',
  state,
  masteryPercent = 0,
  onClick,
  className = '',
}) => {
  // Tile dimensions (2:1 isometric rhombus)
  const W = 110;
  const H = 55;
  const T = 14;

  const halfW = W / 2; // 55
  const halfH = H / 2; // 27.5

  const isCompleted = state === 'completed';
  const isActive = state === 'active';
  const isLocked = state === 'locked';
  const isChest = state === 'chest';

  // SVG color styling via CSS variables
  let topFill = 'var(--tile-top)';
  let leftFill = 'var(--tile-left)';
  let rightFill = 'var(--tile-right)';
  let outlineStroke = 'var(--tile-outline)';
  let glyphColor = 'var(--text)';

  if (isCompleted) {
    topFill = 'var(--tile-done-top)';
    leftFill = 'var(--tile-done-left)';
    rightFill = 'var(--tile-done-right)';
    outlineStroke = 'var(--tile-done-outline)';
    glyphColor = 'var(--success)';
  } else if (isLocked) {
    topFill = 'var(--tile-locked-top)';
    leftFill = 'var(--tile-locked-left)';
    rightFill = 'var(--tile-locked-right)';
    outlineStroke = 'var(--tile-locked-outline)';
    glyphColor = 'var(--text-muted)';
  } else if (isActive) {
    outlineStroke = 'var(--accent)';
    glyphColor = 'var(--accent)';
  } else if (isChest) {
    glyphColor = 'var(--warning)';
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${title} (${state})`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative inline-flex flex-col items-center group cursor-pointer select-none outline-none transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 ${className}`}
    >
      <svg
        width={W + 16}
        height={H + T + 16}
        viewBox={`-${halfW + 8} -${halfH + 8} ${W + 16} ${H + T + 16}`}
        className="overflow-visible"
      >
        {/* Soft ground shadow underneath slab */}
        <ellipse
          cx="0"
          cy={halfH + T / 2 + 2}
          rx={halfW - 4}
          ry={halfH / 2 - 2}
          fill="var(--tile-shadow)"
        />

        {/* Left vertical slab face */}
        <path
          d={`M -${halfW} 0 L 0 ${halfH} L 0 ${halfH + T} L -${halfW} ${T} Z`}
          fill={leftFill}
          stroke={outlineStroke}
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Right vertical slab face */}
        <path
          d={`M 0 ${halfH} L ${halfW} 0 L ${halfW} ${T} L 0 ${halfH + T} Z`}
          fill={rightFill}
          stroke={outlineStroke}
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Top rhombus slab face */}
        <path
          d={`M 0 -${halfH} L ${halfW} 0 L 0 ${halfH} L -${halfW} 0 Z`}
          fill={topFill}
          stroke={outlineStroke}
          strokeWidth={isActive ? '2' : '1'}
          strokeLinejoin="round"
        />

        {/* Active focus ring pulse effect on top face */}
        {isActive && (
          <path
            d={`M 0 -${halfH - 3} L ${halfW - 5} 0 L 0 ${halfH - 3} L -${halfW - 5} 0 Z`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
        )}
      </svg>

      {/* Center glyph on the slab top */}
      <div
        className="absolute top-2.5 flex flex-col items-center justify-center pointer-events-none transition-colors"
        style={{ color: glyphColor }}
      >
        <RoadmapGlyph
          name={isChest ? 'chest' : isLocked ? 'lock' : glyphName}
          size={isChest ? 22 : 18}
        />
        {chapterNumber && !isChest && (
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 opacity-90">
            {isCompleted ? '✓' : `Bab ${chapterNumber}`}
          </span>
        )}
      </div>

      {/* Label and mastery indicator below tile */}
      <div className="mt-1 text-center max-w-[130px] space-y-0.5">
        <div
          className={`text-xs font-semibold truncate transition-colors ${
            isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'
          }`}
        >
          {title}
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">
          {isChest
            ? 'Peti Hadiah'
            : isCompleted
            ? '100% Selesai'
            : isActive
            ? `${masteryPercent}% Penguasaan`
            : 'Terkunci'}
        </div>
      </div>
    </div>
  );
};
