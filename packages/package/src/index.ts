import "./style.css";
import { createWidgetWithTracking, removeWidget, updateWidget } from "./ui/widget.ts";
import { createReviewViewerWidget, removeReviewViewerWidget } from "./ui/review-viewer-widget.ts";
import { renderAllIssues } from "./lib/render-all-issues.ts";
import { getActiveReview } from "./ui/review-dialog.ts";
import { clearAllIcons } from "./lib/create-comment-button.ts";
import { removeCreateCommentFormListener } from "./lib/globals.ts";

export interface OpenCommentsConfig {
  apiUrl?: string;
  autoInit?: boolean;
}

let config: OpenCommentsConfig = {
  apiUrl: "https://api.opencomments.io",
  autoInit: true,
};

let initialized = false;

export function setApiUrl(url: string) {
  config.apiUrl = url;
  (window as any).__OPENCOMMENTS_API_URL__ = window.location.href.includes(
    "localhost:5173",
  )
    ? "http://localhost:3001"
    : url;
}

export function init(options?: OpenCommentsConfig) {
  if (initialized) {
    console.warn("OpenComments is already initialized");
    return;
  }

  if (options) {
    config = { ...config, ...options };
    if (options.apiUrl) {
      setApiUrl(options.apiUrl);
    }
  }

  if (
    typeof window !== "undefined" &&
    (window as any).__OPENCOMMENTS_API_URL__
  ) {
    config.apiUrl = (window as any).__OPENCOMMENTS_API_URL__;
  }

  // Create the unified widget that adapts based on review state
  createWidgetWithTracking();

  // Check if there's an active review - if so, switch to viewer mode
  const activeReview = getActiveReview();
  if (activeReview) {
    // Switch to viewer mode for existing reviews
    removeWidget();
    createReviewViewerWidget();
    // Load comments for the active review
    renderAllIssues().catch((error) => {
      console.error("Failed to render issues:", error);
    });
  }

  // Listen for review state changes to update widget and load comments
  window.addEventListener("review-started", async () => {
    // This is for newly created reviews - stay in reviewer mode
    updateWidget();
    // Load comments for the newly created review
    clearAllIcons();
    await renderAllIssues().catch((error) => {
      console.error("Failed to render issues:", error);
    });
  });

  // Listen for review selection (existing reviews) - switch to viewer mode
  window.addEventListener("review-selected", async () => {
    // Check if we're already in viewer mode (review-viewer-widget exists)
    const existingViewerWidget = document.querySelector(".opencomments-review-viewer");
    if (!existingViewerWidget) {
      // Switch to viewer mode for existing reviews
      removeWidget();
      createReviewViewerWidget();
    }
    // Load comments for the selected review
    clearAllIcons();
    await renderAllIssues().catch((error) => {
      console.error("Failed to render issues:", error);
    });
  });

  window.addEventListener("review-finalized", () => {
    // Switch back to base widget
    removeReviewViewerWidget();
    createWidgetWithTracking();
    // Disable comment mode and clear all comment icons when review is finalized
    removeCreateCommentFormListener();
    clearAllIcons();
  });

  window.addEventListener("review-exited", () => {
    // Switch back to base widget
    removeReviewViewerWidget();
    createWidgetWithTracking();
    // Disable comment mode and clear all comment icons when review is exited
    removeCreateCommentFormListener();
    clearAllIcons();
  });

  initialized = true;
}

if (typeof window !== "undefined") {
  if ((window as any).__OPENCOMMENTS_API_URL__) {
    config.apiUrl = (window as any).__OPENCOMMENTS_API_URL__;
  }

  if ((window as any).OpenComments?.config) {
    config = { ...config, ...(window as any).OpenComments.config };
  }

  (window as any).OpenComments = {
    config,
    init,
    setApiUrl,
    dialog: {
      element: null,
      remove: () => {
        if ((window as any).OpenComments.dialog.element) {
          (window as any).OpenComments.dialog.element.remove();
          (window as any).OpenComments.dialog.element = null;
        }
      },
      set: (el: HTMLElement) => {
        // Remove existing dialog if it exists
        if ((window as any).OpenComments.dialog.element) {
          (window as any).OpenComments.dialog.element.remove();
        }
        (window as any).OpenComments.dialog.element = el;
      },
    },
  };

  const disableAutoInit =
    (window as any).__OPENCOMMENTS_DISABLE_AUTO_INIT__ === true;

  if (config.autoInit && !disableAutoInit) {
    const initializeWhenReady = () => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          requestAnimationFrame(() => {
            setTimeout(() => init(), 0);
          });
        });
      } else {
        requestAnimationFrame(() => {
          setTimeout(() => init(), 0);
        });
      }
    };
    initializeWhenReady();
  }
}
