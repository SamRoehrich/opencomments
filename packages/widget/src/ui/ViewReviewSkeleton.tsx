import type { Component } from 'solid-js';

export const ViewReviewSkeleton: Component = () => (
  <div class="p-4">
    <div class="animate-pulse">
      <div class="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-300 rounded w-full"></div>
        <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        <div class="h-4 bg-gray-300 rounded w-4/5"></div>
      </div>
    </div>
  </div>
);