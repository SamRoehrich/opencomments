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

interface Issue {
  id: string;
  url: string;
  description: string;
  created_at: string;
  resolved: boolean;
  selector: any[];
  relative_x: number;
  relative_y: number;
  element_height: number;
  element_width: number;
  viewport_height: number;
  viewport_width: number;
  user_id: string;
  assigned_to_user_id: string | null;
  env_id: string;
  review_id: string | null;
  screenshot: string | null;
}

export const ViewReviewSkeleton: Component<{ reviewId: string }> = (props) => {
  const [review, setReview] = createSignal<Review | null>(null);
  const [issues, setIssues] = createSignal<Issue[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal('');

  const fetchReviewData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch review details
      const reviewData = await trpc.reviews.getById({ id: props.reviewId });
      setReview(reviewData.result?.data || null);

      // Fetch review issues
      const issuesData = await trpc.reviews.getIssues({ id: props.reviewId });
      setIssues(issuesData.result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review');
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    fetchReviewData();
  });

  return (
    <div class="p-4">
      {isLoading() && (
        <div class="animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-300 rounded w-full"></div>
            <div class="h-4 bg-gray-300 rounded w-5/6"></div>
            <div class="h-4 bg-gray-300 rounded w-4/5"></div>
          </div>
        </div>
      )}
      
      {error() && (
        <div class="text-red-500 mb-4">{error()}</div>
      )}
      
      {!isLoading() && !error() && review() && (
        <div>
          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-2">{review()!.name}</h2>
            <p class="text-gray-600 mb-2">{review()!.description}</p>
            <div class="text-sm text-gray-400">
              Created: {new Date(review()!.created_at).toLocaleDateString()}
              {review()!.updated_at !== review()!.created_at && (
                <> • Updated: {new Date(review()!.updated_at).toLocaleDateString()}</>
              )}
            </div>
          </div>
          
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-3">Issues ({issues().length})</h3>
            
            {issues().length === 0 ? (
              <div class="text-gray-500">No issues found for this review</div>
            ) : (
              <div class="space-y-3">
                {issues().map((issue) => (
                  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-medium">{issue.description}</h4>
                      <span class={`px-2 py-1 text-xs rounded-full ${
                        issue.resolved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                      URL: <a href={issue.url} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
                        {issue.url}
                      </a>
                    </div>
                    <div class="text-xs text-gray-400">
                      Created: {new Date(issue.created_at).toLocaleDateString()}
                      {issue.assigned_to_user_id && (
                        <> • Assigned to: {issue.assigned_to_user_id}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};