import type { Component } from 'solid-js';
import { createSignal, Show, Switch, Match } from 'solid-js';
import { currentView, setCurrentView } from './lib/widget-state';
import {
  HomeSkeleton,
  CreateReviewSkeleton,
  ViewReviewSkeleton,
  ViewCommentSkeleton,
  CreateCommentSkeleton
} from './ui';

const App: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <>
      <div
        class="fixed bottom-4 right-4 z-50"
      >
        <button
          class="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
          on:click={() => setIsOpen(!isOpen())}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
      </div>

      <Show when={isOpen()}>
        <div
          class="fixed inset-0 z-40"
          style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', 'z-index': 9998 }}
        >
          <div
            class="absolute bottom-0 left-0 right-0 bg-white shadow-2xl transform transition-transform duration-300 ease-out"
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              'max-height': '80vh'
            }}
          >
            <div class="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 class="text-lg font-semibold text-gray-800">OpenComments</h2>
              <button
                class="p-1 hover:bg-gray-200 rounded transition-colors"
                on:click={() => setIsOpen(false)}
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
              <button
                class={`px-3 py-1 text-sm rounded transition-colors ${currentView() === 'home'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                on:click={() => setCurrentView('home')}
              >
                Home
              </button>
              <button
                class={`px-3 py-1 text-sm rounded transition-colors ${currentView() === 'createReview'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                on:click={() => setCurrentView('createReview')}
              >
                Create Review
              </button>
              <button
                class={`px-3 py-1 text-sm rounded transition-colors ${currentView() === 'viewReview'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                on:click={() => setCurrentView('viewReview')}
              >
                View Review
              </button>
              <button
                class={`px-3 py-1 text-sm rounded transition-colors ${currentView() === 'viewComment'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                on:click={() => setCurrentView('viewComment')}
              >
                View Comment
              </button>
              <button
                class={`px-3 py-1 text-sm rounded transition-colors ${currentView() === 'createComment'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                on:click={() => setCurrentView('createComment')}
              >
                Create Comment
              </button>
            </div>
            <div class="overflow-y-auto" style={{ 'max-height': 'calc(80vh - 120px)' }}>
              <Switch>
                <Match when={currentView() === 'home'}>
                  <HomeSkeleton />
                </Match>
                <Match when={currentView() === 'createReview'}>
                  <CreateReviewSkeleton />
                </Match>
                <Match when={currentView() === 'viewReview'}>
                  <ViewReviewSkeleton />
                </Match>
                <Match when={currentView() === 'viewComment'}>
                  <ViewCommentSkeleton />
                </Match>
                <Match when={currentView() === 'createComment'}>
                  <CreateCommentSkeleton />
                </Match>
              </Switch>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default App;
