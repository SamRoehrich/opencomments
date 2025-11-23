import type { Component } from 'solid-js';

export const CreateCommentSkeleton: Component = () => (
  <div class="p-4">
    <div class="animate-pulse">
      <div class="h-5 bg-gray-300 rounded w-1/4 mb-3"></div>
      <div class="h-24 bg-gray-300 rounded w-full mb-3"></div>
      <div class="h-8 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);