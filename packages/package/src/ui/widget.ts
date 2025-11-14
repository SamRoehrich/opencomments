import { addCreateCommentFormListener } from "../lib/globals";

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

const openWidgetDialog = () => {
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
  title.textContent = "Open Comments";
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

  const startButton = document.createElement("button");
  startButton.textContent = "Start Commenting";
  startButton.style.flex = "1";
  startButton.style.padding = "12px 20px";
  startButton.style.borderRadius = "6px";
  startButton.style.border = "none";
  startButton.style.backgroundColor = "#4caf50";
  startButton.style.color = "white";
  startButton.style.fontSize = "14px";
  startButton.style.fontWeight = "500";
  startButton.style.cursor = "pointer";
  startButton.style.transition = "background-color 0.2s";

  startButton.onmouseenter = () => {
    startButton.style.backgroundColor = "#45a049";
  };
  startButton.onmouseleave = () => {
    startButton.style.backgroundColor = "#4caf50";
  };

  startButton.onclick = (e) => {
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
    
    // Start comment mode
    addCreateCommentFormListener();
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
  buttonContainer.appendChild(startButton);
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

export const createWidget = () => {
  const widget = document.createElement("div");
  widget.innerHTML = "<p>C</p>";
  widget.style.height = "48px";
  widget.style.width = "48px";
  widget.style.borderRadius = "100px";
  widget.style.position = "fixed";
  widget.style.top = "24px";
  widget.style.left = "24px";
  widget.style.border = "2px solid #4caf50";
  widget.style.backgroundColor = "#4caf50";
  widget.style.color = "white";
  widget.style.textAlign = "center";
  widget.style.lineHeight = "44px";
  widget.style.cursor = "pointer";
  widget.style.fontWeight = "600";
  widget.style.fontSize = "18px";
  widget.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
  widget.style.transition = "transform 0.2s, box-shadow 0.2s";
  widget.style.zIndex = "9998";

  widget.onmouseenter = () => {
    widget.style.transform = "scale(1.1)";
    widget.style.boxShadow = "0 6px 16px rgba(76, 175, 80, 0.4)";
  };

  widget.onmouseleave = () => {
    widget.style.transform = "scale(1)";
    widget.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
  };

  widget.onclick = (e) => {
    e.stopPropagation();
    
    // Check if settings exist in localStorage
    const storedSettings = loadSettings();
    if (storedSettings) {
      // Use stored settings and go straight to comment mode
      userSettings = storedSettings;
      addCreateCommentFormListener();
    } else {
      // No settings found, open dialog
      openWidgetDialog();
    }
  };

  document.body.appendChild(widget);
};
