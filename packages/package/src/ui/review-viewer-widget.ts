import { createButton, createCommentIcon, createCloseIcon, createDiv } from "./elements";
import { getActiveReview, setActiveReview } from "./review-dialog";
import { getAllIssues, getIssue } from "../api/comments";
import { getUserSettings } from "./widget";
import { comment } from "./comment";
import { getReviews } from "../api/reviews";
import { clearAllIcons } from "../lib/create-comment-button";

let reviewViewerWidgetElement: HTMLElement | null = null;
let isExpanded = false;
let expandedContent: HTMLElement | null = null;
let handleEscape: ((e: KeyboardEvent) => void) | null = null;
let isReviewListExpanded = false;
let reviewListContainer: HTMLElement | null = null;

const openIssueDialog = async (issueId: number) => {
  try {
    const issue = await getIssue(issueId);
    // Find the comment element on the page if it exists
    const commentElement = document.querySelector(`[data-issue-id="${issueId}"]`);
    const commentElementId = commentElement?.id || `issue-${issueId}`;
    
    comment({
      issue,
      commentElementId,
    });
  } catch (error) {
    console.error("Failed to load issue:", error);
  }
};

const loadIssuesIntoList = async (issueListContainer: HTMLElement) => {
  issueListContainer.innerHTML = "";
  
  const loadingText = createDiv({
    className: "opencomments-review-viewer-loading",
    text: "Loading issues...",
  });
  issueListContainer.appendChild(loadingText);

  const activeReview = getActiveReview();
  if (!activeReview) {
    issueListContainer.innerHTML = "";
    const noReviewText = createDiv({
      className: "opencomments-review-viewer-error",
      text: "No active review",
    });
    issueListContainer.appendChild(noReviewText);
    return;
  }

  const settings = getUserSettings();
  const envId = settings?.env;

  let issues: any[] = [];

  try {
    issues = await getAllIssues(envId, activeReview.id);
  } catch (error) {
    console.error("Failed to load issues:", error);
    issueListContainer.innerHTML = "";
    const errorText = createDiv({
      className: "opencomments-review-viewer-error",
      text: "Failed to load issues",
    });
    issueListContainer.appendChild(errorText);
    return;
  }

  issueListContainer.innerHTML = "";

  if (issues.length === 0) {
    const noIssuesText = createDiv({
      className: "opencomments-review-viewer-empty",
      text: "No issues found",
    });
    issueListContainer.appendChild(noIssuesText);
    return;
  }

  issues.forEach((issue) => {
    const issueItem = createDiv({
      className: "opencomments-review-viewer-issue-item",
    });

    const issueDescription = issue.description
      ? createDiv({
          className: "opencomments-review-viewer-issue-description",
          text: issue.description,
        })
      : createDiv({
          className: "opencomments-review-viewer-issue-description",
          text: "No description",
        });

    const issueMeta = createDiv({
      className: "opencomments-review-viewer-issue-meta",
      text: `${issue.resolved ? "Resolved" : "Open"} • ${new Date(issue.created_at).toLocaleDateString()}`,
    });

    issueItem.appendChild(issueDescription);
    issueItem.appendChild(issueMeta);

    issueItem.onclick = async (e) => {
      e.stopPropagation();
      // Open the comment dialog for this issue
      await openIssueDialog(issue.id);
    };

    issueListContainer.appendChild(issueItem);
  });
};

