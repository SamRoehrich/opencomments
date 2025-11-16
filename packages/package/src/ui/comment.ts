import { resolveIssue, getComments, createComment } from "../api/comments";
import type { Issue, Comment } from "@opencomments/types";
import { renderAllIssues } from "../lib/render-all-issues";
import { getUserSettings } from "./widget";
import {
  createButton,
  createTextarea,
  createDiv,
  createSpan,
  createScreenshotIcon,
  createCheckmarkIcon,
} from "./elements";

export const comment = ({
  issue,
  commentElementId,
  position,
}: {
  issue: Issue;
  commentElementId: string;
  position?: { x: number; y: number };
}) => {
  // Remove existing dialog if it exists
  (window as any).OpenComments.dialog.remove();

  const parent = createDiv({
    className: "opencomments-comment-dialog",
  });

  // Create screenshot icon button if available
  let screenshotContainer: HTMLElement | null = null;
  if (issue?.screenshot) {
    const screenshotIcon = createScreenshotIcon({
      className: "opencomments-screenshot-icon",
    });

    const imageIconButton = createButton({
      className: "opencomments-screenshot-button",
      title: "View screenshot",
      children: [screenshotIcon],
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (issue.screenshot) {
          window.open(issue.screenshot, "_blank");
        }
      },
    });

    const imageLabel = createSpan({
      className: "opencomments-screenshot-label",
      text: "View screenshot",
      onClick: () => {
        if (issue.screenshot) {
          window.open(issue.screenshot, "_blank");
        }
      },
    });

    screenshotContainer = createDiv({
      className: "opencomments-screenshot-container",
      children: [imageIconButton, imageLabel],
    });
  }

  // Create comment text display
  const commentText = createDiv({
    className: "opencomments-comment-text",
    text: issue?.description || "No description",
  });

  // Create resolve button as a circle with green check
  const checkmarkIcon = createCheckmarkIcon({
    className: "opencomments-resolve-checkmark",
    fill: issue.resolved ? "white" : "#4caf50",
  });

  const resolveButton = createButton({
    className: [
      "opencomments-resolve-button",
      issue?.resolved ? "opencomments-resolve-button--resolved" : "",
    ].filter(Boolean),
    children: [checkmarkIcon],
  });

  // Button container for alignment
  const buttonContainer = createDiv({
    className: "opencomments-resolve-button-container",
    children: [resolveButton],
  });

  resolveButton.onclick = async (e) => {
    e.stopPropagation();
    const res = await resolveIssue(issue.id, !issue.resolved);

    if (res?.resolved) {
      // Update button appearance
      resolveButton.className =
        "opencomments-resolve-button opencomments-resolve-button--resolved";
      const checkmarkPath = checkmarkIcon.querySelector("path");
      if (checkmarkPath) {
        checkmarkPath.setAttribute("fill", "white");
      }

      // Hide the icon
      if (typeof document.getElementById(commentElementId) !== "undefined") {
        document.getElementById(commentElementId)!.style.display = "none";
      }
    } else {
      // Update button appearance when unresolved
      resolveButton.className = "opencomments-resolve-button";
      const checkmarkPath = checkmarkIcon.querySelector("path");
      if (checkmarkPath) {
        checkmarkPath.setAttribute("fill", "#4caf50");
      }
    }
    await renderAllIssues();
    // Remove dialog after resolving
    (window as any).OpenComments.dialog.remove();
  };

  // Comments section
  const commentsSection = createDiv({
    className: "opencomments-comments-section",
  });

  const commentsTitle = createDiv({
    className: "opencomments-comments-title",
    text: "Comments",
  });

  const commentsList = createDiv({
    className: "opencomments-comments-list",
  });

  // Comment form
  const commentInput = createTextarea({
    className: "opencomments-comment-input",
    placeholder: "Add a comment...",
  });

  const submitCommentButton = createButton({
    className: "opencomments-submit-comment-button",
    text: "Post Comment",
  });

  const commentForm = createDiv({
    className: "opencomments-comment-form",
    children: [commentInput, submitCommentButton],
  });

  const renderComments = async () => {
    try {
      const comments = await getComments(issue.id);
      commentsList.innerHTML = "";

      if (comments.length === 0) {
        const noComments = createDiv({
          className: "opencomments-no-comments",
          text: "No comments yet",
        });
        commentsList.appendChild(noComments);
      } else {
        comments.forEach((comment: Comment) => {
          const commentText = createDiv({
            className: "opencomments-comment-item-text",
            text: comment.comment,
          });

          const date = new Date(comment.created_at);
          const commentMeta = createDiv({
            className: "opencomments-comment-item-meta",
            text: `By ${comment.user_id} • ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
          });

          const commentItem = createDiv({
            className: "opencomments-comment-item",
            children: [commentText, commentMeta],
          });

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

  commentsSection.appendChild(commentsTitle);
  commentsSection.appendChild(commentsList);
  commentsSection.appendChild(commentForm);

  // Add elements to dialog in order: screenshot, comment text, button, comments
  const dialogChildren: HTMLElement[] = [commentText, buttonContainer, commentsSection];
  if (screenshotContainer) {
    dialogChildren.unshift(screenshotContainer);
  }
  dialogChildren.forEach(child => parent.appendChild(child));

  // Load comments
  renderComments();

  // Add click outside to close functionality
  const handleClickOutside = (event: MouseEvent) => {
    if (parent && !parent.contains(event.target as Node)) {
      (window as any).OpenComments.dialog.remove();
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
  };

  // Add Escape key handler to close dialog
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      (window as any).OpenComments.dialog.remove();
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
  };

  // Use setTimeout to avoid immediate trigger
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
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
    parent.className =
      "opencomments-comment-dialog opencomments-comment-dialog--centered";
    document.body.appendChild(parent);
  }

  (window as any).OpenComments.dialog.set(parent);
};
