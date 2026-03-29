/**
 * Loading Skeleton Components
 * Reusable skeleton loaders for better perceived performance.
 */

import React from 'react';

// Base skeleton with shimmer effect
export const Skeleton = ({ className = '' }) => (
  <div className={`bg-white/10 animate-pulse rounded ${className}`} />
);

// Card skeleton
export const CardSkeleton = () => (
  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr className="border-b border-white/10">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Stats card skeleton
export const StatsSkeleton = () => (
  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <Skeleton className="w-12 h-4" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-4 w-24" />
  </div>
);

// Chart skeleton
export const ChartSkeleton = ({ height = 300 }) => (
  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
    <Skeleton className="h-6 w-48 mb-4" />
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1"
          style={{ height: `${Math.random() * 80 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

// List skeleton
export const ListSkeleton = ({ items = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-16 h-8 rounded" />
      </div>
    ))}
  </div>
);

// Page skeleton (full page loader)
export const PageSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto">
    <div className="mb-8">
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsSkeleton key={i} />
      ))}
    </div>
    <ChartSkeleton />
  </div>
);

export default Skeleton;
