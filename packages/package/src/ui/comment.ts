import { resolveIssue } from "../api/comments";
import type { Issue } from "@opencomments/types";
import { renderAllIssues } from "../lib/render-all-issues";

// Store reference to existing dialog to remove it when opening a new one
let existingDialog: HTMLElement | null = null;

export const comment = ({ 
  issue, 
  commentElementId,
  position 
}: { 
  issue: Issue; 
  commentElementId: string;
  position?: { x: number; y: number };
}) => {
  // Remove existing dialog if it exists
  if (existingDialog) {
    existingDialog.remove();
    existingDialog = null;
  }

  const parent = document.createElement("div");
  parent.style.position = "fixed";
  parent.style.zIndex = "10000";
  parent.style.backgroundColor = "white";
  parent.style.border = "1px solid #ccc";
  parent.style.borderRadius = "8px";
  parent.style.padding = "16px";
  parent.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  parent.style.minWidth = "200px";
  parent.style.maxWidth = "400px";
  parent.style.maxHeight = "80vh";
  parent.style.overflowY = "auto";

  // Create screenshot display if available
  let screenshotContainer: HTMLElement | null = null;
  if (issue.screenshot) {
    screenshotContainer = document.createElement("div");
    screenshotContainer.style.marginBottom = "12px";
    screenshotContainer.style.borderRadius = "4px";
    screenshotContainer.style.overflow = "hidden";
    screenshotContainer.style.border = "1px solid #e0e0e0";
    
    const screenshotImg = document.createElement("img");
    screenshotImg.src = issue.screenshot;
    screenshotImg.style.width = "100%";
    screenshotImg.style.height = "auto";
    screenshotImg.style.display = "block";
    screenshotImg.style.maxHeight = "300px";
    screenshotImg.style.objectFit = "contain";
    screenshotImg.alt = "Screenshot of the page when comment was created";
    
    screenshotContainer.appendChild(screenshotImg);
  }

  // Create comment text display
  const commentText = document.createElement("div");
  commentText.style.marginBottom = "12px";
  commentText.style.padding = "8px";
  commentText.style.backgroundColor = "#f5f5f5";
  commentText.style.borderRadius = "4px";
  commentText.style.fontSize = "14px";
  commentText.style.lineHeight = "1.5";
  commentText.style.color = "#333";
  commentText.style.wordWrap = "break-word";
  commentText.textContent = issue.description || "No description";

  // Create resolve button as a circle with green check
  const resolveButton = document.createElement("button");
  resolveButton.style.width = "32px";
  resolveButton.style.height = "32px";
  resolveButton.style.borderRadius = "50%";
  resolveButton.style.border = "2px solid #4caf50";
  resolveButton.style.backgroundColor = issue.resolved ? "#4caf50" : "white";
  resolveButton.style.cursor = "pointer";
  resolveButton.style.display = "flex";
  resolveButton.style.alignItems = "center";
  resolveButton.style.justifyContent = "center";
  resolveButton.style.marginLeft = "auto";
  resolveButton.style.marginRight = "0";
  resolveButton.style.transition = "background-color 0.2s";
  resolveButton.style.padding = "0";
  
  // Create checkmark SVG
  const checkmarkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  checkmarkSvg.setAttribute("width", "20");
  checkmarkSvg.setAttribute("height", "20");
  checkmarkSvg.setAttribute("viewBox", "0 0 24 24");
  checkmarkSvg.style.display = "block";
  
  const checkmarkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  checkmarkPath.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
  checkmarkPath.setAttribute("fill", issue.resolved ? "white" : "#4caf50");
  checkmarkSvg.appendChild(checkmarkPath);
  
  resolveButton.appendChild(checkmarkSvg);

  // Button container for alignment
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "flex-end";
  buttonContainer.appendChild(resolveButton);

  resolveButton.onclick = async (e) => {
    e.stopPropagation();
    const res = await resolveIssue(issue.id, !issue.resolved);

    if (res?.resolved) {
      // Update button appearance
      resolveButton.style.backgroundColor = "#4caf50";
      checkmarkPath.setAttribute("fill", "white");
      
      // Hide the icon
      if (typeof document.getElementById(commentElementId) !== 'undefined') {
       document.getElementById(commentElementId)!.style.display = "none";
      }
    } else {
      // Update button appearance when unresolved
      resolveButton.style.backgroundColor = "white";
      checkmarkPath.setAttribute("fill", "#4caf50");
    }
    await renderAllIssues();
    // Remove dialog after resolving
    if (existingDialog) {
      existingDialog.remove();
      existingDialog = null;
    }
  };

  // Add elements to dialog in order: screenshot, comment text, button
  if (screenshotContainer) {
    parent.appendChild(screenshotContainer);
  }
  parent.appendChild(commentText);
  parent.appendChild(buttonContainer);

  // Add click outside to close functionality
  const handleClickOutside = (event: MouseEvent) => {
    if (parent && !parent.contains(event.target as Node)) {
      parent.remove();
      existingDialog = null;
      document.removeEventListener('click', handleClickOutside);
    }
  };
  
  // Use setTimeout to avoid immediate trigger
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 0);
  
  // Position the dialog below the icon
  if (position) {
    let left = position.x;
    let top = position.y + 8; // 8px gap below icon
    
    // Ensure dialog doesn't go off-screen
    // We'll adjust after appending to get actual dialog dimensions
    parent.style.left = `${left}px`;
    parent.style.top = `${top}px`;
    
    // Append first to get dimensions, then adjust if needed
    document.body.appendChild(parent);
    
    const dialogRect = parent.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if dialog goes off right edge
    if (dialogRect.right > viewportWidth) {
      left = viewportWidth - dialogRect.width - 8; // 8px margin from edge
      parent.style.left = `${left}px`;
    }
    
    // Adjust horizontal position if dialog goes off left edge
    if (dialogRect.left < 0) {
      left = 8; // 8px margin from edge
      parent.style.left = `${left}px`;
    }
    
    // Adjust vertical position if dialog goes off bottom edge
    if (dialogRect.bottom > viewportHeight) {
      // Position above icon instead
      top = position.y - dialogRect.height - 8; // 8px gap above icon
      parent.style.top = `${top}px`;
    }
    
    // Adjust vertical position if dialog goes off top edge
    if (dialogRect.top < 0) {
      top = 8; // 8px margin from top
      parent.style.top = `${top}px`;
    }
  } else {
    // Fallback to center of screen if position not provided
    parent.style.left = "50%";
    parent.style.top = "50%";
    parent.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(parent);
  }
  
  existingDialog = parent;
};
