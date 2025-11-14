import { resolveIssue, getComments, createComment } from "../api/comments";
import type { Issue, Comment } from "@opencomments/types";
import { renderAllIssues } from "../lib/render-all-issues";
import { getUserSettings } from "./widget";

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
  parent.style.minWidth = "300px";
  parent.style.maxWidth = "500px";
  parent.style.maxHeight = "85vh";
  parent.style.overflowY = "auto";

  // Create screenshot icon button if available
  let screenshotContainer: HTMLElement | null = null;
  if (issue.screenshot) {
    screenshotContainer = document.createElement("div");
    screenshotContainer.style.marginBottom = "12px";
    screenshotContainer.style.display = "flex";
    screenshotContainer.style.alignItems = "center";
    screenshotContainer.style.gap = "8px";
    
    const imageIconButton = document.createElement("button");
    imageIconButton.style.display = "flex";
    imageIconButton.style.alignItems = "center";
    imageIconButton.style.justifyContent = "center";
    imageIconButton.style.padding = "8px";
    imageIconButton.style.border = "1px solid #e0e0e0";
    imageIconButton.style.borderRadius = "4px";
    imageIconButton.style.backgroundColor = "white";
    imageIconButton.style.cursor = "pointer";
    imageIconButton.style.transition = "background-color 0.2s, border-color 0.2s";
    imageIconButton.style.width = "40px";
    imageIconButton.style.height = "40px";
    imageIconButton.title = "View screenshot";
    
    // Create image icon SVG
    const imageIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    imageIconSvg.setAttribute("width", "20");
    imageIconSvg.setAttribute("height", "20");
    imageIconSvg.setAttribute("viewBox", "0 0 24 24");
    imageIconSvg.setAttribute("fill", "none");
    imageIconSvg.setAttribute("stroke", "currentColor");
    imageIconSvg.setAttribute("stroke-width", "2");
    imageIconSvg.setAttribute("stroke-linecap", "round");
    imageIconSvg.setAttribute("stroke-linejoin", "round");
    
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "3");
    rect.setAttribute("y", "3");
    rect.setAttribute("width", "18");
    rect.setAttribute("height", "18");
    rect.setAttribute("rx", "2");
    rect.setAttribute("ry", "2");
    imageIconSvg.appendChild(rect);
    
    const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle1.setAttribute("cx", "9");
    circle1.setAttribute("cy", "9");
    circle1.setAttribute("r", "2");
    imageIconSvg.appendChild(circle1);
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21");
    imageIconSvg.appendChild(path);
    
    imageIconSvg.style.color = "#6b7280";
    imageIconButton.appendChild(imageIconSvg);
    
    imageIconButton.onmouseenter = () => {
      imageIconButton.style.backgroundColor = "#f3f4f6";
      imageIconButton.style.borderColor = "#9ca3af";
    };
    
    imageIconButton.onmouseleave = () => {
      imageIconButton.style.backgroundColor = "white";
      imageIconButton.style.borderColor = "#e0e0e0";
    };
    
    imageIconButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (issue.screenshot) {
        window.open(issue.screenshot, "_blank");
      }
    };
    
    screenshotContainer.appendChild(imageIconButton);
    
    const imageLabel = document.createElement("span");
    imageLabel.textContent = "View screenshot";
    imageLabel.style.fontSize = "14px";
    imageLabel.style.color = "#6b7280";
    imageLabel.style.cursor = "pointer";
    imageLabel.onclick = () => {
      if (issue.screenshot) {
        window.open(issue.screenshot, "_blank");
      }
    };
    screenshotContainer.appendChild(imageLabel);
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

  // Comments section
  const commentsSection = document.createElement("div");
  commentsSection.style.marginTop = "16px";
  commentsSection.style.borderTop = "1px solid #e0e0e0";
  commentsSection.style.paddingTop = "16px";

  const commentsTitle = document.createElement("div");
  commentsTitle.style.fontSize = "16px";
  commentsTitle.style.fontWeight = "600";
  commentsTitle.style.marginBottom = "12px";
  commentsTitle.style.color = "#333";
  commentsTitle.textContent = "Comments";

  const commentsList = document.createElement("div");
  commentsList.style.marginBottom = "12px";
  commentsList.style.maxHeight = "200px";
  commentsList.style.overflowY = "auto";

  // Comment form
  const commentForm = document.createElement("div");
  commentForm.style.display = "flex";
  commentForm.style.flexDirection = "column";
  commentForm.style.gap = "8px";

  const commentInput = document.createElement("textarea");
  commentInput.style.width = "100%";
  commentInput.style.padding = "8px";
  commentInput.style.border = "1px solid #ccc";
  commentInput.style.borderRadius = "4px";
  commentInput.style.fontSize = "14px";
  commentInput.style.fontFamily = "inherit";
  commentInput.style.resize = "vertical";
  commentInput.style.minHeight = "60px";
  commentInput.placeholder = "Add a comment...";

  const submitCommentButton = document.createElement("button");
  submitCommentButton.textContent = "Post Comment";
  submitCommentButton.style.padding = "6px 12px";
  submitCommentButton.style.borderRadius = "4px";
  submitCommentButton.style.border = "1px solid #4caf50";
  submitCommentButton.style.backgroundColor = "#4caf50";
  submitCommentButton.style.color = "white";
  submitCommentButton.style.cursor = "pointer";
  submitCommentButton.style.fontSize = "14px";
  submitCommentButton.style.alignSelf = "flex-end";

  const renderComments = async () => {
    try {
      const comments = await getComments(issue.id);
      commentsList.innerHTML = "";

      if (comments.length === 0) {
        const noComments = document.createElement("div");
        noComments.style.padding = "8px";
        noComments.style.color = "#999";
        noComments.style.fontSize = "14px";
        noComments.style.fontStyle = "italic";
        noComments.textContent = "No comments yet";
        commentsList.appendChild(noComments);
      } else {
        comments.forEach((comment: Comment) => {
          const commentItem = document.createElement("div");
          commentItem.style.marginBottom = "12px";
          commentItem.style.padding = "8px";
          commentItem.style.backgroundColor = "#f9f9f9";
          commentItem.style.borderRadius = "4px";
          commentItem.style.borderLeft = "3px solid #4caf50";

          const commentText = document.createElement("div");
          commentText.style.fontSize = "14px";
          commentText.style.color = "#333";
          commentText.style.marginBottom = "4px";
          commentText.style.wordWrap = "break-word";
          commentText.textContent = comment.comment;

          const commentMeta = document.createElement("div");
          commentMeta.style.fontSize = "12px";
          commentMeta.style.color = "#999";
          const date = new Date(comment.created_at);
          commentMeta.textContent = `By ${comment.user_id} • ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

          commentItem.appendChild(commentText);
          commentItem.appendChild(commentMeta);
          commentsList.appendChild(commentItem);
        });
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  submitCommentButton.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
      return;
    }

    submitCommentButton.disabled = true;
    submitCommentButton.textContent = "Posting...";

    try {
      const settings = getUserSettings();
      if (!settings) {
        alert("Please configure your name and environment first");
        submitCommentButton.disabled = false;
        submitCommentButton.textContent = "Post Comment";
        return;
      }

      await createComment({
        comment: commentText,
        issue_id: issue.id,
        user_id: settings.name,
      });
      
      commentInput.value = "";
      await renderComments();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      submitCommentButton.disabled = false;
      submitCommentButton.textContent = "Post Comment";
    }
  };

  commentForm.appendChild(commentInput);
  commentForm.appendChild(submitCommentButton);

  commentsSection.appendChild(commentsTitle);
  commentsSection.appendChild(commentsList);
  commentsSection.appendChild(commentForm);

  // Add elements to dialog in order: screenshot, comment text, button, comments
  if (screenshotContainer) {
    parent.appendChild(screenshotContainer);
  }
  parent.appendChild(commentText);
  parent.appendChild(buttonContainer);
  parent.appendChild(commentsSection);

  // Load comments
  renderComments();

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
