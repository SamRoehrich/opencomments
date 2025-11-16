import "./style.css";
import { createWidget } from "./ui/widget.ts";
import { renderAllIssues } from "./lib/render-all-issues.ts";
import { createBaseWidget } from "./ui/base-widget.ts";

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

  // createWidget();
  createBaseWidget();

  renderAllIssues().catch((error) => {
    console.error("Failed to render issues:", error);
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
