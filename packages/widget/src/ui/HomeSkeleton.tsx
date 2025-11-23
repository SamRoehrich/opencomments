import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { trpc } from '../lib/trpc';

interface Review {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  env_id: string;
}

export const HomeSkeleton: Component = () => {
  const [reviews, setReviews] = createSignal<Review[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal('');

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await trpc.reviews.list();
      setReviews(data.result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    fetchReviews();
  });

  return (
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Recent Reviews</h2>
      
      {isLoading() && (
        <div class="animate-pulse">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      )}
      
      {error() && (
        <div class="text-red-500 mb-4">{error()}</div>
      )}
      
      {!isLoading() && !error() && reviews().length === 0 && (
        <div class="text-gray-500">No reviews found</div>
      )}
      
      {!isLoading() && !error() && reviews().length > 0 && (
        <div class="space-y-4">
          {reviews().map((review) => (
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-lg">{review.name}</h3>
              <p class="text-gray-600 text-sm mt-1">{review.description}</p>
              <div class="text-xs text-gray-400 mt-2">
                Created: {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};