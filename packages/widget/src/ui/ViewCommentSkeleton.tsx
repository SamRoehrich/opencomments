import type { Component } from 'solid-js';

export const ViewCommentSkeleton: Component = () => (
  <div class="p-4">
    <div class="animate-pulse">
      <div class="flex items-center space-x-3 mb-3">
        <div class="h-8 w-8 bg-gray-300 rounded-full"></div>
        <div class="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div class="h-16 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
);