import { createButton, createCloseIcon, createCommentIcon, createDiv } from "./elements";
import { openReviewDialog, getActiveReview, setActiveReview } from "./review-dialog";
import { getReviews } from "../api/reviews";
import { getUserSettings } from "./widget";

let baseWidgetElement: HTMLElement | null = null;
let isExpanded = false;
let expandedContent: HTMLElement | null = null;
let createNewButton: HTMLElement | null = null;
let handleEscape: ((e: KeyboardEvent) => void) | null = null;
let handleCommandEnter: ((e: KeyboardEvent) => void) | null = null;

const loadReviewsIntoList = async (reviewListContainer: HTMLElement) => {
  reviewListContainer.innerHTML = "";
  
  const loadingText = createDiv({
    className: "opencomments-base-widget-loading",
    text: "Loading reviews...",
  });
  reviewListContainer.appendChild(loadingText);

  const settings = getUserSettings();
  const envId = settings?.env;

  let reviews: any[] = [];

  try {
    reviews = await getReviews(envId);
  } catch (error) {
    console.error("Failed to load reviews:", error);
    reviewListContainer.innerHTML = "";
    const errorText = createDiv({
      className: "opencomments-base-widget-error",
      text: "Failed to load reviews",
    });
    reviewListContainer.appendChild(errorText);
    return;
  }

  reviewListContainer.innerHTML = "";

  if (reviews.length === 0) {
    const noReviewsText = createDiv({
      className: "opencomments-base-widget-empty",
      text: "No reviews found",
    });
    reviewListContainer.appendChild(noReviewsText);
    return;
  }

  reviews.forEach((review) => {
    const reviewItem = createDiv({
      className: "opencomments-base-widget-review-item",
    });

    const reviewName = createDiv({
      className: "opencomments-base-widget-review-name",
      text: review.name,
    });

    const reviewDescription = review.description
      ? createDiv({
          className: "opencomments-base-widget-review-description",
          text: review.description,
        })
      : null;

    const reviewMeta = createDiv({
      className: "opencomments-base-widget-review-meta",
      text: new Date(review.created_at).toLocaleDateString(),
    });

    reviewItem.appendChild(reviewName);
    if (reviewDescription) {
      reviewItem.appendChild(reviewDescription);
    }
    reviewItem.appendChild(reviewMeta);

    reviewItem.onclick = async (e) => {
      e.stopPropagation();

      // Set active review
      setActiveReview({
        id: review.id,
        name: review.name,
        description: review.description || undefined,
        env_id: review.env_id || undefined,
      });

      // Collapse widget
      collapseWidget();

      // Switch to full widget and load comments
      window.dispatchEvent(new CustomEvent("review-started", { detail: review }));
    };

    reviewListContainer.appendChild(reviewItem);
  });
};

const expandWidget = async (widget: HTMLElement) => {
  if (isExpanded) return;
  isExpanded = true;

  // Hide the comment icon button
  const reviewButton = widget.querySelector(".opencomments-widget-button");
  if (reviewButton) {
    reviewButton.classList.add("opencomments-base-widget-button--hidden");
  }

  // Add expanded class to widget itself
  widget.classList.add("opencomments-base-widget--expanded");

  // Create expanded content inside the widget
  expandedContent = createDiv({
    className: "opencomments-base-widget-expanded",
  });

  const headerContainer = createDiv({
    className: "opencomments-base-widget-header",
  });

  const reviewsText = createDiv({
    className: "opencomments-base-widget-reviews-text",
    text: "Reviews",
  });

  const closeButton = createButton({
    className: "opencomments-base-widget-close-button",
    children: [createCloseIcon({ className: "opencomments-base-widget-close-icon", width: "12", height: "12" })],
    onClick: (e) => {
      e.stopPropagation();
      collapseWidget();
    },
  });

  headerContainer.appendChild(reviewsText);
  headerContainer.appendChild(closeButton);

  const reviewListContainer = createDiv({
    className: "opencomments-base-widget-review-list",
  });

  createNewButton = createButton({
    className: "opencomments-base-widget-create-button",
    text: "Start New Review",
    onClick: (e) => {
      e.stopPropagation();
      collapseWidget();
      openReviewDialog();
    },
  });

  expandedContent.appendChild(headerContainer);
  expandedContent.appendChild(reviewListContainer);
  expandedContent.appendChild(createNewButton);

  widget.appendChild(expandedContent);

  // Load reviews
  await loadReviewsIntoList(reviewListContainer);

  // Add Escape key handler
  handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      collapseWidget();
    }
  };

  // Add Command+Enter handler
  handleCommandEnter = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      collapseWidget();
      openReviewDialog();
    }
  };

  document.addEventListener("keydown", handleEscape);
  document.addEventListener("keydown", handleCommandEnter);

  // Add click outside handler
  const handleClickOutside = (event: MouseEvent) => {
    if (widget && !widget.contains(event.target as Node)) {
      collapseWidget();
      document.removeEventListener("click", handleClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
};

const collapseWidget = () => {
  if (!isExpanded || !baseWidgetElement) return;
  isExpanded = false;

  baseWidgetElement.classList.remove("opencomments-base-widget--expanded");
  
  // Show the comment icon button again
  const reviewButton = baseWidgetElement.querySelector(".opencomments-widget-button");
  if (reviewButton) {
    reviewButton.classList.remove("opencomments-base-widget-button--hidden");
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

  if (handleCommandEnter) {
    document.removeEventListener("keydown", handleCommandEnter);
    handleCommandEnter = null;
  }
};

export const createBaseWidget = () => {
  // Remove existing base widget if it exists
  if (baseWidgetElement) {
    baseWidgetElement.remove();
  }

  const activeReview = getActiveReview();
  
  const reviewIcon = createCommentIcon({ className: "opencomments-widget-icon" });
  
  const reviewButton = createButton({
    className: ["opencomments-widget-button", "opencomments-widget-button--comment"],
    children: [reviewIcon],
    onClick: async (e) => {
      e.stopPropagation();
      if (isExpanded) {
        collapseWidget();
      } else {
        await expandWidget(baseWidgetElement!);
      }
    },
    title: activeReview ? `Active: ${activeReview.name}` : "Select or create a review",
  });

  const widget = createDiv({
    className: "opencomments-base-widget",
    children: [reviewButton],
  });

  baseWidgetElement = widget;
  document.body.appendChild(widget);
};

export const removeBaseWidget = () => {
  if (baseWidgetElement) {
    collapseWidget();
    baseWidgetElement.remove();
    baseWidgetElement = null;
    isExpanded = false;
  }
};
