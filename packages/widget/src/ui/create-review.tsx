import type { Component } from 'solid-js';

export const CreateReview: Component = () => (
  <div class="p-4">
    <form class="flex flex-col gap-2">
      <div class='flex flex-col'>
        <label for="oc-review-name">Name</label>
        <input type="text" id="oc-review-env" class="p-2 rounded-sm border border-slate-900 hover:shadow" />
      </div>
      <div class="flex flex-col">
        <label for="oc-review-name">Date</label>
        <input type="date" id="oc-review-date" class="p-2 rounded-sm border border-slate-900 hover:shadow" />
      </div>
      <div class='flex flex-col'>
        <label for="oc-review-name">Environment</label>
        <input type="text" id="oc-review-name" class="p-2 rounded-sm border border-slate-900 hover:shadow" />
      </div>
      <button type="button" class="bg-blue-500 hover:bg-blue-600 rounded hover:shadow text-white p-2 hover:cursor-pointer">Start review</button>
    </form>
  </div>
);
