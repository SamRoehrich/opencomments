import "./style.css";
import { createWidget } from "./ui/widget.ts";
import { renderAllIssues } from "./lib/render-all-issues.ts";

// Configuration interface
export interface OpenCommentsConfig {
  apiUrl?: string;
  autoInit?: boolean;
}

// Default configuration
let config: OpenCommentsConfig = {
  apiUrl: "http://localhost:3001/",
  autoInit: true,
};

// Track if already initialized
let initialized = false;

// Set the API base URL
export function setApiUrl(url: string) {
  config.apiUrl = url;
  // Update the API base URL in the API module
  if (typeof window !== "undefined") {
    (window as any).__OPENCOMMENTS_API_URL__ = url;
  }
}

// Initialize OpenComments
export function init(options?: OpenCommentsConfig) {
  // Prevent double initialization
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

  // Check for API URL from window
  if (typeof window !== "undefined" && (window as any).__OPENCOMMENTS_API_URL__) {
    config.apiUrl = (window as any).__OPENCOMMENTS_API_URL__;
  }

  // Create the widget
  createWidget();

  // Render all existing issues
  renderAllIssues().catch((error) => {
    console.error("Failed to render issues:", error);
  });

  initialized = true;
}

// Auto-initialize if enabled and not already initialized
if (typeof window !== "undefined") {
  // Check for pre-configured API URL
  if ((window as any).__OPENCOMMENTS_API_URL__) {
    config.apiUrl = (window as any).__OPENCOMMENTS_API_URL__;
  }

  // Check for config object
  if ((window as any).OpenComments?.config) {
    config = { ...config, ...(window as any).OpenComments.config };
  }

  // Export for global access first (before auto-init)
  (window as any).OpenComments = {
    init,
    setApiUrl,
  };

  // Check if auto-init is disabled (e.g., by React component)
  const disableAutoInit = (window as any).__OPENCOMMENTS_DISABLE_AUTO_INIT__ === true;

  if (config.autoInit && !disableAutoInit) {
    // Wait for DOM to be ready, but use requestAnimationFrame to ensure React has finished
    const initializeWhenReady = () => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          // Use requestAnimationFrame to ensure React hydration is complete
          requestAnimationFrame(() => {
            setTimeout(() => init(), 0);
          });
        });
      } else {
        // Use requestAnimationFrame to ensure React hydration is complete
        requestAnimationFrame(() => {
          setTimeout(() => init(), 0);
        });
      }
    };
    
    initializeWhenReady();
  }
}

