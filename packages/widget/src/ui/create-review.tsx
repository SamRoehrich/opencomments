import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { trpc } from '../lib/trpc';

export const CreateReview: Component = () => {
  const [name, setName] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [envId, setEnvId] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleCreateReview = async (e: Event) => {
    e.preventDefault();
    
    if (!name().trim() || !envId().trim()) {
      setError('Name and Environment are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await trpc.mutations.reviews.create({
        name: name(),
        description: description(),
        user_id: 'current-user', // TODO: Get from auth context
        env_id: envId(),
      });
      
      console.log('Review created:', data.result?.data);
      
      // Reset form
      setName('');
      setDescription('');
      setEnvId('');
      
      // TODO: Navigate to the new review or show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Create New Review</h2>
      
      <form onSubmit={handleCreateReview} class="flex flex-col gap-4">
        <div class="flex flex-col">
          <label for="oc-review-name" class="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            name="name"
            type="text"
            id="oc-review-name"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            disabled={isLoading()}
            class="p-2 rounded-sm border border-slate-900 hover:shadow focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter review name"
            required
          />
        </div>
        
        <div class="flex flex-col">
          <label for="oc-review-description" class="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="oc-review-description"
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
            disabled={isLoading()}
            class="p-2 rounded-sm border border-slate-900 hover:shadow focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
            placeholder="Enter review description (optional)"
          />
        </div>
        
        <div class="flex flex-col">
          <label for="oc-review-env" class="block text-sm font-medium mb-1">
            Environment *
          </label>
          <input
            type="text"
            name="env"
            id="oc-review-env"
            value={envId()}
            onInput={(e) => setEnvId(e.currentTarget.value)}
            disabled={isLoading()}
            class="p-2 rounded-sm border border-slate-900 hover:shadow focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., production, staging, development"
            required
          />
        </div>
        
        {error() && (
          <div class="text-red-500 text-sm">{error()}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading()}
          class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded hover:shadow text-white p-2 hover:cursor-pointer transition-colors"
        >
          {isLoading() ? 'Creating...' : 'Start Review'}
        </button>
      </form>
    </div>
  );
};