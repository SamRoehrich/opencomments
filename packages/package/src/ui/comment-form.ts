import { createIssue } from "../api/comments";
import {
  addCreateCommentFormListener,
  removeCreateCommentFormListener,
} from "../lib/globals";
import { renderAllIssues } from "../lib/render-all-issues";
import type { ElementPositionMeta } from "../lib/types";

export const createCommentForm = (args: ElementPositionMeta) => {
  removeCreateCommentFormListener();
  const parent = document.createElement("div");
  parent.style.border = "1px solid black";
  parent.style.borderRadius = "8px";
  parent.style.backgroundColor = "white";
  parent.style.padding = "16px";
  parent.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  parent.style.minWidth = "250px";
  parent.style.maxWidth = "400px";
  parent.style.position = "fixed";
  parent.style.zIndex = "10000";
  
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
    parent.style.left = "50%";
    parent.style.top = "50%";
    parent.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(parent);
  }

  const form = document.createElement("form");
  form.style.height = "100%";
  form.style.padding = "0";
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.gap = "8px";

  const input = document.createElement("textarea");
  input.style.borderRadius = "4px";
  input.style.border = "1px solid #ccc";
  input.style.padding = "8px";
  input.style.height = "100px";
  input.style.resize = "vertical";
  input.style.fontFamily = "inherit";
  input.style.fontSize = "14px";
  input.placeholder = "Enter your comment...";

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.justifyContent = "flex-end";

  const cancelButton = document.createElement("button");
  cancelButton.innerHTML = "Cancel";
  cancelButton.style.padding = "8px 16px";
  cancelButton.style.borderRadius = "4px";
  cancelButton.style.border = "1px solid #ccc";
  cancelButton.style.backgroundColor = "white";
  cancelButton.style.color = "#333";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.fontSize = "14px";
  cancelButton.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.removeChild(parent);
    // Go back to normal mode - don't re-add listener
  };

  const submitButton = document.createElement("button");
  submitButton.innerHTML = "Comment";
  submitButton.style.padding = "8px 16px";
  submitButton.style.borderRadius = "4px";
  submitButton.style.border = "1px solid #4caf50";
  submitButton.style.backgroundColor = "#4caf50";
  submitButton.style.color = "white";
  submitButton.style.cursor = "pointer";
  submitButton.style.fontSize = "14px";
  submitButton.onclick = (e) => handleButtonClick(e, input, args, parent);

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(submitButton);

  form.appendChild(input);
  form.appendChild(buttonContainer);
  parent.appendChild(form);
  
  // Add click outside to close functionality
  const handleClickOutside = (event: MouseEvent) => {
    if (parent && !parent.contains(event.target as Node)) {
      document.body.removeChild(parent);
      document.removeEventListener('mousedown', handleClickOutside);
      // Go back to normal mode - don't re-add listener
    }
  };
  
  // Use mousedown instead of click, and add a longer delay to avoid immediate trigger
  // This ensures the click that opened the form doesn't immediately close it
  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
  }, 100);
  
  // Focus the input
  input.focus();
};

async function handleButtonClick(
  e: PointerEvent,
  input: HTMLTextAreaElement,
  elementInfo: ElementPositionMeta,
  parent: HTMLDivElement,
) {
  e.preventDefault();
  e.stopPropagation();
  const comment = input.value;
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
    user_id: "sam-test",
    env_id: "sam-test"
  });

  if (data.id) {
    document.body.removeChild(parent);
    // Don't re-add the listener - go back to normal mode
    // User needs to click the widget again to enter comment mode
    await renderAllIssues();
  }
}
