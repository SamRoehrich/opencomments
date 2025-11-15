import { addCreateCommentFormListener } from "../lib/globals";
import { clearAllIcons } from "../lib/create-comment-button";
import { renderAllIssues } from "../lib/render-all-issues";

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

let widgetDialog: HTMLElement | null = null;

const openSettingsDialog = () => {
  // Remove existing dialog if it exists
  if (widgetDialog) {
    widgetDialog.remove();
    widgetDialog = null;
  }

  const dialog = document.createElement("div");
  dialog.style.position = "fixed";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";
  dialog.style.zIndex = "10001";
  dialog.style.backgroundColor = "white";
  dialog.style.borderRadius = "12px";
  dialog.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
  dialog.style.padding = "24px";
  dialog.style.minWidth = "320px";
  dialog.style.maxWidth = "400px";

  const title = document.createElement("h2");
  title.textContent = "Settings";
  title.style.margin = "0 0 20px 0";
  title.style.fontSize = "20px";
  title.style.fontWeight = "600";
  title.style.color = "#333";

  const form = document.createElement("div");
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.gap = "16px";

  // Name input
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Your Name";
  nameLabel.style.fontSize = "14px";
  nameLabel.style.fontWeight = "500";
  nameLabel.style.color = "#555";
  nameLabel.style.marginBottom = "4px";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Enter your name";
  // Load from localStorage if available
  const storedSettings = loadSettings();
  nameInput.value = storedSettings?.name || "";
  nameInput.style.padding = "10px";
  nameInput.style.border = "1px solid #ddd";
  nameInput.style.borderRadius = "6px";
  nameInput.style.fontSize = "14px";
  nameInput.style.fontFamily = "inherit";
  nameInput.style.width = "100%";
  nameInput.style.boxSizing = "border-box";

  const nameContainer = document.createElement("div");
  nameContainer.style.display = "flex";
  nameContainer.style.flexDirection = "column";
  nameContainer.appendChild(nameLabel);
  nameContainer.appendChild(nameInput);

  // Env input
  const envLabel = document.createElement("label");
  envLabel.textContent = "Environment";
  envLabel.style.fontSize = "14px";
  envLabel.style.fontWeight = "500";
  envLabel.style.color = "#555";
  envLabel.style.marginBottom = "4px";

  const envInput = document.createElement("input");
  envInput.type = "text";
  envInput.placeholder = "e.g., production, staging, dev";
  // Load from localStorage if available
  envInput.value = storedSettings?.env || "";
  envInput.style.padding = "10px";
  envInput.style.border = "1px solid #ddd";
  envInput.style.borderRadius = "6px";
  envInput.style.fontSize = "14px";
  envInput.style.fontFamily = "inherit";
  envInput.style.width = "100%";
  envInput.style.boxSizing = "border-box";

  const envContainer = document.createElement("div");
  envContainer.style.display = "flex";
  envContainer.style.flexDirection = "column";
  envContainer.appendChild(envLabel);
  envContainer.appendChild(envInput);

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.marginTop = "8px";

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.style.flex = "1";
  saveButton.style.padding = "12px 20px";
  saveButton.style.borderRadius = "6px";
  saveButton.style.border = "none";
  saveButton.style.backgroundColor = "#4caf50";
  saveButton.style.color = "white";
  saveButton.style.fontSize = "14px";
  saveButton.style.fontWeight = "500";
  saveButton.style.cursor = "pointer";
  saveButton.style.transition = "background-color 0.2s";

  saveButton.onmouseenter = () => {
    saveButton.style.backgroundColor = "#45a049";
  };
  saveButton.onmouseleave = () => {
    saveButton.style.backgroundColor = "#4caf50";
  };

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
    dialog.remove();
    widgetDialog = null;
  };

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.style.padding = "12px 20px";
  cancelButton.style.borderRadius = "6px";
  cancelButton.style.border = "1px solid #ddd";
  cancelButton.style.backgroundColor = "white";
  cancelButton.style.color = "#333";
  cancelButton.style.fontSize = "14px";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.transition = "background-color 0.2s";

  cancelButton.onmouseenter = () => {
    cancelButton.style.backgroundColor = "#f5f5f5";
  };
  cancelButton.onmouseleave = () => {
    cancelButton.style.backgroundColor = "white";
  };

  cancelButton.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dialog.remove();
    widgetDialog = null;
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
      dialog.remove();
      widgetDialog = null;
      document.removeEventListener('click', handleClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 0);

  document.body.appendChild(dialog);
  widgetDialog = dialog;

  // Focus name input
  nameInput.focus();
};

