import { createSignal } from "solid-js";

const views = {
  home: 'home',
  createReview: 'create-review',
  viewReview: 'view-review',
  viewComment: 'view-comment',
  createComment: 'create-comment'
} as const

export const [currentView, setCurrentView] = createSignal<keyof typeof views>(views.home)