const loadReviewsIntoDropdown = async (reviewDropdownContainer: HTMLElement) => {
  reviewDropdownContainer.innerHTML = "";
  
  const loadingText = createDiv({
    className: "opencomments-review-viewer-loading",
    text: "Loading reviews...",
  });
  reviewDropdownContainer.appendChild(loadingText);

  const settings = getUserSettings();
  const envId = settings?.env;

  let reviews: any[] = [];

  try {
    reviews = await getReviews(envId);
  } catch (error) {
    console.error("Failed to load reviews:", error);
    reviewDropdownContainer.innerHTML = "";
    const errorText = createDiv({
      className: "opencomments-review-viewer-error",
      text: "Failed to load reviews",
    });
    reviewDropdownContainer.appendChild(errorText);
    return;
  }

  reviewDropdownContainer.innerHTML = "";

  if (reviews.length === 0) {
    const noReviewsText = createDiv({
      className: "opencomments-review-viewer-empty",
      text: "No reviews found",
    });
    reviewDropdownContainer.appendChild(noReviewsText);
    return;
  }

  const activeReview = getActiveReview();

  reviews.forEach((review) => {
    const reviewItem = createDiv({
      className: "opencomments-review-viewer-review-item",
    });

    if (activeReview && review.id === activeReview.id) {
      reviewItem.classList.add("opencomments-review-viewer-review-item--active");
    }

    const reviewName = createDiv({
      className: "opencomments-review-viewer-review-name",
      text: review.name,
    });

    const reviewMeta = createDiv({
      className: "opencomments-review-viewer-review-meta",
      text: new Date(review.created_at).toLocaleDateString(),
    });

    reviewItem.appendChild(reviewName);
    reviewItem.appendChild(reviewMeta);

    reviewItem.onclick = async (e) => {
      e.stopPropagation();
      
      // If clicking the same review, just close the dropdown
      if (activeReview && review.id === activeReview.id) {
        collapseReviewList();
        return;
      }

      // Clear existing icons
      clearAllIcons();

      // Set new active review
      setActiveReview({
        id: review.id,
        name: review.name,
        description: review.description || undefined,
        env_id: review.env_id || undefined,
      });

      // Close dropdown and reload issues
      collapseReviewList();
      
      // Reload issues for the new review
      if (expandedContent) {
        const issueListContainer = expandedContent.querySelector(".opencomments-review-viewer-issue-list") as HTMLElement;
        if (issueListContainer) {
          await loadIssuesIntoList(issueListContainer);
        }
      }

      // Update header text
      const issuesText = expandedContent?.querySelector(".opencomments-review-viewer-issues-text") as HTMLElement;
      if (issuesText) {
        issuesText.textContent = `Issues - ${review.name}`;
      }

      // Switch to new review (stay in viewer mode)
      window.dispatchEvent(new CustomEvent("review-selected", { detail: review }));
    };

    reviewDropdownContainer.appendChild(reviewItem);
  });
};

