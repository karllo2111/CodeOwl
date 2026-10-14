import React from 'react';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
}) => {
  return (
    <div
      className={`animate-pulse bg-[var(--surface-2)] rounded-[var(--radius-control)] ${className}`}
      style={{ width, height }}
    />
  );
};
