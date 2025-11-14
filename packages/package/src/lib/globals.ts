import { createCommentForm } from "../ui/comment-form";
import { getXPath } from "./get-xpath";
import { getUserSettings } from "../ui/widget";

// Create a custom comment icon cursor
const createCommentCursor = (): string => {
  // Create an SVG for the comment icon cursor (simplified for better cursor support)
  const svg = `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#000" stroke="#fff" stroke-width="0.5"/></svg>`;
  
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

// Escape key handler to exit comment mode
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && commentModeOverlay) {
    removeCreateCommentFormListener();
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
  
  return overlay;
};

export const addCreateCommentFormListener = () => {
  // Create and add overlay to block all clicks
  commentModeOverlay = createOverlay();
  document.body.appendChild(commentModeOverlay);
  
  // Change cursor to comment icon to indicate comment mode
  document.body.style.cursor = createCommentCursor();
  
  // Add Escape key listener to exit comment mode
  document.addEventListener("keydown", handleEscapeKey);
};

export const removeCreateCommentFormListener = () => {
  // Remove overlay
  if (commentModeOverlay) {
    commentModeOverlay.remove();
    commentModeOverlay = null;
  }
  
  // Reset cursor to normal
  document.body.style.cursor = "default";
  
  // Remove Escape key listener
  document.removeEventListener("keydown", handleEscapeKey);
};

window.comments = {
  handleMouseDown,
};
