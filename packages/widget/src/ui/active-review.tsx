import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { trpc } from '../lib/trpc';

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

export const ActiveReview: Component<{ reviewId: string }> = (props) => {
  const [issues, setIssues] = createSignal<Issue[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal('');

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const data = await trpc.issues.list({ review: props.reviewId });
      setIssues(data.result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveIssue = async (issueId: string, resolved: boolean) => {
    try {
      await trpc.mutations.issues.resolve({
        id: issueId,
        resolved: !resolved,
      });

      // Refresh issues list
      await fetchIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update issue');
    }
  };

  const handleAssignIssue = async (issueId: string, assignedTo?: string) => {
    const assignedValue = assignedTo || undefined;
    try {
      await trpc.mutations.issues.assign({
        id: issueId,
        assigned_to_user_id: assignedTo,
      });

      // Refresh issues list
      await fetchIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign issue');
    }
  };

  onMount(() => {
    fetchIssues();
  });

  return (
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Active Review Issues</h2>
      
      {isLoading() && (
        <div class="animate-pulse space-y-4">
          <div class="h-20 bg-gray-300 rounded"></div>
          <div class="h-20 bg-gray-300 rounded"></div>
          <div class="h-20 bg-gray-300 rounded"></div>
        </div>
      )}
      
      {error() && (
        <div class="text-red-500 mb-4">{error()}</div>
      )}
      
      {!isLoading() && !error() && issues().length === 0 && (
        <div class="text-gray-500">No issues found for this review</div>
      )}
      
      {!isLoading() && !error() && issues().length > 0 && (
        <div class="space-y-4">
          {issues().map((issue) => (
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium flex-1">{issue.description}</h4>
                <span class={`px-2 py-1 text-xs rounded-full ml-2 ${
                  issue.resolved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {issue.resolved ? 'Resolved' : 'Open'}
                </span>
              </div>
              
              <div class="text-sm text-gray-600 mb-3">
                <div>
                  URL: <a href={issue.url} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
                    {issue.url}
                  </a>
                </div>
                {issue.assigned_to_user_id && (
                  <div>Assigned to: {issue.assigned_to_user_id}</div>
                )}
                <div class="text-xs text-gray-400 mt-1">
                  Created: {new Date(issue.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div class="flex gap-2">
                <button
                  onClick={() => handleResolveIssue(issue.id, issue.resolved)}
                  class={`px-3 py-1 text-xs rounded ${
                    issue.resolved
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {issue.resolved ? 'Reopen' : 'Resolve'}
                </button>
                
                  <select
                    onChange={(e) => handleAssignIssue(issue.id, e.currentTarget.value || undefined)}
                    class="px-3 py-1 text-xs border border-gray-300 rounded"
                    value={issue.assigned_to_user_id ?? ''}
                  >
                  <option value="">Unassigned</option>
                  <option value="user1">User 1</option>
                  <option value="user2">User 2</option>
                  <option value="user3">User 3</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};