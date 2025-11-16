import "./style.css";
import { createWidgetWithTracking, removeWidget } from "./ui/widget.ts";
import { renderAllIssues } from "./lib/render-all-issues.ts";
import { createBaseWidget, removeBaseWidget } from "./ui/base-widget.ts";
import { getActiveReview } from "./ui/review-dialog.ts";
import { clearAllIcons } from "./lib/create-comment-button.ts";

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

  // Check if there's an active review - if so, show full widget, otherwise show base widget
  const activeReview = getActiveReview();
  if (activeReview) {
    // Remove base widget if it exists and create full widget
    removeBaseWidget();
    createWidgetWithTracking();
    // Load comments for the active review
    renderAllIssues().catch((error) => {
      console.error("Failed to render issues:", error);
    });
  } else {
    createBaseWidget();
    // Don't load comments until a review is selected
  }

  // Listen for review state changes to switch between widgets
  window.addEventListener("review-started", async () => {
    removeBaseWidget();
    createWidgetWithTracking();
    // Load comments for the newly selected review
    clearAllIcons();
    await renderAllIssues().catch((error) => {
      console.error("Failed to render issues:", error);
    });
  });

  window.addEventListener("review-finalized", () => {
    removeWidget();
    createBaseWidget();
    // Clear all comment icons when review is finalized
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
