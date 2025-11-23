import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { trpc } from '../lib/trpc';

interface Comment {
  id: string;
  comment: string;
  issue_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const ViewCommentSkeleton: Component<{ issueId: string }> = (props) => {
  const [comments, setComments] = createSignal<Comment[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal('');

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const data = await trpc.comments.getByIssueId({ issueId: props.issueId });
      setComments(data.result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    fetchComments();
  });

  return (
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-4">Comments</h3>
      
      {isLoading() && (
        <div class="animate-pulse">
          <div class="flex items-center space-x-3 mb-3">
            <div class="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div class="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
          <div class="h-16 bg-gray-300 rounded w-full"></div>
        </div>
      )}
      
      {error() && (
        <div class="text-red-500 mb-4">{error()}</div>
      )}
      
      {!isLoading() && !error() && comments().length === 0 && (
        <div class="text-gray-500">No comments yet</div>
      )}
      
      {!isLoading() && !error() && comments().length > 0 && (
        <div class="space-y-4">
          {comments().map((comment) => (
            <div class="border rounded-lg p-4">
              <div class="flex items-center space-x-3 mb-2">
                <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {comment.user_id.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div class="font-medium text-sm">{comment.user_id}</div>
                  <div class="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p class="text-gray-700">{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};