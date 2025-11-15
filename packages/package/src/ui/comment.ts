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
  parent.className = "opencomments-comment-dialog";

  // Create screenshot icon button if available
  let screenshotContainer: HTMLElement | null = null;
  if (issue.screenshot) {
    screenshotContainer = document.createElement("div");
    screenshotContainer.className = "opencomments-screenshot-container";
    
    const imageIconButton = document.createElement("button");
    imageIconButton.className = "opencomments-screenshot-button";
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
    imageIconSvg.setAttribute("class", "opencomments-screenshot-icon");
    
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
    
    imageIconButton.appendChild(imageIconSvg);
    
    imageIconButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (issue.screenshot) {
        window.open(issue.screenshot, "_blank");
      }
    };
    
    screenshotContainer.appendChild(imageIconButton);
    
    const imageLabel = document.createElement("span");
    imageLabel.className = "opencomments-screenshot-label";
    imageLabel.textContent = "View screenshot";
    imageLabel.onclick = () => {
      if (issue.screenshot) {
        window.open(issue.screenshot, "_blank");
      }
    };
    screenshotContainer.appendChild(imageLabel);
  }

  // Create comment text display
  const commentText = document.createElement("div");
  commentText.className = "opencomments-comment-text";
  commentText.textContent = issue.description || "No description";

  // Create resolve button as a circle with green check
  const resolveButton = document.createElement("button");
  resolveButton.className = `opencomments-resolve-button${issue.resolved ? " opencomments-resolve-button--resolved" : ""}`;
  
  // Create checkmark SVG
  const checkmarkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  checkmarkSvg.setAttribute("width", "20");
  checkmarkSvg.setAttribute("height", "20");
  checkmarkSvg.setAttribute("viewBox", "0 0 24 24");
  checkmarkSvg.setAttribute("class", "opencomments-resolve-checkmark");
  
  const checkmarkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  checkmarkPath.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
  checkmarkPath.setAttribute("fill", issue.resolved ? "white" : "#4caf50");
  checkmarkSvg.appendChild(checkmarkPath);
  
  resolveButton.appendChild(checkmarkSvg);

  // Button container for alignment
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "opencomments-resolve-button-container";
  buttonContainer.appendChild(resolveButton);

  resolveButton.onclick = async (e) => {
    e.stopPropagation();
    const res = await resolveIssue(issue.id, !issue.resolved);

    if (res?.resolved) {
      // Update button appearance
      resolveButton.className = "opencomments-resolve-button opencomments-resolve-button--resolved";
      checkmarkPath.setAttribute("fill", "white");
      
      // Hide the icon
      if (typeof document.getElementById(commentElementId) !== 'undefined') {
       document.getElementById(commentElementId)!.style.display = "none";
      }
    } else {
      // Update button appearance when unresolved
      resolveButton.className = "opencomments-resolve-button";
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
  commentsSection.className = "opencomments-comments-section";

  const commentsTitle = document.createElement("div");
  commentsTitle.className = "opencomments-comments-title";
  commentsTitle.textContent = "Comments";

  const commentsList = document.createElement("div");
  commentsList.className = "opencomments-comments-list";

  // Comment form
  const commentForm = document.createElement("div");
  commentForm.className = "opencomments-comment-form";

  const commentInput = document.createElement("textarea");
  commentInput.className = "opencomments-comment-input";
  commentInput.placeholder = "Add a comment...";

  const submitCommentButton = document.createElement("button");
  submitCommentButton.className = "opencomments-submit-comment-button";
  submitCommentButton.textContent = "Post Comment";

  const renderComments = async () => {
    try {
      const comments = await getComments(issue.id);
      commentsList.innerHTML = "";

      if (comments.length === 0) {
        const noComments = document.createElement("div");
        noComments.className = "opencomments-no-comments";
        noComments.textContent = "No comments yet";
        commentsList.appendChild(noComments);
      } else {
        comments.forEach((comment: Comment) => {
          const commentItem = document.createElement("div");
          commentItem.className = "opencomments-comment-item";

          const commentText = document.createElement("div");
          commentText.className = "opencomments-comment-item-text";
          commentText.textContent = comment.comment;

          const commentMeta = document.createElement("div");
          commentMeta.className = "opencomments-comment-item-meta";
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
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  // Add Escape key handler to close dialog
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      parent.remove();
      existingDialog = null;
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  // Use setTimeout to avoid immediate trigger
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
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
    parent.className = "opencomments-comment-dialog opencomments-comment-dialog--centered";
    document.body.appendChild(parent);
  }
  
  existingDialog = parent;
};
