import { addCreateCommentFormListener } from "../lib/globals";
import {
  createButton,
  createInput,
  createLabel,
  createDiv,
  createH2,
  createCommentIcon,
  createSettingsIcon,
  createCheckmarkIcon,
  addDialogSubmitShortcut,
  createCloseIcon,
} from "./elements";
import { getActiveReview, setActiveReview, openReviewDialog } from "./review-dialog";
import { finalizeReview } from "./finalize-review";
import { getReviews } from "../api/reviews";

const STORAGE_KEY = "opencomments_settings";

// Store user settings
let userSettings: { name: string; env: string } | null = null;

// Load settings from localStorage
const loadSettings = (): { name: string; env: string } | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.name && parsed.env) {
        return { name: parsed.name, env: parsed.env };
      }
    }
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
  }
  return null;
};

// Save settings to localStorage
export const saveSettings = (settings: { name: string; env: string }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    userSettings = settings;
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

// Initialize settings from localStorage
userSettings = loadSettings();

export const getUserSettings = () => userSettings;

const openSettingsDialog = () => {
  // Remove existing dialog if it exists
  (window as any).OpenComments.dialog.remove();

  const storedSettings = loadSettings();

  const nameInput = createInput({
    type: "text",
    className: "opencomments-settings-input",
    placeholder: "Enter your name",
    value: storedSettings?.name || "",
  });

  const envInput = createInput({
    type: "text",
    className: "opencomments-settings-input",
    placeholder: "e.g., production, staging, dev",
    value: storedSettings?.env || "",
  });

  const saveButton = createButton({
    className: "opencomments-settings-button--save",
    text: "Save",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();

      const name = nameInput.value.trim();
      const env = envInput.value.trim();

      if (!name || !env) {
        alert("Please fill in both name and environment");
        return;
      }

      // Save settings
      userSettings = { name, env };
      saveSettings(userSettings);

      // Cleanup keyboard shortcut listeners
      cleanupSubmitShortcut();

      // Close dialog
      (window as any).OpenComments.dialog.remove();
    },
  });

  const cancelButton = createButton({
    className: "opencomments-settings-button--cancel",
    text: "Cancel",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      cleanupSubmitShortcut();
      (window as any).OpenComments.dialog.remove();
    },
  });

  const nameLabel = createLabel({
    className: "opencomments-settings-label",
    text: "Your Name",
  });

  const envLabel = createLabel({
    className: "opencomments-settings-label",
    text: "Environment",
  });

  const nameContainer = createDiv({
    className: "opencomments-settings-input-container",
    children: [nameLabel, nameInput],
  });

  const envContainer = createDiv({
    className: "opencomments-settings-input-container",
    children: [envLabel, envInput],
  });

  const buttonContainer = createDiv({
    className: "opencomments-settings-button-container",
    children: [cancelButton, saveButton],
  });

  const form = createDiv({
    className: "opencomments-settings-form",
    children: [nameContainer, envContainer, buttonContainer],
  });

  const title = createH2({
    className: "opencomments-settings-dialog-title",
    text: "Settings",
  });

  const dialog = createDiv({
    className: "opencomments-settings-dialog",
    children: [title, form],
  });

  // Add keyboard shortcut support
  const cleanupSubmitShortcut = addDialogSubmitShortcut(dialog, saveButton);

  // Click outside to close
  const handleClickOutside = (event: MouseEvent) => {
    if (dialog && !dialog.contains(event.target as Node)) {
      cleanupSubmitShortcut();
      (window as any).OpenComments.dialog.remove();
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
  };

  // Add Escape key handler to close settings dialog
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      cleanupSubmitShortcut();
      (window as any).OpenComments.dialog.remove();
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
  }, 0);

  document.body.appendChild(dialog);
  (window as any).OpenComments.dialog.set(dialog);

  // Focus name input
  nameInput.focus();
};


let widgetElement: HTMLElement | null = null;
let commentButton: HTMLElement | null = null;
let settingsButton: HTMLElement | null = null;
let finalizeButton: HTMLElement | null = null;
let reviewSelectionButton: HTMLElement | null = null;
let isReviewListExpanded = false;
let expandedContent: HTMLElement | null = null;
let handleKeyboardShortcuts: ((e: KeyboardEvent) => void) | null = null;