// SVG icons
const createCommentIcon = () => {
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
  path1.setAttribute("d", "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z");
  svg.appendChild(path1);
  
  return svg;
};

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
  path.setAttribute("d", "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z");
  svg.appendChild(path);
  
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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
  path3.setAttribute("d", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16");
  svg.appendChild(path3);
  
  const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path4.setAttribute("d", "M3 21v-5h5");
  svg.appendChild(path4);
  
  return svg;
};

export const createWidget = () => {
  const widget = document.createElement("div");
  widget.style.position = "fixed";
  widget.style.top = "24px";
  widget.style.left = "24px";
  widget.style.display = "flex";
  widget.style.flexDirection = "column";
  widget.style.gap = "8px";
  widget.style.zIndex = "9998";

  // Comment button (top)
  const commentButton = document.createElement("button");
  commentButton.style.width = "48px";
  commentButton.style.height = "48px";
  commentButton.style.borderRadius = "50%";
  commentButton.style.border = "2px solid #4caf50";
  commentButton.style.backgroundColor = "#4caf50";
  commentButton.style.color = "white";
  commentButton.style.display = "flex";
  commentButton.style.alignItems = "center";
  commentButton.style.justifyContent = "center";
  commentButton.style.cursor = "pointer";
  commentButton.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
  commentButton.style.transition = "transform 0.2s, box-shadow 0.2s";
  commentButton.style.padding = "0";
  commentButton.style.margin = "0";
  
  const commentIcon = createCommentIcon();
  commentButton.appendChild(commentIcon);

  commentButton.onmouseenter = () => {
    commentButton.style.transform = "scale(1.1)";
    commentButton.style.boxShadow = "0 6px 16px rgba(76, 175, 80, 0.4)";
  };

  commentButton.onmouseleave = () => {
    commentButton.style.transform = "scale(1)";
    commentButton.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
  };

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
  settingsButton.style.width = "48px";
  settingsButton.style.height = "48px";
  settingsButton.style.borderRadius = "50%";
  settingsButton.style.border = "2px solid #6b7280";
  settingsButton.style.backgroundColor = "white";
  settingsButton.style.color = "#6b7280";
  settingsButton.style.display = "flex";
  settingsButton.style.alignItems = "center";
  settingsButton.style.justifyContent = "center";
  settingsButton.style.cursor = "pointer";
  settingsButton.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
  settingsButton.style.transition = "transform 0.2s, box-shadow 0.2s, background-color 0.2s";
  settingsButton.style.padding = "0";
  settingsButton.style.margin = "0";
  
  const settingsIcon = createSettingsIcon();
  settingsButton.appendChild(settingsIcon);

  settingsButton.onmouseenter = () => {
    settingsButton.style.transform = "scale(1.1)";
    settingsButton.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.15)";
    settingsButton.style.backgroundColor = "#f3f4f6";
  };

  settingsButton.onmouseleave = () => {
    settingsButton.style.transform = "scale(1)";
    settingsButton.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    settingsButton.style.backgroundColor = "white";
  };

  settingsButton.onclick = (e) => {
    e.stopPropagation();
    openSettingsDialog();
  };

  // Refresh button (bottom)
  const refreshButton = document.createElement("button");
  refreshButton.style.width = "48px";
  refreshButton.style.height = "48px";
  refreshButton.style.borderRadius = "50%";
  refreshButton.style.border = "2px solid #3b82f6";
  refreshButton.style.backgroundColor = "white";
  refreshButton.style.color = "#3b82f6";
  refreshButton.style.display = "flex";
  refreshButton.style.alignItems = "center";
  refreshButton.style.justifyContent = "center";
  refreshButton.style.cursor = "pointer";
  refreshButton.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
  refreshButton.style.transition = "transform 0.2s, box-shadow 0.2s, background-color 0.2s";
  refreshButton.style.padding = "0";
  refreshButton.style.margin = "0";
  
  const refreshIcon = createRefreshIcon();
  refreshButton.appendChild(refreshIcon);

  refreshButton.onmouseenter = () => {
    refreshButton.style.transform = "scale(1.1)";
    refreshButton.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.2)";
    refreshButton.style.backgroundColor = "#eff6ff";
  };

  refreshButton.onmouseleave = () => {
    refreshButton.style.transform = "scale(1)";
    refreshButton.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    refreshButton.style.backgroundColor = "white";
  };

  refreshButton.onclick = async (e) => {
    e.stopPropagation();
    
    // Disable button during refresh
    refreshButton.disabled = true;
    refreshButton.style.opacity = "0.6";
    refreshButton.style.cursor = "wait";
    
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
      refreshButton.style.opacity = "1";
      refreshButton.style.cursor = "pointer";
    }
  };

  widget.appendChild(commentButton);
  widget.appendChild(settingsButton);
  widget.appendChild(refreshButton);

  document.body.appendChild(widget);
};
