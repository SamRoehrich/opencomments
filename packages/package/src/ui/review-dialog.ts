import { createReview } from "../api/reviews";
import { getUserSettings, saveSettings } from "./widget";
import {
  createButton,
  createInput,
  createTextarea,
  createLabel,
  createDiv,
  createH2,
  createDialog,
  addDialogSubmitShortcut,
} from "./elements";

const STORAGE_KEY = "opencomments_active_review";

export interface ActiveReview {
  id: number;
  name: string;
  description?: string;
  env_id?: string;
}

export const getActiveReview = (): ActiveReview | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load active review from localStorage:", error);
  }
  return null;
};

export const setActiveReview = (review: ActiveReview | null) => {
  try {
    if (review) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(review));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save active review to localStorage:", error);
  }
};

export const openReviewDialog = () => {
  // Remove existing dialog if it exists
  (window as any).OpenComments.dialog.remove();

  // Try to get existing settings to pre-fill, but don't require them
  const settings = getUserSettings();

  const reviewNameInput = createInput({
    type: "text",
    className: "opencomments-review-input",
    placeholder: "Enter review name...",
  });

  const userNameInput = createInput({
    type: "text",
    className: "opencomments-review-input",
    placeholder: "Enter your name...",
    value: settings?.name || "",
  });

  const envInput = createInput({
    type: "text",
    className: "opencomments-review-input",
    placeholder: "e.g., production, staging, dev",
    value: settings?.env || "",
  });

  const descriptionInput = createTextarea({
    className: "opencomments-review-textarea",
    placeholder: "Enter review description (optional)...",
  });

  const createButtonEl = createButton({
    className: "opencomments-review-button--create",
    text: "Start Review",
    onClick: async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const reviewName = reviewNameInput.value.trim();
      const userName = userNameInput.value.trim();
      const env = envInput.value.trim();
      const description = descriptionInput.value.trim();

      if (!reviewName) {
        alert("Please enter a review name");
        return;
      }

      if (!userName) {
        alert("Please enter your name");
        return;
      }

      if (!env) {
        alert("Please enter an environment");
        return;
      }

      createButtonEl.disabled = true;
      createButtonEl.textContent = "Creating...";

      try {
        const review = await createReview({
          name: reviewName,
          description: description || undefined,
          user_id: userName,
          env_id: env,
          status: "active",
        });

        // Store active review in localStorage
        setActiveReview({
          id: review.id,
          name: review.name,
          description: review.description || undefined,
          env_id: review.env_id || undefined,
        });

        // Also save user settings for future use
        saveSettings({ name: userName, env });

        // Cleanup keyboard shortcut listeners
        cleanupSubmitShortcut();

        // Close dialog
        (window as any).OpenComments.dialog.remove();

        // Refresh the page or update UI to show review is active
        window.dispatchEvent(new CustomEvent("review-started", { detail: review }));
      } catch (error) {
        console.error("Failed to create review:", error);
        alert("Failed to create review. Please try again.");
      } finally {
        createButtonEl.disabled = false;
        createButtonEl.textContent = "Start Review";
      }
    },
  });

  const cancelButton = createButton({
    className: "opencomments-review-button--cancel",
    text: "Cancel",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      cleanupSubmitShortcut();
      (window as any).OpenComments.dialog.remove();
    },
  });

  const reviewNameLabel = createLabel({
    className: "opencomments-review-label",
    text: "Review Name",
  });

  const userNameLabel = createLabel({
    className: "opencomments-review-label",
    text: "Your Name",
  });

  const envLabel = createLabel({
    className: "opencomments-review-label",
    text: "Environment",
  });

  const descriptionLabel = createLabel({
    className: "opencomments-review-label",
    text: "Description (optional)",
  });

  const reviewNameContainer = createDiv({
    className: "opencomments-review-input-container",
    children: [reviewNameLabel, reviewNameInput],
  });

  const userNameContainer = createDiv({
    className: "opencomments-review-input-container",
    children: [userNameLabel, userNameInput],
  });

  const envContainer = createDiv({
    className: "opencomments-review-input-container",
    children: [envLabel, envInput],
  });

  const descriptionContainer = createDiv({
    className: "opencomments-review-input-container",
    children: [descriptionLabel, descriptionInput],
  });

  const buttonContainer = createDiv({
    className: "opencomments-review-button-container",
    children: [cancelButton, createButtonEl],
  });

  const form = createDiv({
    className: "opencomments-review-form",
    children: [reviewNameContainer, userNameContainer, envContainer, descriptionContainer, buttonContainer],
  });

  const title = createH2({
    className: "opencomments-review-dialog-title",
    text: "Start New Review",
  });

  const dialog = createDialog({
    className: "opencomments-review-dialog",
    centered: true,
    children: [title, form],
  });

  // Add keyboard shortcut support
  const cleanupSubmitShortcut = addDialogSubmitShortcut(dialog, createButtonEl);

  // Click outside to close
  const handleClickOutside = (event: MouseEvent) => {
    if (dialog && !dialog.contains(event.target as Node)) {
      cleanupSubmitShortcut();
      (window as any).OpenComments.dialog.remove();
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
  };

  // Add Escape key handler to close dialog
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

  (window as any).OpenComments.dialog.set(dialog);

  // Focus review name input
  reviewNameInput.focus();
};