const loadReviewsIntoList = async (reviewListContainer: HTMLElement) => {
  reviewListContainer.innerHTML = "";
  
  const loadingText = createDiv({
    className: "opencomments-base-widget-loading",
    text: "Loading reviews...",
  });
  reviewListContainer.appendChild(loadingText);

  const settings = getUserSettings();
  const envId = settings?.env;

  let reviews: any[] = [];

  try {
    reviews = await getReviews(envId);
  } catch (error) {
    console.error("Failed to load reviews:", error);
    reviewListContainer.innerHTML = "";
    const errorText = createDiv({
      className: "opencomments-base-widget-error",
      text: "Failed to load reviews",
    });
    reviewListContainer.appendChild(errorText);
    return;
  }

  reviewListContainer.innerHTML = "";

  if (reviews.length === 0) {
    const noReviewsText = createDiv({
      className: "opencomments-base-widget-empty",
      text: "No reviews found",
    });
    reviewListContainer.appendChild(noReviewsText);
    return;
  }

  reviews.forEach((review) => {
    const reviewItem = createDiv({
      className: "opencomments-base-widget-review-item",
    });

    const reviewName = createDiv({
      className: "opencomments-base-widget-review-name",
      text: review.name,
    });

    const reviewDescription = review.description
      ? createDiv({
          className: "opencomments-base-widget-review-description",
          text: review.description,
        })
      : null;

    const reviewMeta = createDiv({
      className: "opencomments-base-widget-review-meta",
      text: new Date(review.created_at).toLocaleDateString(),
    });

    reviewItem.appendChild(reviewName);
    if (reviewDescription) {
      reviewItem.appendChild(reviewDescription);
    }
    reviewItem.appendChild(reviewMeta);

    reviewItem.onclick = async (e) => {
      e.stopPropagation();

      // Set active review
      setActiveReview({
        id: review.id,
        name: review.name,
        description: review.description || undefined,
        env_id: review.env_id || undefined,
      });

      // Collapse widget
      collapseReviewList();

      // Switch to viewer mode for existing reviews (not reviewer mode)
      window.dispatchEvent(new CustomEvent("review-selected", { detail: review }));
    };

    reviewListContainer.appendChild(reviewItem);
  });
};

