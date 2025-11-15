import { createCommentForm } from "../ui/comment-form";
import { getXPath } from "./get-xpath";

// Create a custom comment icon cursor
const createCommentCursor = (): string => {
  // Create an SVG for the comment icon cursor (transparent fill)
  const svg = `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="rgba(17, 17, 17, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  
  // Convert SVG to data URL
  const encodedSvg = encodeURIComponent(svg);
  return `url("data:image/svg+xml,${encodedSvg}") 10 10, pointer`;
};

const handleMouseDown = (e: MouseEvent) => {
  // Prevent the click from reaching underlying elements
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  // Get the element underneath the overlay using coordinates
  // Temporarily hide overlay to get the element
  if (commentModeOverlay) {
    commentModeOverlay.style.pointerEvents = "none";
  }
  
  const clickElement = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
  
  // Restore overlay
  if (commentModeOverlay) {
    commentModeOverlay.style.pointerEvents = "auto";
  }
  
  if (!clickElement) {
    console.error("idk what you clicked but you can't leave a comment on it");
    return;
  }

  // Skip if clicking on the widget or overlay itself
  if (clickElement === commentModeOverlay || clickElement.closest('[style*="z-index: 9998"]')) {
    return;
  }

  const selector: string[] = [];

  if (clickElement?.id) selector.push(`#id:${clickElement.id}`);
  if (clickElement?.className) selector.push(`class:${clickElement.className}`);
  const xpath = getXPath(clickElement);
  if (xpath) selector.push(xpath);
  const relativeX = e.clientX - clickElement.getBoundingClientRect().left;
  const relativeY = e.clientY - clickElement.getBoundingClientRect().top;

  const clickElementWidth = clickElement.offsetWidth;
  const clickElementHeight = clickElement.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Get click position for form placement
  const clickX = e.clientX;
  const clickY = e.clientY;

  createCommentForm({
    selector,
    relativeX,
    relativeY,
    clickElementWidth,
    clickElementHeight,
    viewportWidth,
    viewportHeight,
    clickPosition: { x: clickX, y: clickY }
  });
};

// Overlay element to block all clicks
let commentModeOverlay: HTMLElement | null = null;

// Escape key handler to exit comment mode or close dialogs
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" || e.keyCode === 27) {
    e.preventDefault();
    e.stopPropagation();
    
    // First, check if there's a comment dialog open and close it
    const commentDialog = document.querySelector('.opencomments-comment-dialog') as HTMLElement;
    if (commentDialog) {
      commentDialog.remove();
      // Clean up any event listeners by removing and re-adding would be handled by the dialog itself
      return; // Don't exit comment mode, just close the dialog
    }
    
    // Check if there's a comment form open and close it
    const commentForm = document.querySelector('.opencomments-create-form') as HTMLElement;
    if (commentForm) {
      // Remove the form and clean up click-outside listener
      if (commentForm.parentNode) {
        commentForm.parentNode.removeChild(commentForm);
      }
      return; // Don't exit comment mode, just close the form
    }
    
    // Check if there's a settings dialog open and close it
    const settingsDialog = document.querySelector('.opencomments-settings-dialog') as HTMLElement;
    if (settingsDialog) {
      settingsDialog.remove();
      return; // Don't exit comment mode, just close the settings dialog
    }
    
    // If no dialogs are open and we're in comment mode, exit comment mode
    if (commentModeOverlay) {
      removeCreateCommentFormListener();
    }
  }
};


const createOverlay = () => {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "9997"; // Below widget (9998) but above everything else
  overlay.style.cursor = createCommentCursor();
  overlay.style.backgroundColor = "transparent";
  overlay.style.pointerEvents = "auto";
  
  // Prevent all interactions
  overlay.onmousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Call the actual handler
    handleMouseDown(e);
  };
  
  overlay.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  overlay.oncontextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  // Prevent other mouse events
  overlay.onmouseup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  // Prevent all pointer events from reaching underlying elements
  overlay.ontouchstart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  overlay.ontouchmove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  overlay.ontouchend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  // Handle Escape key on overlay as well
  overlay.onkeydown = (e) => {
    if (e.key === "Escape" || e.keyCode === 27) {
      handleEscapeKey(e);
    }
  };
  
  // Make overlay focusable for keyboard events
  overlay.setAttribute("tabindex", "-1");
  
  return overlay;
};

export const addCreateCommentFormListener = () => {
  // Create and add overlay to block all clicks
  commentModeOverlay = createOverlay();
  document.body.appendChild(commentModeOverlay);
  
  // Change cursor to comment icon to indicate comment mode
  document.body.style.cursor = createCommentCursor();
  
  // Also apply cursor to widget so it shows when hovering over it
  const widget = document.querySelector('.opencomments-widget') as HTMLElement;
  if (widget) {
    widget.style.cursor = createCommentCursor();
    widget.classList.add('opencomments-widget--comment-mode');
  }
  
  // Add Escape key listener to exit comment mode (use capture phase to catch it early)
  // Use both window and document to ensure we catch it
  window.addEventListener("keydown", handleEscapeKey, true);
  document.addEventListener("keydown", handleEscapeKey, true);
  
  // Focus overlay to ensure keyboard events work
  if (commentModeOverlay) {
    commentModeOverlay.focus();
  }
  
  // Update widget mode indicator
  updateWidgetModeIndicator(true);
};

export const removeCreateCommentFormListener = () => {
  // Remove overlay
  if (commentModeOverlay) {
    commentModeOverlay.remove();
    commentModeOverlay = null;
  }
  
  // Reset cursor to normal
  document.body.style.cursor = "default";
  
  // Reset widget cursor
  const widget = document.querySelector('.opencomments-widget') as HTMLElement;
  if (widget) {
    widget.style.cursor = "";
    widget.classList.remove('opencomments-widget--comment-mode');
  }
  
  // Remove Escape key listener
  window.removeEventListener("keydown", handleEscapeKey, true);
  document.removeEventListener("keydown", handleEscapeKey, true);
  
  // Update widget mode indicator
  updateWidgetModeIndicator(false);
};

// Update widget mode indicator - darken widget when in comment mode
const updateWidgetModeIndicator = (isCommentMode: boolean) => {
  const widget = document.querySelector('.opencomments-widget') as HTMLElement;
  if (!widget) return;
  
  if (isCommentMode) {
    widget.classList.add('opencomments-widget--active');
  } else {
    widget.classList.remove('opencomments-widget--active');
  }
};

if (typeof window !== "undefined") {
  (window as any).comments = {
    handleMouseDown,
  };
}
