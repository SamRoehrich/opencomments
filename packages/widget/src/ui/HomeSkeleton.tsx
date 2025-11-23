import type { Component } from 'solid-js';

export const HomeSkeleton: Component = () => (
  <div class="p-4">
    <div class="animate-pulse">
      <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div class="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  </div>
);