const expandReviewList = async () => {
  if (isReviewListExpanded || !widgetElement) return;
  isReviewListExpanded = true;

  // Add expanded class - works with both widget classes
  widgetElement.classList.add("opencomments-base-widget--expanded");
  widgetElement.style.position = "relative";

  expandedContent = createDiv({
    className: "opencomments-base-widget-expanded",
  });

  const headerContainer = createDiv({
    className: "opencomments-base-widget-header",
  });

  const reviewsText = createDiv({
    className: "opencomments-base-widget-reviews-text",
    text: "Reviews",
  });

  const closeButton = createButton({
    className: "opencomments-base-widget-close-button",
    children: [createCloseIcon({ className: "opencomments-base-widget-close-icon", width: "12", height: "12" })],
    onClick: (e) => {
      e.stopPropagation();
      collapseReviewList();
    },
  });

  headerContainer.appendChild(reviewsText);
  headerContainer.appendChild(closeButton);

  const reviewListContainer = createDiv({
    className: "opencomments-base-widget-review-list",
  });

  const createNewButton = createButton({
    className: "opencomments-base-widget-create-button",
    text: "Start New Review",
    onClick: (e) => {
      e.stopPropagation();
      collapseReviewList();
      openReviewDialog();
    },
  });

  expandedContent.appendChild(headerContainer);
  expandedContent.appendChild(reviewListContainer);
  expandedContent.appendChild(createNewButton);

  widgetElement.appendChild(expandedContent);

  await loadReviewsIntoList(reviewListContainer);

  // Add click outside handler
  const handleClickOutside = (event: MouseEvent) => {
    if (widgetElement && !widgetElement.contains(event.target as Node)) {
      collapseReviewList();
      document.removeEventListener("click", handleClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
};

const collapseReviewList = () => {
  if (!isReviewListExpanded || !widgetElement) return;
  isReviewListExpanded = false;

  widgetElement.classList.remove("opencomments-base-widget--expanded");
  widgetElement.style.position = "";
  
  if (expandedContent) {
    expandedContent.remove();
    expandedContent = null;
  }
};

const updateWidgetButtons = () => {
  if (!widgetElement) return;

  // Collapse review list if open
  collapseReviewList();

  const activeReview = getActiveReview();

  // Clear all buttons
  widgetElement.innerHTML = "";

  if (activeReview) {
    // Review mode: show comment, settings, and finalize buttons
    const commentIcon = createCommentIcon({ className: "opencomments-widget-icon" });
    
    commentButton = createButton({
      className: ["opencomments-widget-button", "opencomments-widget-button--comment"],
      children: [commentIcon],
      onClick: (e) => {
        e.stopPropagation();
        const storedSettings = loadSettings();
        if (storedSettings) {
          userSettings = storedSettings;
          addCreateCommentFormListener();
        } else {
          openSettingsDialog();
        }
      },
      title: "Add Comment (Press 'c')",
    });

    const finalizeIcon = createCheckmarkIcon({ 
      className: "opencomments-widget-icon",
      width: "14",
      height: "14",
    });
    
    finalizeButton = createButton({
      className: ["opencomments-widget-button", "opencomments-widget-button--finalize"],
      children: [finalizeIcon],
      title: "Finalize Review (Cmd+Enter)",
      onClick: (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to finalize this review? This will end the current review session.")) {
          finalizeReview();
        }
      },
    });

    const settingsIcon = createSettingsIcon({ className: "opencomments-widget-icon" });
    
    settingsButton = createButton({
      className: ["opencomments-widget-button", "opencomments-widget-button--settings"],
      children: [settingsIcon],
      onClick: (e) => {
        e.stopPropagation();
        openSettingsDialog();
      },
    });

    widgetElement.appendChild(commentButton);
    widgetElement.appendChild(finalizeButton);
    widgetElement.appendChild(settingsButton);
  } else {
    // No review: show review selection button
    const reviewIcon = createCommentIcon({ className: "opencomments-widget-icon" });
    
    reviewSelectionButton = createButton({
      className: ["opencomments-widget-button", "opencomments-widget-button--comment"],
      children: [reviewIcon],
      onClick: async (e) => {
        e.stopPropagation();
        if (isReviewListExpanded) {
          collapseReviewList();
        } else {
          await expandReviewList();
        }
      },
      title: "Select or create a review",
    });

    widgetElement.appendChild(reviewSelectionButton);
  }
};

const setupKeyboardShortcuts = () => {
  // Remove existing handler if any
  if (handleKeyboardShortcuts) {
    document.removeEventListener("keydown", handleKeyboardShortcuts);
  }

  handleKeyboardShortcuts = (e: KeyboardEvent) => {
    const activeReview = getActiveReview();
    
    // Only handle shortcuts when review is active
    if (!activeReview) return;

    // Press 'c' to enable comment mode
    if (e.key === 'c' || e.key === 'C') {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      const storedSettings = loadSettings();
      if (storedSettings) {
        userSettings = storedSettings;
        addCreateCommentFormListener();
      } else {
        openSettingsDialog();
      }
      return;
    }

    // Command+Enter or Ctrl+Enter to finalize review
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      
      if (confirm("Are you sure you want to finalize this review? This will end the current review session.")) {
        finalizeReview();
      }
      return;
    }
  };

  document.addEventListener("keydown", handleKeyboardShortcuts);
};

export const createWidget = () => {
  // Remove existing widget if it exists
  if (widgetElement) {
    widgetElement.remove();
  }

  widgetElement = createDiv({
    className: "opencomments-widget",
    children: [],
  });

  updateWidgetButtons();
  setupKeyboardShortcuts();

  // Listen for review state changes
  window.addEventListener("review-started", () => {
    updateWidgetButtons();
    setupKeyboardShortcuts();
  });
  
  window.addEventListener("review-finalized", () => {
    updateWidgetButtons();
    setupKeyboardShortcuts();
  });

  window.addEventListener("review-exited", () => {
    updateWidgetButtons();
    setupKeyboardShortcuts();
  });

  document.body.appendChild(widgetElement);
  
  return widgetElement;
};

export const createWidgetWithTracking = () => {
  return createWidget();
};

export const removeWidget = () => {
  if (widgetElement) {
    if (handleKeyboardShortcuts) {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
      handleKeyboardShortcuts = null;
    }
    widgetElement.remove();
    widgetElement = null;
    commentButton = null;
    settingsButton = null;
    finalizeButton = null;
    reviewSelectionButton = null;
    expandedContent = null;
    isReviewListExpanded = false;
  }
};

export const updateWidget = () => {
  if (widgetElement) {
    updateWidgetButtons();
  }
};
