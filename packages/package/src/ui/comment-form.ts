import { createIssue } from "../api/comments";
import {
  removeCreateCommentFormListener,
} from "../lib/globals";
import { renderAllIssues } from "../lib/render-all-issues";
import type { ElementPositionMeta } from "../lib/types";
import { captureViewportScreenshot } from "../lib/capture-screenshot";
import {
  createButton,
  createTextarea,
  createForm,
  createDiv,
  addDialogSubmitShortcut,
} from "./elements";

export const createCommentForm = (args: ElementPositionMeta) => {
  // Don't disable comment mode yet - keep it active while form is open
  // It will be disabled after successful submission or cancellation
  
  // Remove existing dialog if it exists
  (window as any).OpenComments.dialog.remove();
  
  const parent = createDiv({
    className: args.clickPosition 
      ? "opencomments-create-form" 
      : ["opencomments-create-form", "opencomments-create-form--centered"],
  });
  
  // Position the form below where the user clicked
  if (args.clickPosition) {
    parent.style.left = `${args.clickPosition.x}px`;
    parent.style.top = `${args.clickPosition.y + 8}px`; // 8px gap below click
    
    // Append first to get dimensions, then adjust if needed
    document.body.appendChild(parent);
    
    const formRect = parent.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if form goes off right edge
    if (formRect.right > viewportWidth) {
      parent.style.left = `${viewportWidth - formRect.width - 8}px`;
    }
    
    // Adjust horizontal position if form goes off left edge
    if (formRect.left < 0) {
      parent.style.left = "8px";
    }
    
    // Adjust vertical position if form goes off bottom edge
    if (formRect.bottom > viewportHeight) {
      // Position above click instead
      parent.style.top = `${args.clickPosition.y - formRect.height - 8}px`;
    }
    
    // Adjust vertical position if form goes off top edge
    if (formRect.top < 0) {
      parent.style.top = "8px";
    }
  } else {
    // Fallback to center if no position provided
    document.body.appendChild(parent);
  }

  const input = createTextarea({
    className: "opencomments-create-form-textarea",
    placeholder: "Enter your comment...",
  });

  const buttonContainer = createDiv({
    className: "opencomments-create-form-button-container",
  });

  const submitButton = createButton({
    className: "opencomments-create-form-button--submit",
    innerHTML: "Comment",
  });

  const cancelButton = createButton({
    className: "opencomments-create-form-button--cancel",
    innerHTML: "Cancel",
  });

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(submitButton);

  const form = createForm({
    className: "opencomments-create-form-inner",
    children: [input, buttonContainer],
  });

  parent.appendChild(form);
  
  // Add keyboard shortcut support (must be after form is appended)
  const cleanupSubmitShortcut = addDialogSubmitShortcut(parent, submitButton);

  // Define handlers after cleanupSubmitShortcut is defined
  const handleClickOutside = (event: MouseEvent) => {
    if (parent && !parent.contains(event.target as Node)) {
      cleanupSubmitShortcut();
      (window as any).OpenComments.dialog.remove();
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      // Disable comment mode when form is closed
      removeCreateCommentFormListener();
    }
  };

  // Add Escape key handler to close form
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      cleanupSubmitShortcut();
      (window as any).OpenComments.dialog.remove();
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      // Disable comment mode when form is closed
      removeCreateCommentFormListener();
    }
  };

  // Set button handlers after handlers are defined
  submitButton.onclick = (e) => handleButtonClick(e, input, args, parent, submitButton, handleClickOutside, handleEscape);
  
  cancelButton.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cleanupSubmitShortcut();
    (window as any).OpenComments.dialog.remove();
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleEscape);
    // Disable comment mode when form is cancelled
    removeCreateCommentFormListener();
  };
  
  // Use mousedown instead of click, and add a longer delay to avoid immediate trigger
  // This ensures the click that opened the form doesn't immediately close it
  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
  }, 100);
  
  // Register the form with the dialog manager
  (window as any).OpenComments.dialog.set(parent);
  
  // Focus the input
  input.focus();
};

async function handleButtonClick(
  e: PointerEvent,
  input: HTMLTextAreaElement,
  elementInfo: ElementPositionMeta,
  parent: HTMLDivElement,
  submitButton: HTMLButtonElement,
  handleClickOutside: (event: MouseEvent) => void,
  handleEscape: (event: KeyboardEvent) => void,
) {
  e.preventDefault();
  e.stopPropagation();
  const comment = input.value;
  
  // Disable button while processing
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = "Capturing...";
  
  // Capture screenshot before creating the issue
  const screenshot = await captureViewportScreenshot();
  
  submitButton.innerHTML = "Creating...";
  
  // Get user settings from widget
  const { getUserSettings } = await import("../ui/widget");
  const settings = getUserSettings();
  
  if (!settings) {
    alert("Please configure your name and environment first");
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
    return;
  }

  // Get active review if one exists
  const { getActiveReview } = await import("./review-dialog");
  const activeReview = getActiveReview();

  const data = await createIssue({
    relative_x: elementInfo.relativeX,
    relative_y: elementInfo.relativeY,
    element_width: elementInfo.clickElementWidth,
    element_height: elementInfo.clickElementHeight,
    selector: elementInfo.selector,
    viewport_width: elementInfo.viewportWidth,
    viewport_height: elementInfo.viewportHeight,
    resolved: false,
    description: comment,
    url: window.location.href,
    user_id: settings.name,
    env_id: settings.env,
    review_id: activeReview?.id,
    screenshot: screenshot || undefined
  });

  if (data.id) {
    // Cleanup is handled by the dialog manager when removing
    (window as any).OpenComments.dialog.remove();
    // Clean up all listeners
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleEscape);
    // Disable comment mode after successful comment creation
    // User needs to click the comment button or press 'c' again to enter comment mode
    removeCreateCommentFormListener();
    await renderAllIssues();
  } else {
    // Re-enable button if creation failed
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
}
