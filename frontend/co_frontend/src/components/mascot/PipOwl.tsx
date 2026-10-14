import React from 'react';

/**
 * Pip — CodeQuest mascot owl (flat SVG, no gradients, no glow).
 * Size controlled by width/height props (default 80×80).
 */
export const PipOwl: React.FC<{
  width?: number;
  height?: number;
  className?: string;
  mood?: 'happy' | 'thinking' | 'sad';
}> = ({ width = 80, height = 80, className = '', mood = 'happy' }) => {
  // Eye expressions
  const leftEye =
    mood === 'sad' ? (
      // Drooping eyes
      <>
        <ellipse cx="34" cy="42" rx="6" ry="5" fill="white" />
        <circle cx="35" cy="43" r="2.5" fill="#1e1e2e" />
        <circle cx="36" cy="42" r="1" fill="white" />
      </>
    ) : mood === 'thinking' ? (
      // One eye squinting
      <>
        <ellipse cx="34" cy="42" rx="6" ry="3" fill="white" />
        <circle cx="35" cy="43" r="2" fill="#1e1e2e" />
        <circle cx="36" cy="42" r="0.8" fill="white" />
      </>
    ) : (
      // Happy round eyes
      <>
        <ellipse cx="34" cy="42" rx="6" ry="6" fill="white" />
        <circle cx="35" cy="43" r="2.8" fill="#1e1e2e" />
        <circle cx="36" cy="41.5" r="1" fill="white" />
      </>
    );

  const rightEye =
    mood === 'sad' ? (
      <>
        <ellipse cx="58" cy="42" rx="6" ry="5" fill="white" />
        <circle cx="57" cy="43" r="2.5" fill="#1e1e2e" />
        <circle cx="58" cy="42" r="1" fill="white" />
      </>
    ) : mood === 'thinking' ? (
      <>
        <ellipse cx="58" cy="42" rx="6" ry="6" fill="white" />
        <circle cx="57" cy="43" r="2.8" fill="#1e1e2e" />
        <circle cx="58" cy="41.5" r="1" fill="white" />
      </>
    ) : (
      <>
        <ellipse cx="58" cy="42" rx="6" ry="6" fill="white" />
        <circle cx="57" cy="43" r="2.8" fill="#1e1e2e" />
        <circle cx="58" cy="41.5" r="1" fill="white" />
      </>
    );

  // Mouth expression
  const mouth =
    mood === 'sad' ? (
      <path d="M 42 56 Q 46 53 50 56" stroke="#8b8ba0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ) : mood === 'thinking' ? (
      <path d="M 42 55 Q 46 55 50 55" stroke="#8b8ba0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M 42 54 Q 46 58 50 54" stroke="#8b8ba0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    );

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 92 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pip the CodeQuest mascot"
      role="img"
    >
      {/* Body */}
      <ellipse cx="46" cy="62" rx="30" ry="32" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />

      {/* Wing left */}
      <ellipse cx="18" cy="65" rx="12" ry="18" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" transform="rotate(-20 18 65)" />

      {/* Wing right */}
      <ellipse cx="74" cy="65" rx="12" ry="18" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" transform="rotate(20 74 65)" />

      {/* Head */}
      <circle cx="46" cy="36" r="26" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />

      {/* Ear tufts */}
      <polygon points="28,14 22,4 34,10" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <polygon points="64,14 70,4 58,10" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />

      {/* Belly patch */}
      <ellipse cx="46" cy="72" rx="18" ry="20" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />

      {/* Face disc */}
      <ellipse cx="46" cy="38" rx="20" ry="18" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />

      {/* Eye rings */}
      <ellipse cx="34" cy="42" rx="9" ry="9" fill="var(--border)" />
      <ellipse cx="58" cy="42" rx="9" ry="9" fill="var(--border)" />

      {/* Eyes */}
      {leftEye}
      {rightEye}

      {/* Beak */}
      <polygon points="46,48 42,54 50,54" fill="var(--warning)" />

      {/* Mouth */}
      {mouth}

      {/* Feet */}
      <g fill="var(--warning)">
        <rect x="32" y="91" width="6" height="4" rx="1" />
        <rect x="26" y="93" width="6" height="3" rx="1" transform="rotate(-15 26 93)" />
        <rect x="38" y="94" width="6" height="3" rx="1" transform="rotate(10 38 94)" />
        <rect x="54" y="91" width="6" height="4" rx="1" />
        <rect x="48" y="93" width="6" height="3" rx="1" transform="rotate(-10 48 93)" />
        <rect x="60" y="94" width="6" height="3" rx="1" transform="rotate(15 60 94)" />
      </g>
    </svg>
  );
};
