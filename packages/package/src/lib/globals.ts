import { createCommentForm } from "../ui/comment-form";
import { getXPath } from "./get-xpath";
import { getUserSettings } from "../ui/widget";

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

  const selector = [];

  if (clickElement?.id) selector.push(`#id:${clickElement.id}`);
  if (clickElement?.class) selector.push(`class:${clickElement.class}`);
  if (clickElement) selector.push(getXPath(clickElement));
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

const createOverlay = () => {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "9997"; // Below widget (9998) but above everything else
  overlay.style.cursor = "pointer";
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
  
  return overlay;
};

export const addCreateCommentFormListener = () => {
  // Create and add overlay to block all clicks
  commentModeOverlay = createOverlay();
  document.body.appendChild(commentModeOverlay);
  
  // Change cursor to pointer to indicate comment mode
  document.body.style.cursor = "pointer";
};

export const removeCreateCommentFormListener = () => {
  // Remove overlay
  if (commentModeOverlay) {
    commentModeOverlay.remove();
    commentModeOverlay = null;
  }
  
  // Reset cursor to normal
  document.body.style.cursor = "default";
};

window.comments = {
  handleMouseDown,
};
