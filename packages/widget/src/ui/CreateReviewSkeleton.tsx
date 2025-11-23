import type { Component } from 'solid-js';

export const CreateReviewSkeleton: Component = () => (
  <div class="p-4">
    <div class="animate-pulse">
      <div class="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div class="h-20 bg-gray-300 rounded w-full mb-4"></div>
      <div class="h-10 bg-gray-300 rounded w-1/4"></div>
    </div>
  </div>
);