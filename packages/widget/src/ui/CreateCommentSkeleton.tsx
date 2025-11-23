import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { trpc } from '../lib/trpc';

export const CreateCommentSkeleton: Component<{ issueId: string }> = (props) => {
  const [comment, setComment] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!comment().trim()) return;

    setIsLoading(true);
    setError('');

    try {
      await trpc.mutations.comments.create({
        comment: comment(),
        issue_id: props.issueId,
        user_id: 'current-user', // TODO: Get from auth context
      });
      
      setComment('');
      // TODO: Trigger refresh of comments list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="p-4">
      <form onSubmit={handleSubmit} class="space-y-3">
        <div>
          <label for="comment" class="block text-sm font-medium mb-1">
            Add Comment
          </label>
          <textarea
            id="comment"
            value={comment()}
            onInput={(e) => setComment(e.currentTarget.value)}
            disabled={isLoading()}
            class="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Write your comment..."
          />
        </div>
        
        {error() && (
          <div class="text-red-500 text-sm">{error()}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading() || !comment().trim()}
          class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isLoading() ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};