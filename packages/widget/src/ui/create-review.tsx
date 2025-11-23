import type { Component } from 'solid-js';

export const CreateReview: Component = () => {
  const handleCreateReview = (e: Event) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form)

    const name = formData.get("name")
    const date = formData.get("date")
    const env = formData.get("env")
    const description = formData.get("description")

    console.log({ name, date, env, description })
  }

  return (
    <div class="p-4">
      <form class="flex flex-col gap-2" on:submit={handleCreateReview}>
        <div class='flex flex-col'>
          <label for="oc-review-name">Name</label>
          <input name="name" type="text" id="oc-review-env" class="p-2 rounded-sm border border-slate-900 hover:shadow" />
        </div>
        <div class='flex flex-col'>
          <label for="oc-review-description">Description</label>
          <input name="description" type="textarea" id="oc-review-description" class="p-2 rounded-sm border border-slate-900 hover:shadow" />
        </div>
        <div class="flex flex-col">
          <label for="oc-review-date">Date</label>
          <input type="date" name="date" id="oc-review-date" class="p-2 rounded-sm border border-slate-900 hover:shadow" />
        </div>
        <div class='flex flex-col'>
          <label for="oc-review-env">Environment</label>
          <input type="text" name="env" id="oc-review-env" class="p-2 rounded-sm border border-slate-900 hover:shadow" />
        </div>
        <button class="bg-blue-500 hover:bg-blue-600 rounded hover:shadow text-white p-2 hover:cursor-pointer">Start review</button>
      </form>
    </div>
  );
};
