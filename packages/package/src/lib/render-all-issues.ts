import { getAllIssues } from "../api/comments";
import { createCommentButton } from "./create-comment-button";
import { getUserSettings } from "../ui/widget";
import { getActiveReview } from "../ui/review-dialog";

export const renderAllIssues = async () => {
  const activeReview = getActiveReview();
  
  // Only load issues if there's an active review
  if (!activeReview) {
    return;
  }
  
  const settings = getUserSettings();
  const envId = settings?.env;
  
  // Load issues for the active review
  const issues = await getAllIssues(envId, activeReview.id);
  console.log({ issues, envId, reviewId: activeReview.id });
  issues.forEach(issue => {
     !issue.resolved && createCommentButton(issue);
  });
};