const expandReviewList = async (dropdownContainer: HTMLElement) => {
  if (isReviewListExpanded) return;
  isReviewListExpanded = true;

  reviewListContainer = createDiv({
    className: "opencomments-review-viewer-review-dropdown",
  });

  await loadReviewsIntoDropdown(reviewListContainer);
  dropdownContainer.appendChild(reviewListContainer);

  // Add click outside handler
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
      collapseReviewList();
      document.removeEventListener("click", handleClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
};

const collapseReviewList = () => {
  if (!isReviewListExpanded || !reviewListContainer) return;
  isReviewListExpanded = false;
  
  if (reviewListContainer) {
    reviewListContainer.remove();
    reviewListContainer = null;
  }
};

const exitReview = () => {
  // Clear active review
  setActiveReview(null);
  
  // Clear all comment icons
  clearAllIcons();
  
  // Collapse widget if expanded
  collapseWidget();
  
  // Dispatch event to switch back to base widget
  window.dispatchEvent(new CustomEvent("review-exited"));
};

const expandWidget = async (widget: HTMLElement) => {
  if (isExpanded) return;
  isExpanded = true;

  // Hide the comment icon button
  const commentButton = widget.querySelector(".opencomments-widget-button");
  if (commentButton) {
    commentButton.classList.add("opencomments-review-viewer-button--hidden");
  }

  // Add expanded class to widget itself
  widget.classList.add("opencomments-review-viewer--expanded");

  // Create expanded content inside the widget
  expandedContent = createDiv({
    className: "opencomments-review-viewer-expanded",
  });

  const headerContainer = createDiv({
    className: "opencomments-review-viewer-header",
  });

  const activeReview = getActiveReview();
  const issuesText = createDiv({
    className: "opencomments-review-viewer-issues-text",
    text: activeReview ? `Issues - ${activeReview.name}` : "Issues",
  });

  // Create dropdown container for review list
  const dropdownContainer = createDiv({
    className: "opencomments-review-viewer-dropdown-container",
  });

  // Create switch review button
  const switchReviewButton = createButton({
    className: "opencomments-review-viewer-switch-button",
    text: "Switch Review",
    onClick: async (e) => {
      e.stopPropagation();
      if (isReviewListExpanded) {
        collapseReviewList();
      } else {
        await expandReviewList(dropdownContainer);
      }
    },
  });

  // Create exit review button
  const exitReviewButton = createButton({
    className: "opencomments-review-viewer-exit-button",
    text: "Exit Review",
    onClick: (e) => {
      e.stopPropagation();
      if (confirm("Are you sure you want to exit this review? All comments will be removed from the page.")) {
        exitReview();
      }
    },
  });

  const closeButton = createButton({
    className: "opencomments-review-viewer-close-button",
    children: [createCloseIcon({ className: "opencomments-review-viewer-close-icon", width: "12", height: "12" })],
    onClick: (e) => {
      e.stopPropagation();
      collapseWidget();
    },
  });

  const headerActions = createDiv({
    className: "opencomments-review-viewer-header-actions",
    children: [dropdownContainer, exitReviewButton],
  });

  dropdownContainer.appendChild(switchReviewButton);

  headerContainer.appendChild(issuesText);
  headerContainer.appendChild(headerActions);
  headerContainer.appendChild(closeButton);

  const issueListContainer = createDiv({
    className: "opencomments-review-viewer-issue-list",
  });

  expandedContent.appendChild(headerContainer);
  expandedContent.appendChild(issueListContainer);

  widget.appendChild(expandedContent);

  // Load issues
  await loadIssuesIntoList(issueListContainer);

  // Add Escape key handler
  handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      if (isReviewListExpanded) {
        collapseReviewList();
      } else {
        collapseWidget();
      }
    }
  };

  document.addEventListener("keydown", handleEscape);

  // Add click outside handler
  const handleClickOutside = (event: MouseEvent) => {
    if (widget && !widget.contains(event.target as Node)) {
      collapseReviewList();
      collapseWidget();
      document.removeEventListener("click", handleClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
};

const collapseWidget = () => {
  if (!isExpanded || !reviewViewerWidgetElement) return;
  isExpanded = false;

  // Collapse review list if open
  collapseReviewList();

  reviewViewerWidgetElement.classList.remove("opencomments-review-viewer--expanded");
  
  // Show the comment icon button again
  const commentButton = reviewViewerWidgetElement.querySelector(".opencomments-widget-button");
  if (commentButton) {
    commentButton.classList.remove("opencomments-review-viewer-button--hidden");
  }
  
  if (expandedContent) {
    expandedContent.remove();
    expandedContent = null;
  }

  // Remove event listeners
  if (handleEscape) {
    document.removeEventListener("keydown", handleEscape);
    handleEscape = null;
  }
};

export const createReviewViewerWidget = () => {
  // Remove existing widget if it exists
  if (reviewViewerWidgetElement) {
    reviewViewerWidgetElement.remove();
  }

  const activeReview = getActiveReview();
  
  const commentIcon = createCommentIcon({ className: "opencomments-widget-icon" });
  
  const commentButton = createButton({
    className: ["opencomments-widget-button", "opencomments-widget-button--comment"],
    children: [commentIcon],
    onClick: async (e) => {
      e.stopPropagation();
      if (isExpanded) {
        collapseWidget();
      } else {
        await expandWidget(reviewViewerWidgetElement!);
      }
    },
    title: activeReview ? `View issues for: ${activeReview.name}` : "View issues",
  });

  const widget = createDiv({
    className: "opencomments-review-viewer",
    children: [commentButton],
  });

  reviewViewerWidgetElement = widget;
  document.body.appendChild(widget);
};

export const removeReviewViewerWidget = () => {
  if (reviewViewerWidgetElement) {
    collapseWidget();
    reviewViewerWidgetElement.remove();
    reviewViewerWidgetElement = null;
    isExpanded = false;
  }
};

