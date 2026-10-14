import React from 'react';

export interface FrameData {
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'double' | string;
  padding?: number;
  outerBorder?: string;
}

export interface AvatarProps {
  name: string;
  src?: string | null;
  frame?: FrameData | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  frame,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const initial = (name || 'U').charAt(0).toUpperCase();

  // CSS border frame styling
  const frameStyle: React.CSSProperties = {};
  if (frame) {
    if (frame.borderWidth && frame.borderColor) {
      frameStyle.border = `${frame.borderWidth}px ${frame.borderStyle || 'solid'} ${frame.borderColor}`;
    }
    if (frame.padding) {
      frameStyle.padding = `${frame.padding}px`;
    }
    if (frame.outerBorder) {
      frameStyle.outline = `1px solid ${frame.outerBorder}`;
      frameStyle.outlineOffset = '2px';
    }
  }

  return (
    <div
      style={frameStyle}
      className={`rounded-full inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <div
        className={`rounded-full flex items-center justify-center bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] overflow-hidden font-semibold ${sizeMap[size]}`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
      </div>
    </div>
  );
};
