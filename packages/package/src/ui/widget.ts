import { addCreateCommentFormListener } from "../lib/globals";
import { clearAllIcons } from "../lib/create-comment-button";
import { renderAllIssues } from "../lib/render-all-issues";
import {
  createButton,
  createInput,
  createLabel,
  createDiv,
  createH2,
  createCommentIcon,
  createSettingsIcon,
  createRefreshIcon,
  createCheckmarkIcon,
  addDialogSubmitShortcut,
} from "./elements";
import { getActiveReview, setActiveReview } from "./review-dialog";
import { finalizeReview } from "./finalize-review";

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


export const createWidget = () => {
  const commentIcon = createCommentIcon({ className: "opencomments-widget-icon" });
  
  const commentButton = createButton({
    className: ["opencomments-widget-button", "opencomments-widget-button--comment"],
    children: [commentIcon],
    onClick: (e) => {
      e.stopPropagation();

      // Check if settings exist in localStorage
      const storedSettings = loadSettings();
      if (storedSettings) {
        // Use stored settings and go straight to comment mode
        userSettings = storedSettings;
        addCreateCommentFormListener();
      } else {
        // No settings found, open settings dialog first
        openSettingsDialog();
      }
    },
  });

  const settingsIcon = createSettingsIcon({ className: "opencomments-widget-icon" });
  
  const settingsButton = createButton({
    className: ["opencomments-widget-button", "opencomments-widget-button--settings"],
    children: [settingsIcon],
    onClick: (e) => {
      e.stopPropagation();
      openSettingsDialog();
    },
  });

  const refreshIcon = createRefreshIcon({ className: "opencomments-widget-icon" });
  
  const refreshButton = createButton({
    className: ["opencomments-widget-button", "opencomments-widget-button--refresh"],
    children: [refreshIcon],
    onClick: async (e) => {
      e.stopPropagation();

      // Disable button during refresh
      refreshButton.disabled = true;

      // Clear existing icons
      clearAllIcons();

      // Re-render all issues
      try {
        await renderAllIssues();
      } catch (error) {
        console.error("Failed to refresh comments:", error);
      } finally {
        // Re-enable button
        refreshButton.disabled = false;
      }
    },
  });

  // Finalize review button (only shown when review is active)
  const finalizeIcon = createCheckmarkIcon({ 
    className: "opencomments-widget-icon",
    width: "14",
    height: "14",
  });
  
  const finalizeButton = createButton({
    className: ["opencomments-widget-button", "opencomments-widget-button--finalize"],
    children: [finalizeIcon],
    title: "Finalize Review",
    onClick: (e) => {
      e.stopPropagation();
      if (confirm("Are you sure you want to finalize this review? This will end the current review session.")) {
        finalizeReview();
        updateFinalizeButtonVisibility();
      }
    },
  });

  // Function to update finalize button visibility
  const updateFinalizeButtonVisibility = () => {
    const activeReview = getActiveReview();
    if (activeReview) {
      if (!widget.contains(finalizeButton)) {
        // Insert before settings button
        widget.insertBefore(finalizeButton, settingsButton);
      }
      finalizeButton.style.display = "";
    } else {
      finalizeButton.style.display = "none";
    }
  };

  const widget = createDiv({
    className: "opencomments-widget",
    children: [commentButton, settingsButton, refreshButton],
  });

  // Listen for review state changes
  window.addEventListener("review-started", updateFinalizeButtonVisibility);
  window.addEventListener("review-finalized", updateFinalizeButtonVisibility);

  // Initial check for active review
  updateFinalizeButtonVisibility();

  document.body.appendChild(widget);
  
  return widget;
};

let widgetElement: HTMLElement | null = null;

export const createWidgetWithTracking = () => {
  // Remove existing widget if it exists
  if (widgetElement) {
    widgetElement.remove();
  }
  
  widgetElement = createWidget();
  return widgetElement;
};

export const removeWidget = () => {
  if (widgetElement) {
    widgetElement.remove();
    widgetElement = null;
  }
};
