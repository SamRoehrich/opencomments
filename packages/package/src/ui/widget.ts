import { addCreateCommentFormListener } from "../lib/globals";
import { clearAllIcons } from "../lib/create-comment-button";
import { renderAllIssues } from "../lib/render-all-issues";
import { createCommentIcon } from "./comment-icon";

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
const saveSettings = (settings: { name: string; env: string }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
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

  const dialog = document.createElement("div");
  dialog.className = "opencomments-settings-dialog";

  const title = document.createElement("h2");
  title.className = "opencomments-settings-dialog-title";
  title.textContent = "Settings";

  const form = document.createElement("div");
  form.className = "opencomments-settings-form";

  // Name input
  const nameLabel = document.createElement("label");
  nameLabel.className = "opencomments-settings-label";
  nameLabel.textContent = "Your Name";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "opencomments-settings-input";
  nameInput.placeholder = "Enter your name";
  // Load from localStorage if available
  const storedSettings = loadSettings();
  nameInput.value = storedSettings?.name || "";

  const nameContainer = document.createElement("div");
  nameContainer.className = "opencomments-settings-input-container";
  nameContainer.appendChild(nameLabel);
  nameContainer.appendChild(nameInput);

  // Env input
  const envLabel = document.createElement("label");
  envLabel.className = "opencomments-settings-label";
  envLabel.textContent = "Environment";

  const envInput = document.createElement("input");
  envInput.type = "text";
  envInput.className = "opencomments-settings-input";
  envInput.placeholder = "e.g., production, staging, dev";
  // Load from localStorage if available
  envInput.value = storedSettings?.env || "";

  const envContainer = document.createElement("div");
  envContainer.className = "opencomments-settings-input-container";
  envContainer.appendChild(envLabel);
  envContainer.appendChild(envInput);

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "opencomments-settings-button-container";

  const saveButton = document.createElement("button");
  saveButton.className = "opencomments-settings-button--save";
  saveButton.textContent = "Save";

  saveButton.onclick = (e) => {
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

    // Close dialog
    (window as any).OpenComments.dialog.remove();
  };

  const cancelButton = document.createElement("button");
  cancelButton.className = "opencomments-settings-button--cancel";
  cancelButton.textContent = "Cancel";

  cancelButton.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    (window as any).OpenComments.dialog.remove();
  };

  form.appendChild(nameContainer);
  form.appendChild(envContainer);
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(saveButton);
  form.appendChild(buttonContainer);

  dialog.appendChild(title);
  dialog.appendChild(form);

  // Click outside to close
  const handleClickOutside = (event: MouseEvent) => {
    if (dialog && !dialog.contains(event.target as Node)) {
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

// SVG icons
const createSettingsIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
  );
  svg.appendChild(path);

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "3");
  svg.appendChild(circle);

  return svg;
};

const createRefreshIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute("d", "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8");
  svg.appendChild(path1);

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M21 3v5h-5");
  svg.appendChild(path2);

  const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path3.setAttribute(
    "d",
    "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
  );
  svg.appendChild(path3);

  const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path4.setAttribute("d", "M3 21v-5h5");
  svg.appendChild(path4);

  return svg;
};

export const createWidget = () => {
  const widget = document.createElement("div");
  widget.className = "opencomments-widget";

  // Comment button (top)
  const commentButton = document.createElement("button");
  commentButton.className =
    "opencomments-widget-button opencomments-widget-button--comment";

  const commentIcon = createCommentIcon();
  commentIcon.setAttribute("class", "opencomments-widget-icon");
  commentButton.appendChild(commentIcon);

  commentButton.onclick = (e) => {
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
  };

  // Settings button (bottom)
  const settingsButton = document.createElement("button");
  settingsButton.className =
    "opencomments-widget-button opencomments-widget-button--settings";

  const settingsIcon = createSettingsIcon();
  settingsIcon.setAttribute("class", "opencomments-widget-icon");
  settingsButton.appendChild(settingsIcon);

  settingsButton.onclick = (e) => {
    e.stopPropagation();
    openSettingsDialog();
  };

  // Refresh button (bottom)
  const refreshButton = document.createElement("button");
  refreshButton.className =
    "opencomments-widget-button opencomments-widget-button--refresh";

  const refreshIcon = createRefreshIcon();
  refreshIcon.setAttribute("class", "opencomments-widget-icon");
  refreshButton.appendChild(refreshIcon);

  refreshButton.onclick = async (e) => {
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
  };

  widget.appendChild(commentButton);
  widget.appendChild(settingsButton);
  widget.appendChild(refreshButton);

  document.body.appendChild(widget);
};
